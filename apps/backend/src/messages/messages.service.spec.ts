import { Test, TestingModule } from "@nestjs/testing";
import { MessagesService } from "./messages.service";
import { PrismaService } from "../prisma/prisma.service";
import { EventsGateway } from "../events/events.gateway";
import { NotFoundException } from "@nestjs/common";

describe("MessagesService", () => {
  /* eslint-disable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access */
  let _service: MessagesService;
  let _prismaService: PrismaService;
  let _eventsGateway: EventsGateway;

  const mockPrisma = {
    conversation: {
      findFirst: jest.fn(),
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
    },
    message: {
      create: jest.fn(),
      updateMany: jest.fn(),
      delete: jest.fn(),
      findUnique: jest.fn(),
    },
  };

  const mockEventsGateway = {
    server: {
      emit: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MessagesService,
        {
          provide: PrismaService,
          useValue: mockPrisma,
        },
        {
          provide: EventsGateway,
          useValue: mockEventsGateway,
        },
      ],
    }).compile();

    _service = module.get<MessagesService>(MessagesService);
    _prismaService = module.get<PrismaService>(PrismaService);
    _eventsGateway = module.get<EventsGateway>(EventsGateway);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("getOrCreateConversation", () => {
    it("should return existing conversation", async () => {
      const userId = "user-1";
      const recipientId = "user-2";

      const mockConversation = {
        id: "conv-1",
        participants: [
          { id: userId, name: "User 1" },
          { id: recipientId, name: "User 2" },
        ],
        messages: [],
      };

      mockPrisma.conversation.findFirst.mockResolvedValue(mockConversation);

      const result = await service.getOrCreateConversation(userId, recipientId);

      expect(mockPrisma.conversation.findFirst).toHaveBeenCalled();
      expect(mockPrisma.conversation.create).not.toHaveBeenCalled();
      expect(result).toEqual(mockConversation);
    });

    it("should create new conversation if not exists", async () => {
      const userId = "user-1";
      const recipientId = "user-2";

      const mockConversation = {
        id: "conv-1",
        participants: [
          { id: userId, name: "User 1" },
          { id: recipientId, name: "User 2" },
        ],
        messages: [],
      };

      mockPrisma.conversation.findFirst.mockResolvedValue(null);
      mockPrisma.conversation.create.mockResolvedValue(mockConversation);

      const result = await service.getOrCreateConversation(userId, recipientId);

      expect(mockPrisma.conversation.create).toHaveBeenCalled();
      expect(result).toEqual(mockConversation);
    });
  });

  describe("sendMessage", () => {
    it("should send message and emit WebSocket event", async () => {
      const userId = "user-1";
      const conversationId = "conv-1";
      const text = "Hello!";

      const mockConversation = {
        id: conversationId,
        participants: [
          { id: userId, name: "User 1" },
          { id: "user-2", name: "User 2" },
        ],
      };

      const mockMessage = {
        id: "msg-1",
        text,
        senderId: userId,
        conversationId,
        sender: { id: userId, name: "User 1", username: "user1", avatar: null },
      };

      mockPrisma.conversation.findFirst.mockResolvedValue(mockConversation);
      mockPrisma.message.create.mockResolvedValue(mockMessage);
      mockPrisma.conversation.update.mockResolvedValue({});

      const result = await service.sendMessage(userId, conversationId, text);

      expect(mockPrisma.message.create).toHaveBeenCalled();
      expect(mockPrisma.conversation.update).toHaveBeenCalled();
      expect(mockEventsGateway.server.emit).toHaveBeenCalledWith(
        "message:new",
        expect.any(Object),
      );
      expect(result).toEqual(mockMessage);
    });

    it("should throw NotFoundException if conversation not found", async () => {
      mockPrisma.conversation.findFirst.mockResolvedValue(null);

      await expect(
        service.sendMessage("user-1", "conv-1", "test"),
      ).rejects.toThrow(NotFoundException);
    });
  });
});

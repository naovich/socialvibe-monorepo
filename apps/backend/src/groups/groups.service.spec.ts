import { Test, TestingModule } from "@nestjs/testing";
import { GroupsService } from "./groups.service";
import { PrismaService } from "../prisma/prisma.service";
import { ForbiddenException } from "@nestjs/common";

describe("GroupsService", () => {
  /* eslint-disable @typescript-eslint/no-unsafe-assignment */
  let _service: GroupsService;

  const mockPrisma = {
    group: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      findFirst: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GroupsService,
        {
          provide: PrismaService,
          useValue: mockPrisma,
        },
      ],
    }).compile();

    _service = module.get<GroupsService>(GroupsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("create", () => {
    it("should create a group successfully", async () => {
      const userId = "user-1";
      const groupData = {
        name: "Test Group",
        description: "Test Description",
      };

      const mockGroup = {
        id: "group-1",
        ...groupData,
        creatorId: userId,
        creator: {
          id: userId,
          name: "Test User",
          username: "test",
          avatar: null,
        },
        _count: { members: 1, posts: 0 },
      };

      mockPrisma.group.create.mockResolvedValue(mockGroup);

      const result = await _service.create(userId, groupData);

      expect(mockPrisma.group.create).toHaveBeenCalledWith({
        data: {
          ...groupData,
          creatorId: userId,
          members: { connect: { id: userId } },
        },

        include: expect.any(Object),
      });
      expect(result).toEqual(mockGroup);
    });
  });

  describe("join", () => {
    it("should allow user to join public group", async () => {
      const userId = "user-1";
      const groupId = "group-1";

      mockPrisma.group.findUnique.mockResolvedValue({
        id: groupId,
        isPrivate: false,
        members: [],
      });

      mockPrisma.group.update.mockResolvedValue({ id: groupId });

      const result = await _service.join(userId, groupId);

      expect(mockPrisma.group.update).toHaveBeenCalled();
      expect(result).toEqual({ message: "Joined group successfully" });
    });

    it("should throw ForbiddenException for private group", async () => {
      const userId = "user-1";
      const groupId = "group-1";

      mockPrisma.group.findUnique.mockResolvedValue({
        id: groupId,
        isPrivate: true,
        members: [],
      });

      await expect(_service.join(userId, groupId)).rejects.toThrow(
        ForbiddenException,
      );
    });
  });

  describe("delete", () => {
    it("should allow creator to delete group", async () => {
      const userId = "user-1";
      const groupId = "group-1";

      mockPrisma.group.findUnique.mockResolvedValue({
        id: groupId,
        creatorId: userId,
      });

      mockPrisma.group.delete.mockResolvedValue({ id: groupId });

      const result = await _service.delete(userId, groupId);

      expect(mockPrisma.group.delete).toHaveBeenCalledWith({
        where: { id: groupId },
      });
      expect(result).toEqual({ message: "Group deleted successfully" });
    });

    it("should throw ForbiddenException if not creator", async () => {
      const userId = "user-1";
      const groupId = "group-1";

      mockPrisma.group.findUnique.mockResolvedValue({
        id: groupId,
        creatorId: "other-user",
      });

      await expect(_service.delete(userId, groupId)).rejects.toThrow(
        ForbiddenException,
      );
    });
  });
});

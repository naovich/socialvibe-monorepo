import { Test, TestingModule } from "@nestjs/testing";
import { PostsService } from "./posts.service";
import { PrismaService } from "../prisma/prisma.service";
import { NotFoundException, ForbiddenException } from "@nestjs/common";
import {
  getTestModuleMetadata,
  createMockPrismaService,
  MockEventsGateway,
} from "../../test/helpers/test.module";
import { EventsGateway } from "../events/events.gateway";

describe("PostsService", () => {
  let service: PostsService;
  let prismaService: PrismaService;
  let _eventsGateway: EventsGateway;

  const mockPost = {
    id: "1",
    caption: "Test post",
    image: "https://example.com/image.jpg",
    authorId: "user1",
    createdAt: new Date(),
    updatedAt: new Date(),
    author: {
      id: "user1",
      name: "Test User",
      username: "testuser",
      avatar: null,
    },
    comments: [],
    likes: [],
    _count: { likes: 0, comments: 0 },
  };

  beforeEach(async () => {
    const mockPrisma = createMockPrismaService();

    const module: TestingModule = await Test.createTestingModule(
      getTestModuleMetadata({
        providers: [
          PostsService,
          {
            provide: PrismaService,
            useValue: mockPrisma,
          },
          {
            provide: EventsGateway,
            useClass: MockEventsGateway,
          },
        ],
      }),
    ).compile();

    service = module.get<PostsService>(PostsService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  describe("create", () => {
    it("should create a new post", async () => {
      const createPostDto = {
        caption: "Test post",
        image: "https://example.com/image.jpg",
      };

      jest.spyOn(prismaService.post, "create").mockResolvedValue(mockPost);
      jest.spyOn(prismaService.friendship, "findMany").mockResolvedValue([]);

      const result = await service.create("user1", createPostDto);

      expect(result).toEqual(mockPost);
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(prismaService.post.create as jest.Mock).toHaveBeenCalledWith({
        data: {
          ...createPostDto,
          authorId: "user1",
        },
        include: {
          author: {
            select: {
              id: true,
              name: true,
              username: true,
              avatar: true,
            },
          },
          _count: {
            select: { likes: true, comments: true },
          },
        },
      });
    });
  });

  describe("findAll", () => {
    it("should return paginated posts with isLiked", async () => {
      jest.spyOn(prismaService.post, "findMany").mockResolvedValue([mockPost]);
      jest.spyOn(prismaService.post, "count").mockResolvedValue(1);

      const result = await service.findAll(1, 20, "user1");

      expect(result).toHaveProperty("posts");
      expect(result).toHaveProperty("pagination");
      expect(result.posts).toHaveLength(1);
      expect(result.posts[0]).toHaveProperty("isLiked");
    });
  });

  describe("toggleLike", () => {
    it("should create a like if not exists", async () => {
      jest.spyOn(prismaService.post, "findUnique").mockResolvedValue(mockPost);
      jest.spyOn(prismaService.like, "findUnique").mockResolvedValue(null);
      jest.spyOn(prismaService.like, "create").mockResolvedValue({
        id: "1",
        postId: "1",
        userId: "user1",
        createdAt: new Date(),
      });

      const result = await service.toggleLike("user1", "1");

      expect(result).toEqual({ liked: true });
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(prismaService.like.create as jest.Mock).toHaveBeenCalled();
    });

    it("should delete a like if exists", async () => {
      const existingLike = {
        id: "1",
        postId: "1",
        userId: "user1",
        createdAt: new Date(),
      };

      jest.spyOn(prismaService.post, "findUnique").mockResolvedValue(mockPost);
      jest
        .spyOn(prismaService.like, "findUnique")
        .mockResolvedValue(existingLike);
      jest.spyOn(prismaService.like, "delete").mockResolvedValue(existingLike);

      const result = await service.toggleLike("user1", "1");

      expect(result).toEqual({ liked: false });
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(prismaService.like.delete as jest.Mock).toHaveBeenCalled();
    });

    it("should throw NotFoundException if post not found", async () => {
      jest.spyOn(prismaService.post, "findUnique").mockResolvedValue(null);

      await expect(service.toggleLike("user1", "999")).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe("delete", () => {
    it("should delete post if user is author", async () => {
      jest.spyOn(prismaService.post, "findUnique").mockResolvedValue(mockPost);
      jest.spyOn(prismaService.post, "delete").mockResolvedValue(mockPost);

      const result = await service.delete("user1", "1");

      expect(result).toEqual({ message: "Post deleted successfully" });
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(prismaService.post.delete as jest.Mock).toHaveBeenCalled();
    });

    it("should throw ForbiddenException if user is not author", async () => {
      jest.spyOn(prismaService.post, "findUnique").mockResolvedValue(mockPost);

      await expect(service.delete("user2", "1")).rejects.toThrow(
        ForbiddenException,
      );
    });

    it("should throw NotFoundException if post not found", async () => {
      jest.spyOn(prismaService.post, "findUnique").mockResolvedValue(null);

      await expect(service.delete("user1", "999")).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});

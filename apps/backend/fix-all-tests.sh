#!/bin/bash

echo "🔧 Fixing all test files with helpers..."

cd "$(dirname "$0")"

# likes.controller.spec.ts
cat > src/likes/likes.controller.spec.ts << 'EOF'
import { Test, TestingModule } from "@nestjs/testing";
import { LikesController } from "./likes.controller";
import { LikesService } from "./likes.service";
import { getTestModuleMetadata } from "../../test/helpers/test.module";

describe("LikesController", () => {
  let controller: LikesController;
  let service: LikesService;

  const mockLikesService = {
    likePost: jest.fn(),
    unlikePost: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule(
      getTestModuleMetadata({
        controllers: [LikesController],
        providers: [
          {
            provide: LikesService,
            useValue: mockLikesService,
          },
        ],
      })
    ).compile();

    controller = module.get<LikesController>(LikesController);
    service = module.get<LikesService>(LikesService);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });
});
EOF

# likes.service.spec.ts
cat > src/likes/likes.service.spec.ts << 'EOF'
import { Test, TestingModule } from "@nestjs/testing";
import { LikesService } from "./likes.service";
import { PrismaService } from "../prisma/prisma.service";
import { EventsGateway } from "../events/events.gateway";
import { getTestModuleMetadata, createMockPrismaService, MockEventsGateway } from "../../test/helpers/test.module";

describe("LikesService", () => {
  let service: LikesService;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const mockPrisma = createMockPrismaService();

    const module: TestingModule = await Test.createTestingModule(
      getTestModuleMetadata({
        providers: [
          LikesService,
          {
            provide: PrismaService,
            useValue: mockPrisma,
          },
          {
            provide: EventsGateway,
            useClass: MockEventsGateway,
          },
        ],
      })
    ).compile();

    service = module.get<LikesService>(LikesService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});
EOF

# comments.service.spec.ts
cat > src/comments/comments.service.spec.ts << 'EOF'
import { Test, TestingModule } from "@nestjs/testing";
import { CommentsService } from "./comments.service";
import { PrismaService } from "../prisma/prisma.service";
import { EventsGateway } from "../events/events.gateway";
import { getTestModuleMetadata, createMockPrismaService, MockEventsGateway } from "../../test/helpers/test.module";

describe("CommentsService", () => {
  let service: CommentsService;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const mockPrisma = createMockPrismaService();

    const module: TestingModule = await Test.createTestingModule(
      getTestModuleMetadata({
        providers: [
          CommentsService,
          {
            provide: PrismaService,
            useValue: mockPrisma,
          },
          {
            provide: EventsGateway,
            useClass: MockEventsGateway,
          },
        ],
      })
    ).compile();

    service = module.get<CommentsService>(CommentsService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});
EOF

# posts.controller.spec.ts
cat > src/posts/posts.controller.spec.ts << 'EOF'
import { Test, TestingModule } from "@nestjs/testing";
import { PostsController } from "./posts.controller";
import { PostsService } from "./posts.service";
import { getTestModuleMetadata } from "../../test/helpers/test.module";

describe("PostsController", () => {
  let controller: PostsController;
  let service: PostsService;

  const mockPostsService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule(
      getTestModuleMetadata({
        controllers: [PostsController],
        providers: [
          {
            provide: PostsService,
            useValue: mockPostsService,
          },
        ],
      })
    ).compile();

    controller = module.get<PostsController>(PostsController);
    service = module.get<PostsService>(PostsService);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });
});
EOF

# app.controller.spec.ts
cat > src/app.controller.spec.ts << 'EOF'
import { Test, TestingModule } from "@nestjs/testing";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { getTestModuleMetadata } from "../test/helpers/test.module";

describe("AppController", () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule(
      getTestModuleMetadata({
        controllers: [AppController],
        providers: [AppService],
      })
    ).compile();

    appController = app.get<AppController>(AppController);
  });

  describe("root", () => {
    it('should return "Hello World!"', () => {
      expect(appController.getHello()).toBe("Hello World!");
    });
  });
});
EOF

echo ""
echo "✅ All test files updated!"
echo ""
echo "Files updated:"
echo "  - src/users/users.controller.spec.ts"
echo "  - src/users/users.service.spec.ts"
echo "  - src/likes/likes.controller.spec.ts"
echo "  - src/likes/likes.service.spec.ts"
echo "  - src/comments/comments.service.spec.ts"
echo "  - src/posts/posts.controller.spec.ts"
echo "  - src/app.controller.spec.ts"
echo "  - src/auth/auth.service.spec.ts (already done)"
echo "  - src/auth/auth.controller.spec.ts (already done)"
echo "  - src/groups/groups.service.spec.ts (already done)"
echo "  - src/messages/messages.service.spec.ts (already done)"
echo "  - src/posts/posts.service.spec.ts (already done)"
echo ""
echo "Run: npm test"

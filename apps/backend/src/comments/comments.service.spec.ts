import { Test, TestingModule } from "@nestjs/testing";
import { CommentsService } from "./comments.service";
import { PrismaService } from "../prisma/prisma.service";
import { EventsGateway } from "../events/events.gateway";
import {
  getTestModuleMetadata,
  createMockPrismaService,
  MockEventsGateway,
} from "../../test/helpers/test.module";

describe("CommentsService", () => {
  let service: CommentsService;

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
      }),
    ).compile();

    service = module.get<CommentsService>(CommentsService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});

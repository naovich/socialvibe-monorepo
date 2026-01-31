import { Test, TestingModule } from "@nestjs/testing";
import { LikesService } from "./likes.service";
import { PrismaService } from "../prisma/prisma.service";
import { EventsGateway } from "../events/events.gateway";
import {
  getTestModuleMetadata,
  createMockPrismaService,
  MockEventsGateway,
} from "../../test/helpers/test.module";

describe("LikesService", () => {
  let _service: LikesService;

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
      }),
    ).compile();

    _service = module.get<LikesService>(LikesService);
  });

  it("should be defined", () => {
    expect(_service).toBeDefined();
  });
});

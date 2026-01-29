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

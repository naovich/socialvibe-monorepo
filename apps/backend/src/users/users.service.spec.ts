import { Test, TestingModule } from "@nestjs/testing";
import { UsersService } from "./users.service";
import { PrismaService } from "../prisma/prisma.service";
import {
  getTestModuleMetadata,
  createMockPrismaService,
} from "../../test/helpers/test.module";
describe("UsersService", () => {
  let _service: UsersService;
  let _prismaService: PrismaService;

  beforeEach(async () => {
    const mockPrisma = createMockPrismaService();

    const module: TestingModule = await Test.createTestingModule(
      getTestModuleMetadata({
        providers: [
          UsersService,
          {
            provide: PrismaService,
            useValue: mockPrisma,
          },
        ],
      }),
    ).compile();

    _service = module.get<UsersService>(UsersService);
    _prismaService = module.get<PrismaService>(PrismaService);
  });

  it("should be defined", () => {
    expect(_service).toBeDefined();
  });
});

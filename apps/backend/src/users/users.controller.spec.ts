import { Test, TestingModule } from "@nestjs/testing";
import { UsersController } from "./users.controller";
import { UsersService } from "./users.service";
import { getTestModuleMetadata } from "../../test/helpers/test.module";

describe("UsersController", () => {
  let controller: UsersController;
  let service: UsersService;

  const mockUsersService = {
    findById: jest.fn(),
    search: jest.fn(),
    updateProfile: jest.fn(),
    uploadAvatar: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule(
      getTestModuleMetadata({
        controllers: [UsersController],
        providers: [
          {
            provide: UsersService,
            useValue: mockUsersService,
          },
        ],
      })
    ).compile();

    controller = module.get<UsersController>(UsersController);
    service = module.get<UsersService>(UsersService);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });
});

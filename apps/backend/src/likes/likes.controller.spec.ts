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

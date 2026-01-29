import { ModuleMetadata } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';

/**
 * Mock ThrottlerGuard for testing
 * Bypasses rate limiting in tests
 */
export class MockThrottlerGuard {
  canActivate() {
    return true;
  }
}

/**
 * Get test module metadata with common mocks
 * Use this instead of bare Test.createTestingModule()
 */
export function getTestModuleMetadata(metadata: ModuleMetadata): ModuleMetadata {
  return {
    ...metadata,
    providers: [
      ...(metadata.providers || []),
      {
        provide: APP_GUARD,
        useClass: MockThrottlerGuard,
      },
    ],
  };
}

/**
 * Mock EventsGateway for testing
 */
export class MockEventsGateway {
  server = {
    emit: jest.fn(),
    to: jest.fn().mockReturnThis(),
  };

  notifyNewPost = jest.fn();
  notifyLike = jest.fn();
  notifyComment = jest.fn();
}

/**
 * Mock PrismaService with common methods
 */
export const createMockPrismaService = () => ({
  user: {
    findFirst: jest.fn(),
    findUnique: jest.fn(),
    findMany: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    count: jest.fn(),
  },
  post: {
    findFirst: jest.fn(),
    findUnique: jest.fn(),
    findMany: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    count: jest.fn(),
  },
  comment: {
    findFirst: jest.fn(),
    findUnique: jest.fn(),
    findMany: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
  like: {
    findFirst: jest.fn(),
    findUnique: jest.fn(),
    findMany: jest.fn(),
    create: jest.fn(),
    delete: jest.fn(),
  },
  friendship: {
    findFirst: jest.fn(),
    findUnique: jest.fn(),
    findMany: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
  refreshToken: {
    findUnique: jest.fn(),
    create: jest.fn(),
    delete: jest.fn(),
  },
  story: {
    findMany: jest.fn(),
    create: jest.fn(),
    delete: jest.fn(),
    deleteMany: jest.fn(),
  },
  conversation: {
    findFirst: jest.fn(),
    findUnique: jest.fn(),
    findMany: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
  },
  message: {
    findUnique: jest.fn(),
    create: jest.fn(),
    updateMany: jest.fn(),
    delete: jest.fn(),
  },
  group: {
    findFirst: jest.fn(),
    findUnique: jest.fn(),
    findMany: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
});

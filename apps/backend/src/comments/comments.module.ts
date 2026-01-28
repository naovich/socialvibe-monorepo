import { Module } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CommentsController, CommentsSingleController } from './comments.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [CommentsController, CommentsSingleController],
  providers: [CommentsService],
  exports: [CommentsService],
})
export class CommentsModule {}

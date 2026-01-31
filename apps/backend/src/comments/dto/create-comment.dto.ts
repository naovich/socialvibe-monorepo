import {
  IsString,
  MinLength,
  MaxLength,
  IsOptional,
  IsUUID,
} from "class-validator";

export class CreateCommentDto {
  @IsString()
  @MinLength(1)
  @MaxLength(1000)
  text: string;

  @IsOptional()
  @IsUUID()
  parentId?: string;
}

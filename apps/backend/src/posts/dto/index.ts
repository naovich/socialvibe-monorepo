import { IsNotEmpty, IsString, IsOptional } from "class-validator";

export class CreatePostDto {
  @IsString()
  @IsNotEmpty()
  caption!: string;

  @IsString()
  @IsOptional()
  image?: string;
}

export class UpdatePostDto {
  @IsString()
  @IsOptional()
  caption?: string;

  @IsString()
  @IsOptional()
  image?: string;
}

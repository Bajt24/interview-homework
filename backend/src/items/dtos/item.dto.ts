import { IsInt, IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString, IsUrl, Min } from "class-validator"
import { PartialType } from '@nestjs/mapped-types';
import { Transform } from "class-transformer";

export class CreateItemDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsUrl()
  imageUrl?: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  quantity?: number;

  @IsNumber()
  @IsPositive()
  @Transform(({ value }) => +(+value).toFixed(2))
  unitPrice: number;
}

export class UpdateItemDto extends PartialType(CreateItemDto) {}

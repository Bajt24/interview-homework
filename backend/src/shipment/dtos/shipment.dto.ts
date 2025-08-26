import { Type } from "class-transformer";
import { IsArray, IsNotEmpty, IsNumber, IsPositive, ValidateNested } from "class-validator";

export class ShipmentItemDto {
  @IsNumber()
  @IsPositive()
  id: number;

  @IsNumber()
  @IsPositive()
  quantity: number;
}

export class CreateShipmentDto {
  @IsArray()
  @IsNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => ShipmentItemDto)
  items: ShipmentItemDto[];
}

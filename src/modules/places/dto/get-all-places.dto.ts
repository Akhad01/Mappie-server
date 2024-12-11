import { IsInt, IsNumber, IsNumberString } from 'class-validator';
import { Transform, Type } from 'class-transformer';

export class GetAllPlacesDto {
  @IsNumberString()
  latitude: string;

  @IsNumberString()
  longitude: string;

  @Transform(({ value }) => parseFloat(value))
  @IsInt()
  radius: string;
}
import { IsInt, IsNumberString, Matches } from 'class-validator';
import { Transform } from 'class-transformer';

export class GetPlacesByCategoriesDto {
  @IsNumberString()
  latitude: string;

  @IsNumberString()
  longitude: string;

  @Transform(({ value }) => parseFloat(value))
  @IsInt()
  radius: string;

  @Matches(/^[a-zA-Z]+(,[a-zA-Z]+)*$/)
  categories: string;
}
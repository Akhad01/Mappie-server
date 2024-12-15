import { IsNumber } from 'class-validator';

export class ToggleFavoritePlaceDto {
  @IsNumber()
  placeId: number;
}
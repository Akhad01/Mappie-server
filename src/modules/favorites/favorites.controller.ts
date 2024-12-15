import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard';
import { FavoritesService } from './favorites.service';
import { ToggleFavoritePlaceDto } from './dto/toggle-favorite-place.dto';
import { DataTransformService } from '../places/data-transform.service';
import { filtersByCategory } from '../../constants/filters-by-category';

@Controller('favorites')
export class FavoritesController {
  public constructor(
    private readonly service: FavoritesService,
    private readonly transformService: DataTransformService
  ) {}

  @UseGuards(AuthGuard)
  @Get('/favorite-places')
  public async getFavoritePlaces(@Req() req) {
    const categories = Object.keys(filtersByCategory);
    const places = await this.service.getFavoritesPlaces(req.user.id);
    return this.transformService.transformWithDesc(places, categories);
  }

  @UseGuards(AuthGuard)
  @Post('/toggle-favorite-place')
  public async toggleFavoritePlace(@Req() req, @Body() { placeId }: ToggleFavoritePlaceDto) {
    return await this.service.toggleFavoritePlace(req.user.id, placeId);
  }
}

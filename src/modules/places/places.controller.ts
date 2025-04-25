import { BadRequestException, Controller, Get, Param, Query, Req } from '@nestjs/common';
import { GetAllPlacesDto } from './dto/get-all-places.dto';
import { PlacesService } from './places.service';
import { DataTransformService } from './data-transform.service';
import { GetPlacesByCategoriesDto } from './dto/get-places-by-categories.dto';
import { filtersByCategory } from '../../constants/filters-by-category';

@Controller()
export class PlacesController {
  constructor(
    private readonly placesService: PlacesService,
    private readonly dataTransformService: DataTransformService
  ) {
  }

  @Get('/place/:id')
  public async getPlaceById(@Req() req, @Param('id') id) {
    const parsedId = +id;
    if (!parsedId) throw new BadRequestException({ error: 'wrong id' });
    const places = await this.placesService.getPlaceById(parsedId);

    const categories = Object.keys(filtersByCategory);
    return {
      place: this.dataTransformService.transformWithDesc(places, categories)[0],
      saved: req.user && await this.placesService.checkSaved(req.user.id, parsedId)
    };
  }

  @Get('/all-places')
  public async getPlaces(@Query() { latitude, longitude, radius }: GetAllPlacesDto) {
    const categories = Object.keys(filtersByCategory);
    const places = await this.placesService.getPlacesByCategories(+latitude, +longitude, +radius, categories);
    return this.dataTransformService.transformWithoutDesc(places, categories);
  }

  @Get('/places')
  public async getPlacesByCategories(@Query() { latitude, longitude, radius, categories }: GetPlacesByCategoriesDto) {
    const formattedCategories = categories.split(',');
    const invalidCategories = formattedCategories.filter(c => !(c in filtersByCategory) && c !== 'unknown');
    if (invalidCategories.length)
      throw new BadRequestException({
        statusCode: 400,
        message: `Invalid categories: ${invalidCategories.join(', ')}`,
        error: 'Bad Request'
      });

    const places = await this.placesService.getPlacesByCategories(+latitude, +longitude, +radius, formattedCategories);
    return this.dataTransformService.transformWithoutDesc(places, formattedCategories);
  }
}

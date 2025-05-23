import { Injectable } from '@nestjs/common';
import { filtersByCategory } from '../../constants/filters-by-category';
import { OverpassNodeDto } from './dto/overpass-node.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Favorite, FavoriteDocument } from '../favorites/schemas/favorites.schema';
import { Model } from 'mongoose';

@Injectable()
export class PlacesService {
  constructor(
    @InjectModel(Favorite.name) private readonly favoriteModel: Model<FavoriteDocument>
  ) {}
  
  public async getPlaceById(id: number) {
    const queryString = `[out:json];
    (
      node(${id});
    );
     out body;`;

    const url = `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(queryString)}`;
    const response = await fetch(url);
    const res = await response.json();
    return res.elements as OverpassNodeDto[];
  }

  public async getPlacesByCategories(latitude: number, longitude: number, radius: number, categories: string[]) {
    const queryString = `[out:json];
    (${categories.map(category => {
      if (!filtersByCategory[category]) return '';
      const { and, or, exclude } = filtersByCategory[category];
      const filters = [
        ...and.map(condition => condition.values.length ? condition.values.map(v => `["${condition.field}"="${v}"]`).join('') : `["${condition.field}"]`),
        ...or.map(condition => `["${condition.field}"~"${condition.values.join('|')}"]`),
        ...exclude.map(condition => condition.values.map(v => `["${condition.field}"!="${v}"]`).join(''))
      ].join('');
      return `node(around:${radius},${latitude},${longitude})${filters};`;
    }).join('')});
    out center;`;
    const url = `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(queryString)}`;
    const response = await fetch(url);
    const res = await response.json();
    return res.elements as OverpassNodeDto[];
  }

  public async checkSaved(personId: string, placeId: number) {
    const instance = await this.favoriteModel.findOne({
      personId, placeId 
    });

    return instance !== null;
  }
}

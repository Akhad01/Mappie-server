import { Injectable } from '@nestjs/common';
import { OverpassNodeDto } from '../places/dto/overpass-node.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Favorite, FavoriteDocument } from './schemas/favorites.schema';
import { Model } from 'mongoose';

@Injectable()
export class FavoritesService {
  constructor(
    @InjectModel(Favorite.name) private readonly favoriteModel: Model<FavoriteDocument>
  ) {}

  public async getFavoritesPlaces(personId: string): Promise<OverpassNodeDto[]> {
    console.log('personId', personId)
    
    const favorites = await this.favoriteModel.find({ personId }).lean();


    if (favorites.length === 0) return [];
    const queryString = `[out:json];
    (
      node(id: ${favorites.map(b => b.placeId).join(', ')});
    );
    out body;`;
    const url = `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(queryString)}`;
    const response = await fetch(url);
    const res = await response.json();
    return res.elements as OverpassNodeDto[];
  }

  public async toggleFavoritePlace(personId: string, placeId: number) {
    const existingFavorites = await this.favoriteModel.findOne({ personId, placeId });
    if (existingFavorites) {
      await this.favoriteModel.deleteOne({ personId, placeId });
      return { added: false, deleted: true };
    } else {
      await this.favoriteModel.create({ personId, placeId });
      return { added: true, deleted: false };
    }
  }
}

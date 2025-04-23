import { Injectable } from '@nestjs/common';
import { OverpassNodeDto } from './dto/overpass-node.dto';
import { filtersByCategory, IBodyCategory } from '../../constants/filters-by-category';

@Injectable()
export class DataTransformService {
  private checkAnd(keys: string[], values: string[], category: IBodyCategory) {
    return category.and.some(condition =>
      !keys.includes(condition.field) || condition.values.length && condition.values.some(v => !values.includes(v))
    );
  }

  private checkExcluded(values: string[], category: IBodyCategory) {
    return category.exclude.some(condition =>
      values.some(v => condition.values.includes(v)));
  }

  private checkOr(keys: string[], values: string[], category: IBodyCategory) {
    return category.or.some(condition =>
      !keys.includes(condition.field) || !condition.values.some(v => values.includes(v))
    );
  }

  private determinePlace(place: OverpassNodeDto, categories: string[]) {
    for (const category of categories) {
      const fieldCategory = filtersByCategory[category];
      if (!fieldCategory) continue;
      if (this.placeBelongCategory(place, fieldCategory))
        return category;
    }
    return 'unknown';
  }

  private placeBelongCategory(place: OverpassNodeDto, category: IBodyCategory): boolean {
    const keys = Object.keys(place.tags);
    const values = Object.values(place.tags);

    const wrong = this.checkExcluded(values, category) || this.checkAnd(keys, values, category) || this.checkOr(keys, values, category);

    return !wrong;
  }

  public transformWithDesc(places: OverpassNodeDto[], categories: string[]) {
    return places
      .filter(p => !!p.tags.name)
      .map(p => ({
        type: this.determinePlace(p, categories),
        id: p.id,
        position: [p.lat, p.lon],
        tags: p.tags
      }));
  }

  public transformWithoutDesc(places: OverpassNodeDto[], categories: string[]) {
    return places
      .filter(p => !!p.tags.name)
      .map(p => ({
        type: this.determinePlace(p, categories),
        id: p.id,
        position: [p.lat, p.lon],
        name: p.tags['name:ru'] ?? p.tags.name
      }));
  }
}

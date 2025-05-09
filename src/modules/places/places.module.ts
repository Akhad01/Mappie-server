import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { PlacesService } from './places.service';
import { DataTransformService } from './data-transform.service';
import { PlacesController } from './places.controller';
import { CheckAuthMiddleware } from '../../middlewares/check-auth.middleware';
import { MongooseModule } from '@nestjs/mongoose';
import { Favorite, FavoriteSchema } from '../favorites/schemas/favorites.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: Favorite.name, schema: FavoriteSchema }])],
  controllers: [PlacesController],
  providers: [PlacesService, DataTransformService],
  exports:[DataTransformService]
})
export class PlacesModule {
  private configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(CheckAuthMiddleware)
      .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}

import { MiddlewareConsumer, Module, RequestMapping, RequestMethod } from '@nestjs/common';
import { FavoritesService } from './favorites.service';
import { FavoritesController } from './favorites.controller';
import { DataTransformService } from '../places/data-transform.service';
import { CheckAuthMiddleware } from 'src/middlewares/check-auth.middleware';
import { Mongoose } from 'mongoose';
import { MongooseModule } from '@nestjs/mongoose';
import { Favorite, FavoriteSchema } from './schemas/favorites.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: Favorite.name, schema: FavoriteSchema }])],
  controllers: [FavoritesController],
  providers: [FavoritesService, DataTransformService],
})

export class FavoritesModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.
      apply(CheckAuthMiddleware)
      .forRoutes({ path: "*", method: RequestMethod.ALL })
  }
}

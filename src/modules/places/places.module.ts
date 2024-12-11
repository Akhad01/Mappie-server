import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { PlacesService } from './places.service';
import { DataTransformService } from './data-transform.service';
import { PlacesController } from './places.controller';
import { CheckAuthMiddleware } from '../../middlewares/check-auth.middleware';

@Module({
  controllers: [PlacesController],
  providers: [PlacesService, DataTransformService],
  exports:[DataTransformService]
})
export class PlacesModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(CheckAuthMiddleware)
      .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}

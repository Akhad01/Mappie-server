import { Module } from '@nestjs/common';
import { PlacesModule } from '../places/places.module';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from '../auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { FavoritesModule } from '../favorites/favorites.module';

@Module({
  imports: [
    PlacesModule, 
    AuthModule, 
    FavoritesModule,
    ConfigModule.forRoot({ isGlobal: true }), 
    MongooseModule.forRoot('mongodb://localhost:27017/mappie')],
  controllers: [],
  providers: [],
})
export class AppModule {}

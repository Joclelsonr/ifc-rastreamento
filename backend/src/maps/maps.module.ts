import { Module } from '@nestjs/common';
import { PlacesController } from './places/places.controller';
import { PlacesService } from './places/places.service';
import { Client as GoogleMapsService } from '@googlemaps/google-maps-services-js';

@Module({
  controllers: [PlacesController],
  providers: [
    PlacesService,
    {
      provide: GoogleMapsService,
      useValue: new GoogleMapsService(),
    },
  ],
})
export class MapsModule {}

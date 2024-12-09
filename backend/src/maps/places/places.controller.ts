import { Controller, Get, Query } from '@nestjs/common';
import { PlacesService } from './places.service';

@Controller('places')
export class PlacesController {
  constructor(private placesService: PlacesService) {}

  @Get()
  getPlaces(@Query('text') text: string) {
    return this.placesService.findPlaces(text);
  }
}

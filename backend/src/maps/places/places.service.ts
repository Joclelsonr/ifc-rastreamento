import { Injectable } from '@nestjs/common';
import {
  Client as GoogleMapsService,
  PlaceInputType,
} from '@googlemaps/google-maps-services-js';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class PlacesService {
  constructor(
    private googleMapsService: GoogleMapsService,
    private configService: ConfigService,
  ) {}

  async findPlaces(text: string) {
    const { data } = await this.googleMapsService.findPlaceFromText({
      params: {
        input: text,
        inputtype: PlaceInputType.textQuery,
        fields: ['place_id', 'name', 'formatted_address', 'geometry'],
        key: this.configService.get<string>('GOOGLE_MAPS_API_KEY'),
      },
    });
    return data;
  }
}

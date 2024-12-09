import { Injectable } from '@nestjs/common';
import { CreateRouteDto } from './dto/create-route.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { DirectionsService } from 'src/maps/directions/directions.service';

@Injectable()
export class RoutesService {
  constructor(
    private prismaService: PrismaService,
    private directionsService: DirectionsService,
  ) {}

  async create(createRouteDto: CreateRouteDto) {
    console.log(createRouteDto);
    const { routes, geocoded_waypoints, available_travel_modes, request } =
      await this.directionsService.getDirections(
        createRouteDto.origin_id,
        createRouteDto.destination_id,
      );

    const legs = routes[0].legs[0];
    return this.prismaService.route.create({
      data: {
        name: createRouteDto.name,
        origin: {
          name: legs.start_address,
          location: {
            lat: legs.start_location.lat,
            lng: legs.start_location.lng,
          },
        },
        destination: {
          name: legs.end_address,
          location: {
            lat: legs.end_location.lat,
            lng: legs.end_location.lng,
          },
        },
        duration: legs.duration.value,
        distance: legs.distance.value,
        direction: JSON.parse(
          JSON.stringify({
            available_travel_modes,
            geocoded_waypoints,
            routes,
            request,
          }),
        ),
      },
    });
  }

  async findAll() {
    return await this.prismaService.route.findMany();
  }

  async findOne(id: string) {
    return await this.prismaService.route.findUniqueOrThrow({
      where: { id },
    });
  }

  // update(id: number, updateRouteDto: UpdateRouteDto) {
  //   return `This action updates a #${id} route`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} route`;
  // }
}

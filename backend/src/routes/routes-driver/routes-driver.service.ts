import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { RoutesDriverGateway } from './routes-driver.gateway';
//import { DirectionsResponseData } from '@googlemaps/google-maps-services-js';

@Injectable()
export class RoutesDriverService {
  constructor(
    private prismaService: PrismaService,
    private routesGateway: RoutesDriverGateway,
  ) {}

  async processRoute(dto: { route_id: string; lat: number; lng: number }) {
    const routeDriver = await this.prismaService.routeDriver.upsert({
      include: { route: true },
      where: { route_id: dto.route_id },
      create: {
        route_id: dto.route_id,
        points: {
          set: {
            location: {
              lat: dto.lat,
              lng: dto.lng,
            },
          },
        },
      },
      update: {
        points: {
          push: {
            location: {
              lat: dto.lat,
              lng: dto.lng,
            },
          },
        },
      },
    });

    // const directions: DirectionsResponseData = routeDriver.route
    //   .directions as any;

    // const lastPoint =
    //   directions.routes[0].legs[0].steps[
    //     directions.routes[0].legs[0].steps.length - 1
    //   ];

    // if (
    //   lastPoint.end_location.lat === dto.lat &&
    //   lastPoint.end_location.lng === dto.lng
    // ) {
    //   await this.kafkaProducer.send({
    //     topic: 'route',
    //     messages: [
    //       {
    //         value: JSON.stringify({
    //           event: 'RouteFinished',
    //           ...routeDriver,
    //         }),
    //       },
    //     ],
    //   });
    //   return routeDriver;
    // }

    this.routesGateway.emitNewPoints({
      route_id: dto.route_id,
      lat: dto.lat,
      lng: dto.lng,
    });

    return routeDriver;
  }
}

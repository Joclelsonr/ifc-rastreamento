import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class RoutesDriverService {
  constructor(private prismaService: PrismaService) {}

  async processRoute(dto: { router_id: string; lat: number; lng: number }) {
    return await this.prismaService.routeDriver.upsert({
      include: { route: true },
      where: { route_id: dto.router_id },
      create: {
        route_id: dto.router_id,
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
  }
}

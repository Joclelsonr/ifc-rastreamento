import { SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';
import { RoutesService } from '../routes.service';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class RoutesDriverGateway {
  constructor(private routesService: RoutesService) {}

  @SubscribeMessage('client:new-points')
  async handleMessage(client: any, payload: any) {
    const { route_id } = payload;
    const route = await this.routesService.findOne(route_id);
    // @ts-expect-error - routes has not ben defined
    const { steps } = route.direction.routes[0].legs[0];
    for (const step of steps) {
      const { lat, lng } = step.start_location;
      client.emit(`server:new-point/${route_id}:list`, { route_id, lat, lng });
      await sleep(2000);
      const { lat2, lng2 } = step.end_location;
      client.emit(`server:new-point/${route_id}:list`, {
        route_id,
        lat: lat2,
        lng: lng2,
      });
      await sleep(2000);
    }
  }
}

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

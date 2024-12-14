"use server";

import { revalidateTag } from "next/cache";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function createRouteAction(state: any, formData: FormData) {
  const { originId, destinationId } = Object.fromEntries(formData);
  const directionsResponse = await fetch(
    `${process.env.NEST_API_URL}/directions?originId=${originId}&destinationId=${destinationId}`,
    {
      // cache: "force-cache",
      // next: {
      //   revalidate: 1 * 60 * 60 * 24,
      // }
    }
  );
  if (!directionsResponse.ok) {
    return { error: "Directions not found" };
  }
  const directionsData = await directionsResponse.json();
  const startAddress = directionsData.routes[0].legs[0].start_address;
  const endAddress = directionsData.routes[0].legs[0].end_address;

  const response = await fetch(`${process.env.NEST_API_URL}/routes`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name: `${startAddress} - ${endAddress}`,
      origin_id: originId,
      destination_id: destinationId,
    }),
  });

  if (!response.ok) {
    return { error: "Route not created" };
  }

  revalidateTag("routes");

  return { success: true };
}

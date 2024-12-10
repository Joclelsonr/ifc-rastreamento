import React from "react";
import { NewRouteForm } from "./_components/new-route-form";
import { GoogleMaps } from "./_components/google-maps";

export async function searchDirections(origin: string, destination: string) {
  const [originResponse, destinationResponse] = await Promise.all([
    fetch(`http://localhost:3000/places?text=${origin}`, {
      // cache: "force-cache",
      // next: {
      //   revalidate: 1 * 60 * 60 * 24,
      // }
    }),
    fetch(`http://localhost:3000/places?text=${destination}`, {
      // cache: "force-cache",
      // next: {
      //   revalidate: 1 * 60 * 60 * 24,
      // }
    }),
  ]);
  if (!originResponse.ok) {
    throw new Error("Origin not found");
  }
  if (!destinationResponse.ok) {
    throw new Error("Destination not found");
  }

  const [originData, destinationData] = await Promise.all([
    originResponse.json(),
    destinationResponse.json(),
  ]);
  const placeOriginId = originData.candidates[0].place_id;
  const placeDestinationId = destinationData.candidates[0].place_id;

  const directionsResponse = await fetch(
    `http://localhost:3000/directions?originId=${placeOriginId}&destinationId=${placeDestinationId}`,
    {
      // cache: "force-cache",
      // next: {
      //   revalidate: 1 * 60 * 60 * 24,
      // }
    }
  );
  if (!directionsResponse.ok) {
    throw new Error("Directions not found");
  }
  const directionsData = await directionsResponse.json();

  return {
    directionsData,
    placeOriginId,
    placeDestinationId,
  };
}

export default async function NewRoutePage({
  searchParams,
}: {
  searchParams: Promise<{ origin: string; destination: string }>;
}) {
  const { origin, destination } = await searchParams;

  const results =
    origin && destination ? await searchDirections(origin, destination) : null;
  let directionsData = null;
  let placeOriginId = null;
  let placeDestinationId = null;

  if (results) {
    directionsData = results.directionsData;
    placeOriginId = results.placeOriginId;
    placeDestinationId = results.placeDestinationId;
  }

  return (
    <div className="flex flex-1 w-full h-full">
      <div className="w-1/3 h-full p-4">
        <h4 className="text-3xl text-contrast mb-2">Nova Rota</h4>
        <form className="flex flex-col space-y-4" method="get">
          <div className="relative">
            <input
              id="origin"
              name="origin"
              type="text"
              placeholder=""
              defaultValue={origin}
              className="block rounded-t-lg px-2.5 pb-2.5 pt-5 w-full text-sm text-contrast bg-default border-0 border-b-2 border-contrast appearance-none focus:outline-none focus:ring-0 focus:border-primary peer"
            />
            <label
              htmlFor="origin"
              className="absolute text-contrast duration-300 transform -translate-y-4 scale-75 top-3 z-10 origin-[0] start-2.5 peer-focus:text-secondary peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto"
            >
              Origen
            </label>
          </div>
          <div className="relative">
            <input
              id="destination"
              name="destination"
              type="text"
              placeholder=""
              defaultValue={destination}
              className="block rounded-t-lg px-2.5 pb-2.5 pt-5 w-full text-sm text-contrast bg-default border-0 border-b-2 border-contrast appearance-none focus:outline-none focus:ring-0 focus:border-primary peer"
            />
            <label
              htmlFor="destination"
              className="absolute text-contrast duration-300 transform -translate-y-4 scale-75 top-3 z-10 origin-[0] start-2.5 peer-focus:text-secondary peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto"
            >
              Destino
            </label>
          </div>
          <button
            type="submit"
            className="bg-main text-primary p-2 rounded text-xl font-bold"
          >
            Pesquisar
          </button>
        </form>
        {directionsData && (
          <div className="mt-4 p-4 border rounded text-contrast">
            <ul>
              <li className="mb-2">
                <strong>Origen:</strong>
                {directionsData.routes[0].legs[0].start_address}
              </li>
              <li className="mb-2">
                <strong>Destino:</strong>
                {directionsData.routes[0].legs[0].end_address}
              </li>
              <li className="mb-2">
                <strong>Distancia:</strong>
                {directionsData.routes[0].legs[0].distance.text}
              </li>
              <li className="mb-2">
                <strong>Duração:</strong>
                {directionsData.routes[0].legs[0].duration.text}
              </li>
            </ul>
            <NewRouteForm>
              {placeOriginId && (
                <input type="hidden" name="originId" value={placeOriginId} />
              )}
              {placeDestinationId && (
                <input
                  type="hidden"
                  name="destinationId"
                  value={placeDestinationId}
                />
              )}
              <button
                type="submit"
                className="bg-main text-primary p-2 mt-4 rounded font-bold"
              >
                Adicionar rota
              </button>
            </NewRouteForm>
          </div>
        )}
      </div>
      <GoogleMaps directionsData={directionsData} />
    </div>
  );
}

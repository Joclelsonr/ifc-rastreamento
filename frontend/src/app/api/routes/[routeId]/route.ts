import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ routeId: string }> }
) {
  const { routeId } = await params;
  const response = await fetch(
    `${process.env.NEXT_API_URL}/routes/${routeId}`,
    {
      cache: "force-cache",
      next: {
        tags: [`routes-${routeId}`, "routes"],
      },
    }
  );
  const route = await response.json();
  return NextResponse.json(route);
}

import { type NextRequest } from "next/server"
import { getQuery } from "../../utils/api"
import { mapHSLData } from "../../utils/dataMapper"

export const dynamic = "force-dynamic"
export const GET = async (request: NextRequest) => {
  const searchParams = request.nextUrl.searchParams
  const lat = Number(searchParams.get("lat"))
  const lon = Number(searchParams.get("lon"))
  const waltti = searchParams.get("waltti")

  const response = await fetch(
    `https://api.digitransit.fi/routing/v1/routers/${
      waltti === "waltti" ? "waltti" : "hsl"
    }/index/graphql?digitransit-subscription-key=${
      process.env.DIGITRANSIT_SUBSCRIPTION_KEY
    }`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        query: getQuery(lat, lon),
      }),
    }
  )
  const data = await response.json()
  const mapped = mapHSLData(data)

  return Response.json(mapped)
}

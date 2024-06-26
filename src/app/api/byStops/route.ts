import { type NextRequest } from "next/server"
import { getStopsQuery } from "../../../utils/queries"
import { mapHSLData } from "../../../utils/dataUtils"

export const dynamic = "force-dynamic"
export const GET = async (request: NextRequest) => {
  const searchParams = request.nextUrl.searchParams
  const lat = Number(searchParams.get("lat"))
  const lon = Number(searchParams.get("lon"))
  const radius = Number(searchParams.get("radius")) || 500
  const waltti = searchParams.get("waltti")

  try {
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
          query: getStopsQuery(lat, lon, radius),
        }),
      }
    )

    if (response.status !== 200) {
      throw new Error("Digitransit API throwed " + response.status)
    }

    const data = await response.json()
    const mapped = mapHSLData(data)

    return Response.json(mapped)
  } catch (error) {
    console.error(error)
    return new Response(`Internal Server Error`, {
      status: 500,
    })
  }
}

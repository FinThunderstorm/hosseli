import { type NextRequest } from "next/server"

export const GET = async (request: NextRequest) => {
  const searchParams = request.nextUrl.searchParams
  const searchAddress = searchParams.get("searchAddress")

  const response = await fetch(
    `https://api.digitransit.fi/geocoding/v1/search?digitransit-subscription-key=${process.env.DIGITRANSIT_SUBSCRIPTION_KEY}&text=${searchAddress}`
  )
  const addresses = await response.json()

  return Response.json(addresses.features || [])
}

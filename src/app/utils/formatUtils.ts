import type { Route, Stop } from "../types"

export const formatStop = (stop: Stop): string => {
  return `${stop.code} ${stop.name} ${stop.platformCode}`
}

export const formatRoute = (route: Route): string => {
  return `${route.shortName} ${route.headsign}`
}

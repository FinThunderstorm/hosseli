import distanceFrom from "distance-from"
import dayjs from "dayjs"
import isSameOrAfter from "dayjs/plugin/isSameOrAfter"
import "dayjs/locale/fi"
import type {
  AverageTime,
  Coordinate,
  Route,
  Stop,
  Stoptime,
  TripStop,
} from "../types"
import { averages } from "./constraints"

dayjs.extend(isSameOrAfter)

export const getColorByType = (type: string) => {
  /**
   * HSL's Colors fetched from https://github.com/HSLdevcom/digitransit-ui/blob/v3/app/configurations/config.hsl.js
   */
  const colors: Record<string, string> = {
    BUS: "#007ac9",
    EXPRESSBUS: "#CA4000",
    RAIL: "#8c4799",
    TRAM: "#008151",
    FERRY: "#007A97",
    SUBWAY: "#CA4000",
    CITYBIKE: "#f2b62d",
    SPEEDTRAM: "#007E79",
  }

  return colors[type]
}

export const mapHSLData = (input: any): Stop[] => {
  return input.data.stopsByRadius.edges.map((edge: any): Stop => {
    const stop: Omit<Stop, "routes"> = {
      key: edge.node.stop.gtfsId,
      gtfsId: edge.node.stop.gtfsId,
      distance: edge.node.distance,
      code: edge.node.stop.code,
      locationType: edge.node.stop.locationType,
      platformCode: edge.node.stop.platformCode || "",
      position: [edge.node.stop.lat, edge.node.stop.lon],
      name: edge.node.stop.name,
    }

    const routes: Route[] = edge.node.stop.stoptimesForPatterns.map(
      (stp: any): Route => {
        const mode =
          stp.pattern.route.type === 900
            ? "SPEEDTRAM"
            : stp.pattern.route.type === 702
            ? "EXPRESSBUS"
            : stp.pattern.route.mode

        const route: Omit<Route, "stoptimes"> = {
          key: `${stop.key}-${stp.pattern.route.gtfsId}`,
          gtfsId: stp.pattern.route.gtfsId,
          code: stp.pattern.code,
          headsign: stp.pattern.headsign,
          mode: mode,
          shortName: stp.pattern.route.shortName,
        }

        const stoptimes: Stoptime[] = stp.stoptimes.map(
          (stoptime: any): Stoptime => {
            const geometry: Coordinate[] = stoptime.trip.geometry.map(
              (geometry: Coordinate[]) => [geometry[1], geometry[0]]
            )

            const nearestPosition = geometry
              .map((g: Coordinate): { pos: Coordinate; dist: number } => {
                return {
                  pos: g,
                  dist: calculateDistanceBetween(stop.position, g),
                }
              })
              .sort((a, b) => a.dist - b.dist)[0]

            const nearestPositionIndex = geometry.findIndex(
              (g) =>
                g[0] === nearestPosition.pos[0] &&
                g[1] === nearestPosition.pos[1]
            )

            const stoptimeOut: Omit<Stoptime, "stops" | "averageTimes"> = {
              key: `${stop.key}-${route.key}-${stoptime.trip.gtfsId}`,
              gtfsId: stoptime.trip.gtfsId,
              routeShortName: stoptime.trip.routeShortName,
              nearestPosition: nearestPosition.pos,
              positionsFromStop: geometry.slice(nearestPositionIndex),
              color: getColorByType(route.mode),
              arrival: dayjs
                .unix(stoptime.serviceDay + stoptime.scheduledArrival)
                .format("YYYY-MM-DDTHH:mm:ss"),
              departure: dayjs
                .unix(stoptime.serviceDay + stoptime.scheduledDeparture)
                .format("YYYY-MM-DDTHH:mm:ss"),
            }

            const stops: TripStop[] = stoptime.trip.stoptimesForDate
              .map((std: any): TripStop => {
                const arrivalTimeFromStart = dayjs
                  .unix(std.serviceDay + std.scheduledArrival)
                  .diff(
                    dayjs.unix(
                      stoptime.serviceDay + stoptime.scheduledDeparture
                    ),
                    "minute"
                  )

                return {
                  key: `${edge.node.stop.gtfsId}-${stoptime.trip.gtfsId}-${std.stop.code}`,
                  code: std.stop.code,
                  name: std.stop.name,
                  gtfsId: std.stop.gtfsId,
                  position: [std.stop.lat, std.stop.lon],
                  locationType: std.stop.locationType,
                  routeShortName: route.shortName,
                  routeHeadsign: route.headsign,
                  pickupType: std.pickupType,
                  arrival: dayjs
                    .unix(std.serviceDay + std.scheduledArrival)
                    .format("YYYY-MM-DDTHH:mm:ss"),
                  departure: dayjs
                    .unix(std.serviceDay + std.scheduledDeparture)
                    .format("YYYY-MM-DDTHH:mm:ss"),
                  arrivalTimeFromStart: arrivalTimeFromStart,
                  arrivalTimeFromStartOver:
                    mapArrivalTime(arrivalTimeFromStart),
                }
              })
              .filter((std: TripStop, index: number) => {
                const indexOfStop = stoptime.trip.stoptimesForDate.findIndex(
                  (st: any) => st.stop.gtfsId === stop.gtfsId
                )

                return index >= indexOfStop
              })

            const averageTimes = averages
              .map((avg) =>
                stops
                  .filter((ts) => ts.arrivalTimeFromStartOver === avg)
                  .sort(
                    (a, b) => b.arrivalTimeFromStart - a.arrivalTimeFromStart
                  )
              )
              .filter((avgs) => avgs.length > 0)
              .map((avgs) => ({
                averageTime: avgs[0].arrivalTimeFromStartOver,
                position: avgs[0].position,
              }))

            return {
              ...stoptimeOut,
              stops: stops,
              averageTimes: averageTimes,
            }
          }
        )

        return {
          ...route,
          stoptimes: stoptimes,
        }
      }
    )

    return {
      ...stop,
      routes: routes,
    }
  })
}

const mapArrivalTime = (arrivalTime: number): AverageTime => {
  return arrivalTime === 0
    ? "0"
    : arrivalTime <= 5
    ? "5"
    : arrivalTime > 5 && arrivalTime <= 10
    ? "10"
    : arrivalTime > 10 && arrivalTime <= 15
    ? "15"
    : arrivalTime > 15 && arrivalTime <= 20
    ? "20"
    : arrivalTime > 20 && arrivalTime <= 30
    ? "30"
    : arrivalTime > 30 && arrivalTime <= 45
    ? "45"
    : arrivalTime > 45 && arrivalTime <= 60
    ? "60"
    : "60+"
}

export const calculateDistanceBetween = (
  coord1?: Coordinate,
  coord2?: Coordinate
): number => {
  if (!coord1 || !coord2) {
    return Infinity
  }

  return coord1[0] === coord2[0] && coord1[0] === coord2[1]
    ? 0
    : distanceFrom(coord1).to(coord2).in("cm")
}

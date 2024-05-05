import distanceFrom from "distance-from"
import dayjs from "dayjs"
import isSameOrAfter from "dayjs/plugin/isSameOrAfter"
import "dayjs/locale/fi"

dayjs.extend(isSameOrAfter)

export const getColorByType = (type: string) => {
  /**
   * HSL's Colors fetched from https://github.com/HSLdevcom/digitransit-ui/blob/v3/app/configurations/config.hsl.js
   */
  const colors: Record<string, string> = {
    BUS: "#007ac9",
    "mode-bus-express": "#CA4000",
    "mode-bus-local": "#007ac9",
    RAIL: "#8c4799",
    TRAM: "#008151",
    FERRY: "#007A97",
    "mode-ferry-pier": "#666666",
    METRO: "#CA4000",
    CITYBIKE: "#f2b62d",
    "mode-citybike-secondary": "#333333",
    SPEEDTRAM: "#007E79",
  }

  return colors[type]
}

export const mapHSLData = (input: any) => {
  return input.data.stopsByRadius.edges.map((edge: any) => ({
    code: edge.node.stop.code,
    gtfsId: edge.node.stop.gtfsId,
    locationType: edge.node.stop.locationType,
    lat: edge.node.stop.lat,
    lon: edge.node.stop.lon,
    name: edge.node.stop.name,
    routes: edge.node.stop.stoptimesForPatterns.map((stp: any) => ({
      code: stp.pattern.code,
      headsign: stp.pattern.headsign,
      name: stp.pattern.name,
      mode: stp.pattern.route.mode,
      stoptimes: stp.stoptimes.map((stoptime: any) => {
        const geometry = stoptime.trip.geometry.map((geometry: number[]) => [
          geometry[1],
          geometry[0],
        ])

        const nearestPosition = geometry
          .map((g: any) => {
            return {
              pos: g,
              dist:
                edge.node.stop.lat === g[0] && edge.node.stop.lon === g[1]
                  ? 0
                  : distanceFrom([edge.node.stop.lat, edge.node.stop.lon])
                      .to([g[0], g[1]])
                      .in("cm"),
            }
          })
          .sort((a: any, b: any) => a.dist > b.dist)[0]

        const nearestPositionIndex = geometry.findIndex(
          (g: any) =>
            g[0] === nearestPosition.pos[0] && g[0] === nearestPosition.pos[0]
        )

        return {
          key: `${edge.node.stop.gtfsId}-${stoptime.trip.gtfsId}`,
          gtfsId: stoptime.trip.gtfsId,
          routeShortName: stoptime.trip.routeShortName,
          geometry: geometry,
          nearestPosition: nearestPosition.pos,
          positionsFromStop: geometry.slice(nearestPositionIndex),
          color: getColorByType(stp.pattern.route.mode),
          arrival: dayjs
            .unix(stoptime.serviceDay + stoptime.scheduledArrival)
            .format("YYYY-MM-DDTHH:mm:ss"),
          departure: dayjs
            .unix(stoptime.serviceDay + stoptime.scheduledDeparture)
            .format("YYYY-MM-DDTHH:mm:ss"),
          stoptimes: stoptime.trip.stoptimesForDate
            .map((std: any) => {
              const arrivalTimeFromStart = dayjs
                .unix(std.serviceDay + std.scheduledArrival)
                .diff(
                  dayjs.unix(stoptime.serviceDay + stoptime.scheduledArrival),
                  "minute"
                )
              return {
                code: std.stop.code,
                name: std.stop.name,
                gtfsId: std.stop.gtfsId,
                lat: std.stop.lat,
                lon: std.stop.lon,

                locationType: std.stop.locationType,
                routeCode: stp.pattern.code,
                routeHeadsign: stp.pattern.headsign,
                routeName: stp.pattern.name,
                pickupType: std.pickupType,
                arrival: dayjs
                  .unix(std.serviceDay + std.scheduledArrival)
                  .format("YYYY-MM-DDTHH:mm:ss"),
                departure: dayjs
                  .unix(std.serviceDay + std.scheduledDeparture)
                  .format("YYYY-MM-DDTHH:mm:ss"),
                arrivalTimeFromStart: arrivalTimeFromStart,
                departureTimeFromStart: dayjs
                  .unix(std.serviceDay + std.scheduledDeparture)
                  .diff(
                    dayjs.unix(
                      stoptime.serviceDay + stoptime.scheduledDeparture
                    ),
                    "minute"
                  ),
                arrivalTimeFromStartOver:
                  arrivalTimeFromStart < 5
                    ? "0"
                    : arrivalTimeFromStart >= 5 && arrivalTimeFromStart < 10
                    ? "5"
                    : arrivalTimeFromStart >= 10 && arrivalTimeFromStart < 15
                    ? "10"
                    : arrivalTimeFromStart >= 15 && arrivalTimeFromStart < 20
                    ? "15"
                    : arrivalTimeFromStart >= 20 && arrivalTimeFromStart < 30
                    ? "20"
                    : arrivalTimeFromStart >= 30 && arrivalTimeFromStart < 45
                    ? "30"
                    : arrivalTimeFromStart >= 45 && arrivalTimeFromStart < 60
                    ? "45"
                    : "60",
              }
            })
            .filter((std: any, index: number) => {
              const indexOfStop = stoptime.trip.stoptimesForDate.findIndex(
                (st: any) => st.stop.gtfsId === edge.node.stop.gtfsId
              )

              return index >= indexOfStop - 1
            }),
        }
      }),
    })),
  }))
}

"use client"
import { MapContainer, TileLayer, Polyline } from "react-leaflet"
import { useProxy } from "valtio/utils"
import { routeState } from "../state"
import dayjs from "dayjs"
import MapPositionHandler from "./MapPositionHandler"
import StopMarker from "./StopMarker"
import TripStopMarker from "./TripStopMarker"
import type { Stop, Route, Stoptime, TripStop } from "../../types"

const Map = () => {
  const routeSnapshot = useProxy(routeState, { sync: true })

  const routePositions: Stoptime[] = routeSnapshot.byStops.flatMap(
    (stop: Stop) =>
      stop.routes
        .filter((route: Route) => {
          if (
            routeSnapshot.routes.length === 0 &&
            routeSnapshot.stops.length === 0
          ) {
            return true
          }
          if (
            routeSnapshot.stops.length > 0 &&
            routeSnapshot.routes.length === 0
          ) {
            return routeSnapshot.stops.includes(stop.key)
          }
          if (
            routeSnapshot.stops.length > 0 &&
            routeSnapshot.routes.length > 0
          ) {
            const isInRoutes = routeSnapshot.routes.includes(route.key)
            const isInStops = routeSnapshot.stops.includes(stop.key)
            const routeKeyIncludesStop = route.key.includes(stop.key)

            return isInRoutes && (isInStops || routeKeyIncludesStop)
          }
          return routeSnapshot.routes.includes(route.key)
        })
        .flatMap((route: Route): Stoptime[] => route.stoptimes)
  )

  const stoptimes = routePositions.flatMap((rp: Stoptime) => rp.stops)

  return (
    <MapContainer
      className="map"
      center={[60.204477007147915, 24.962573209994307]}
      zoom={13}
    >
      <TileLayer
        attribution={`&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; Digitransit ${dayjs().format(
          "YYYY"
        )}, &copy; HSL ${dayjs().format("YYYY")}`}
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <MapPositionHandler />
      {routeSnapshot.byStops
        .filter((stop: Stop) => {
          return routeSnapshot.stops.length > 0 ||
            routeSnapshot.routes.length > 0
            ? routeSnapshot.stops.includes(stop.key) ||
                routeSnapshot.routes.filter((route) => route.includes(stop.key))
                  .length > 0
            : true
        })
        .map((stop: Stop) => (
          <StopMarker key={stop.key} stop={stop} />
        ))}
      {routePositions.map((rp: Stoptime, index: number) => (
        <Polyline
          key={rp.key}
          pathOptions={{
            color: rp.color,
          }}
          positions={rp.positionsFromStop}
        />
      ))}
      {stoptimes.map((st: TripStop) => (
        <TripStopMarker st={st} />
      ))}
    </MapContainer>
  )
}

export default Map

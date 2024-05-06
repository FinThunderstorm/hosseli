"use client"
import {
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  Polyline,
  Circle,
} from "react-leaflet"
import { useProxy } from "valtio/utils"
import { routeState } from "./state"
import dayjs from "dayjs"
import MapPositionHandler from "./MapPositionHandler"

const Map = () => {
  const routeSnapshot = useProxy(routeState, { sync: true })

  const routePositions = routeSnapshot.byStops.flatMap((stop: any) =>
    stop.routes
      .filter((route: any) => {
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
          return routeSnapshot.stops.includes(stop.gtfsId)
        }
        if (routeSnapshot.stops.length > 0 && routeSnapshot.routes.length > 0) {
          return (
            routeSnapshot.stops.includes(stop.gtfsId) &&
            routeSnapshot.routes.includes(route.code)
          )
        }
        return routeSnapshot.routes.includes(route.code)
      })
      .flatMap((route: any) => route.stoptimes)
  )

  const stoptimes = routePositions.flatMap((rp: any) => rp.stoptimes)

  const timeColors: Record<number, string> = {
    0: "#FFEF00",
    5: "#ffd300",
    10: "#feb700",
    15: "#f99b00",
    20: "#f37e00",
    30: "#e96000",
    45: "#dd3f00",
    60: "#cf0a0c",
  }

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
        .filter((stop: any) =>
          routeSnapshot.stops.length > 0
            ? routeSnapshot.stops.includes(stop.gtfsId)
            : true
        )
        .map((stop: any) => (
          <>
            <Marker key={stop.gtfsId} position={[stop.lat, stop.lon]}>
              <Popup>
                <p>
                  {stop.gtfsId} {stop.code} {stop.name}
                </p>
                <ul>
                  {stop.routes.map((route: any) => (
                    <li key={route.code}>{route.name}</li>
                  ))}
                </ul>
              </Popup>
            </Marker>
          </>
        ))}
      {routePositions.map((rp: any, index: number) => (
        <Polyline
          key={rp.key}
          pathOptions={{
            color: rp.color,
          }}
          positions={rp.positionsFromStop}
        />
      ))}
      {stoptimes.map((st: any) => {
        return (
          <Circle
            center={[st.lat, st.lon]}
            radius={7}
            color={timeColors[st.arrivalTimeFromStartOver]}
          >
            <Popup>{JSON.stringify(st)}</Popup>
          </Circle>
        )
      })}
    </MapContainer>
  )
}

export default Map

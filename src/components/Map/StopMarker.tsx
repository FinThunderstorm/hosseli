"use client"
import { Marker, Popup } from "react-leaflet"
import type { Stop, Route } from "../../types"
import { formatRoute, formatStop } from "../../utils/formatUtils"

const StopMarker = ({ stop }: { stop: Stop }) => {
  return (
    <Marker position={[stop.lat, stop.lon]}>
      <Popup>
        <p>{formatStop(stop)}</p>
        <ul>
          {stop.routes.map((route: Route) => (
            <li key={route.key}>{formatRoute(route)}</li>
          ))}
        </ul>
      </Popup>
    </Marker>
  )
}

export default StopMarker

"use client"
import { Popup, CircleMarker, Tooltip } from "react-leaflet"
import { useProxy } from "valtio/utils"
import { routeState } from "../state"
import type { TripStop } from "../../types"

const TripStopMarker = ({ st }: { st: TripStop }) => {
  const routeSnapshot = useProxy(routeState, { sync: true })

  return (
    <CircleMarker
      key={st.key}
      center={[st.lat, st.lon]}
      radius={4}
      color="#666666"
    >
      <Popup>
        <ul>
          <li>
            <b>Stop:</b> {st.code} {st.name}
          </li>
          <li>
            <b>Route:</b> {st.routeCode} {st.routeName}
          </li>
          <li>
            <b>Arrives at:</b> {st.arrival}
          </li>
          <li>
            <b>Departures on:</b> {st.departure}
          </li>
          <li>
            <b>Time since start:</b> {st.arrivalTimeFromStart}
          </li>
          <li>
            <b>Time group since start:</b> {st.arrivalTimeFromStartOver}
          </li>
        </ul>
      </Popup>
      {(st.arrivalTimeFromStart || st.arrivalTimeFromStart) &&
        routeSnapshot.routes.length > 0 && (
          <Tooltip permanent>{st.arrivalTimeFromStart}</Tooltip>
        )}
    </CircleMarker>
  )
}

export default TripStopMarker

"use client"
import { useProxy } from "valtio/utils"
import { handleRouteSelect, handleStopSelect, routeState } from "./state"

const StopRouteSelector = () => {
  const routeSnapshot = useProxy(routeState, { sync: true })

  return (
    <ul>
      {routeSnapshot.byStops.map((stop: any) => (
        <li key={stop.gtfsId}>
          <div className="flex gap-2">
            <div className="flex gap-2 justify-items-start items-start">
              <input
                type="checkbox"
                className="p-1"
                onChange={(e) => {
                  handleStopSelect(stop.gtfsId, e.target.checked)
                }}
              />
              {stop.code}
            </div>
            <ul>
              {stop.routes.map((route: any) => (
                <li key={route.gtfsId} className="flex gap-2">
                  <input
                    type="checkbox"
                    className="m-1"
                    onChange={(e) => {
                      handleRouteSelect(route.code, e.target.checked)
                    }}
                  />
                  {route.name}
                </li>
              ))}
            </ul>
          </div>
        </li>
      ))}
    </ul>
  )
}

export default StopRouteSelector

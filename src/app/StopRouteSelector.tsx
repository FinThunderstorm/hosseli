"use client"
import CircularProgress from "@mui/material/CircularProgress"
import { useProxy } from "valtio/utils"
import { handleRouteSelect, handleStopSelect, routeState } from "./state"
import { Checkbox, FormControlLabel, FormGroup } from "@mui/material"
import { formatRoute, formatStop } from "./utils/formatUtils"
import type { Route, Stop } from "./types"

const StopRouteSelector = () => {
  const routeSnapshot = useProxy(routeState, { sync: true })

  return (
    <>
      {!routeSnapshot.isLoading && (
        <div>
          {routeSnapshot.byStops.map((stop) => {
            return (
              <div key={stop.gtfsId}>
                <FormGroup>
                  <FormControlLabel
                    control={
                      <Checkbox
                        sx={{ mr: 1 }}
                        checked={routeSnapshot.stops.includes(stop.key)}
                        onChange={(e) => {
                          handleStopSelect(stop.key, e.target.checked)
                        }}
                      />
                    }
                    label={formatStop(stop)}
                  />
                </FormGroup>
                {stop.routes.map((route: Route) => {
                  return (
                    <div className="pl-8">
                      <FormGroup>
                        <FormControlLabel
                          control={
                            <Checkbox
                              sx={{ mr: 1 }}
                              checked={routeSnapshot.routes.includes(route.key)}
                              onChange={(e) => {
                                handleRouteSelect(route.key, e.target.checked)
                              }}
                            />
                          }
                          label={formatRoute(route)}
                        />
                      </FormGroup>
                    </div>
                  )
                })}
              </div>
            )
          })}
        </div>
      )}
      {routeSnapshot.isLoading && <CircularProgress />}
    </>
  )
}

export default StopRouteSelector

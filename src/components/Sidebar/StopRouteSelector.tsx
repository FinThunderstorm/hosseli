"use client"
import { useProxy } from "valtio/utils"
import { handleRouteSelect, handleStopSelect, routeState } from "../state"
import { formatRoute, formatStop } from "../../utils/formatUtils"
import CircularProgress from "@mui/material/CircularProgress"
import Checkbox from "@mui/material/Checkbox"
import FormControlLabel from "@mui/material/FormControlLabel"
import FormGroup from "@mui/material/FormGroup"
import type { Route } from "../../types"

const StopRouteSelector = () => {
  const routeSnapshot = useProxy(routeState, { sync: true })

  return (
    <>
      {!routeSnapshot.isLoading && (
        <div className="px-2">
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
                    <div className="pl-10" key={route.key}>
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
      {routeSnapshot.isLoading && (
        <div className="flex items-center justify-center pt-12">
          <CircularProgress />
        </div>
      )}
    </>
  )
}

export default StopRouteSelector

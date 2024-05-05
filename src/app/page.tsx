"use client"
import {
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  Polyline,
  Circle,
} from "react-leaflet"
import Button from "@mui/material/Button"
import TextField from "@mui/material/TextField"
import Autocomplete from "@mui/material/Autocomplete"
import { useProxy } from "valtio/utils"
import {
  handleRouteSelect,
  handleSearch,
  handleStopSelect,
  routeState,
  searchAddress,
  searchStore,
  setSearchAddress,
} from "./state"
import { Feature } from "./types"
import Paper from "@mui/material/Paper"
import Typography from "@mui/material/Typography"
import Card from "@mui/material/Card"
import dayjs from "dayjs"

const Page = () => {
  const searchSnapshot = useProxy(searchStore, { sync: true })
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
    <main>
      <div className="layout">
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
        <Paper elevation={2} className="sidebar p-2">
          <Card className="search flex flex-col gap-2 p-2 mb-2 backdrop-blur">
            <Typography variant="overline">Hösseli</Typography>
            <TextField
              type="text"
              className="border me-8"
              label="Address"
              value={searchSnapshot.searchAddress}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setSearchAddress(e.target.value)
              }}
            />
            <Button
              variant="contained"
              onClick={() => {
                searchAddress()
              }}
            >
              search
            </Button>
            {searchSnapshot.addressOptions.length > 0 && (
              <Autocomplete<Feature>
                renderInput={(props) => (
                  <TextField
                    type="text"
                    className="border me-8"
                    label="Options"
                    {...props}
                  />
                )}
                getOptionLabel={(opt) => opt.properties.label}
                getOptionKey={(opt) => opt.properties.id}
                isOptionEqualToValue={(a, b) =>
                  a.properties.id === b.properties.id
                }
                options={searchSnapshot.addressOptions}
                onChange={(e, newValue) => {
                  if (newValue) handleSearch(newValue)
                }}
                value={searchSnapshot.feature}
              />
            )}
          </Card>
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
        </Paper>
      </div>
    </main>
  )
}

export default Page

"use client"
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

const Sidebar = () => {
  const searchSnapshot = useProxy(searchStore, { sync: true })
  const routeSnapshot = useProxy(routeState, { sync: true })

  return (
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
            isOptionEqualToValue={(a, b) => a.properties.id === b.properties.id}
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
  )
}

export default Sidebar

"use client"
import { useProxy } from "valtio/utils"
import {
  handleSearch,
  searchAddress,
  searchState,
  setRadius,
  setSearchAddress,
} from "../state"
import Autocomplete from "@mui/material/Autocomplete"
import Button from "@mui/material/Button"
import CircularProgress from "@mui/material/CircularProgress"
import TextField from "@mui/material/TextField"
import Typography from "@mui/material/Typography"

import type { Feature } from "../../types"
import Grid from "@mui/material/Grid"

const Search = ({ isWaltti }: { isWaltti: boolean }) => {
  const searchSnapshot = useProxy(searchState, { sync: true })

  return (
    <div className="search flex flex-col gap-2 px-2 pb-2 mb-2 border-b">
      <Typography variant="overline">
        Hösseli {isWaltti ? "Walttified" : ""}
      </Typography>
      <TextField
        type="text"
        label="Address"
        fullWidth
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
      {searchSnapshot.addressOptions.length > 0 &&
        !searchSnapshot.isLoading && (
          <Grid container columns={{ md: 4 }}>
            <Grid item md={3}>
              <Autocomplete<Feature>
                renderInput={(props) => (
                  <TextField
                    type="text"
                    className="mt-2 mr-1"
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
                  if (newValue) handleSearch(newValue, isWaltti)
                }}
                value={searchSnapshot.feature}
              />
            </Grid>
            <Grid item md={1}>
              <TextField
                type="number"
                className="mt-2 ml-1"
                label="Radius (m)"
                fullWidth
                value={searchSnapshot.radius}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  setRadius(e.target.valueAsNumber)
                }}
              />
            </Grid>
          </Grid>
        )}
      {searchSnapshot.isLoading && <CircularProgress />}
    </div>
  )
}

export default Search

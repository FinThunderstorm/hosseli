"use client"
import { useProxy } from "valtio/utils"
import {
  handleSearch,
  searchAddress,
  searchState,
  setSearchAddress,
} from "../state"
import Autocomplete from "@mui/material/Autocomplete"
import Button from "@mui/material/Button"
import Card from "@mui/material/Card"
import CircularProgress from "@mui/material/CircularProgress"
import TextField from "@mui/material/TextField"
import Typography from "@mui/material/Typography"
import type { Feature } from "../../types"

const Search = ({ isWaltti }: { isWaltti: boolean }) => {
  const searchSnapshot = useProxy(searchState, { sync: true })

  return (
    <Card className="search flex flex-col gap-2 p-2 mb-2 backdrop-blur">
      <Typography variant="overline">
        Hösseli {isWaltti ? "Walttified" : ""}
      </Typography>
      <TextField
        type="text"
        className="border me-8"
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
              if (newValue) handleSearch(newValue, isWaltti)
            }}
            value={searchSnapshot.feature}
          />
        )}
      {searchSnapshot.isLoading && <CircularProgress />}
    </Card>
  )
}

export default Search

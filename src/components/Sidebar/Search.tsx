"use client"
import { useProxy } from "valtio/utils"
import { handleSearch, searchAddress, searchState, setRadius } from "../state"
import Autocomplete from "@mui/material/Autocomplete"
import TextField from "@mui/material/TextField"
import Typography from "@mui/material/Typography"
import Grid from "@mui/material/Grid"
import OpenInNewIcon from "@mui/icons-material/OpenInNew"
import Link from "next/link"
import type { Feature } from "../../types"
import { useEffect } from "react"

const Search = ({ isWaltti }: { isWaltti: boolean }) => {
  const searchSnapshot = useProxy(searchState, { sync: true })

  return (
    <div className="search flex flex-col gap-2 px-2 pb-2 mb-2 border-b">
      <div className="flex flex-row justify-between">
        <Typography variant="overline" fontWeight={700}>
          Hösseli {isWaltti ? "Walttified" : ""}
        </Typography>
        <Link
          href={isWaltti ? "/" : "/waltti"}
          className="flex flex-row gap-1 items-center"
        >
          <OpenInNewIcon fontSize="small" />
          <Typography variant="overline" className="hover:underline">
            {isWaltti ? "HSL" : "Waltti"}
          </Typography>
        </Link>
      </div>
      <Grid container columns={{ md: 4 }}>
        <Grid item md={3}>
          <Autocomplete<Feature>
            renderInput={(props) => (
              <TextField
                type="text"
                className="mt-2 mr-1"
                label="Address"
                {...props}
              />
            )}
            autoComplete
            includeInputInList
            filterSelectedOptions
            getOptionLabel={(opt) =>
              typeof opt === "string" ? opt : opt.properties.label
            }
            getOptionKey={(opt) =>
              typeof opt === "string" ? opt : opt.properties.id
            }
            filterOptions={(x) => x}
            isOptionEqualToValue={(a, b) => a.properties.id === b.properties.id}
            options={searchSnapshot.addressOptions}
            onInputChange={(e, newValue) => {
              searchAddress(newValue)
            }}
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
    </div>
  )
}

export default Search

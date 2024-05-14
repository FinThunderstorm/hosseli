import { devtools } from "valtio/utils"
import { Feature, Stop } from "../types"
import { proxy } from "valtio"

export const searchState = proxy<{
  feature: Feature | null
  addressOptions: Feature[]
  searchAddress: string
  isLoading: boolean
}>({
  feature: null,
  addressOptions: [],
  searchAddress: "",
  isLoading: false,
})

const unsubSearch = devtools(searchState, {
  name: "searchState",
  enabled: true,
})

export const setSearchAddress = (newValue: string) => {
  searchState.searchAddress = newValue
}

export const setAddressOptions = (addresses: Feature[]) => {
  searchState.addressOptions = addresses
}

export const setFeature = (feature: Feature | null) => {
  searchState.feature = feature
}

export const searchAddress = async () => {
  try {
    searchState.isLoading = true
    const response = await fetch(
      `/api/addresses?searchAddress=${searchState.searchAddress}`
    )
    const addresses = await response.json()
    setAddressOptions(addresses)
    setFeature(null)
    searchState.isLoading = false
  } catch (error) {
    console.error(error)
  }
}

export const routeState = proxy<{
  stops: string[]
  routes: string[]
  byStops: Stop[]
  isLoading: boolean
}>({
  stops: [],
  routes: [],
  byStops: [],
  isLoading: false,
})

const unsubRoute = devtools(routeState, {
  name: "routeState",
  enabled: true,
})

export const handleStopSelect = (key: string, isChecked: boolean) => {
  routeState.stops = isChecked
    ? [...routeState.stops, key]
    : routeState.stops.filter((os: string) => os !== key)
  routeState.routes = routeState.routes.filter(
    (or: string) => !or.includes(key)
  )
}

export const handleRouteSelect = (key: string, isChecked: boolean) => {
  const stopKey = key.split("-")[0]
  const stopInStops = routeState.stops.includes(stopKey)

  routeState.routes = isChecked
    ? (routeState.routes = [...routeState.routes, key])
    : routeState.routes.filter((or: string) => or !== key)
  if (!stopInStops) {
    routeState.stops = [...routeState.stops, stopKey]
  }
}

export const handleSearch = async (
  feature: Feature | null,
  isWaltti: boolean
) => {
  try {
    if (!feature) return

    routeState.isLoading = true
    routeState.routes = []
    routeState.stops = []
    routeState.byStops = []

    searchState.feature = feature

    let lat = feature.geometry.coordinates[1]
    let lon = feature.geometry.coordinates[0]

    const response = await fetch(
      `/api/byStops?lat=${lat}&lon=${lon}${isWaltti ? "&waltti=waltti" : ""}`
    )
    const data = await response.json()
    routeState.byStops = data
    routeState.isLoading = false
  } catch (error) {
    console.error(error)
  }
}
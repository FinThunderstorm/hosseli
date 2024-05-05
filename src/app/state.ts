import { devtools } from "valtio/utils"
import { Feature } from "./types"
import { proxy } from "valtio"

export const searchStore = proxy<{
  feature: Feature | null
  addressOptions: Feature[]
  searchAddress: string
}>({
  feature: null,
  addressOptions: [],
  searchAddress: "",
})

const unsubSearch = devtools(searchStore, {
  name: "searchState",
  enabled: true,
})

export const setSearchAddress = (newValue: string) => {
  searchStore.searchAddress = newValue
}

export const setAddressOptions = (addresses: Feature[]) => {
  searchStore.addressOptions = addresses
}

export const setFeature = (feature: Feature | null) => {
  searchStore.feature = feature
}

export const searchAddress = async () => {
  const response = await fetch(
    `/api/addresses?searchAddress=${searchStore.searchAddress}`
  )
  const addresses = await response.json()
  setAddressOptions(addresses)
  setFeature(null)
}

export const routeState = proxy<{
  stops: string[]
  routes: string[]
  byStops: any[]
}>({
  stops: [],
  routes: [],
  byStops: [],
})

const unsubRoute = devtools(routeState, {
  name: "routeState",
  enabled: true,
})

export const handleStopSelect = (gtfsId: string, isChecked: boolean) => {
  routeState.stops = isChecked
    ? [...routeState.stops, gtfsId]
    : routeState.stops.filter((os: any) => os !== gtfsId)
}

export const handleRouteSelect = (code: string, isChecked: boolean) => {
  routeState.routes = isChecked
    ? (routeState.routes = [...routeState.routes, code])
    : routeState.routes.filter((or: any) => or !== code)
}

export const handleSearch = async (feature: Feature | null) => {
  if (!feature) return

  searchStore.feature = feature

  let lat = feature.geometry.coordinates[1]
  let lon = feature.geometry.coordinates[0]

  const response = await fetch(`/api/byStops?lat=${lat}&lon=${lon}`)
  const data = await response.json()
  routeState.byStops = data
}

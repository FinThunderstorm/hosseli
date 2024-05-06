import { useProxy } from "valtio/utils"
import { searchStore } from "./state"
import { useMap } from "react-leaflet"
import { useEffect } from "react"

const MapPositionHandler = () => {
  const searchSnapshot = useProxy(searchStore, { sync: true })
  const map = useMap()

  useEffect(() => {
    map.setView(
      searchSnapshot.feature?.geometry.coordinates
        ? [
            searchSnapshot.feature?.geometry.coordinates[1],
            searchSnapshot.feature?.geometry.coordinates[0],
          ]
        : [60.204477007147915, 24.962573209994307],
      13
    )
  }, [searchSnapshot.feature])

  return <></>
}

export default MapPositionHandler

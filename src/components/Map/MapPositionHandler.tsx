import { useProxy } from "valtio/utils"
import { searchState } from "../state"
import { useMap } from "react-leaflet"
import { useEffect } from "react"

const MapPositionHandler = () => {
  const searchSnapshot = useProxy(searchState, { sync: true })
  const map = useMap()

  useEffect(() => {
    if (searchSnapshot.feature !== null)
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

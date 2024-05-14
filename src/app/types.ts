export type Point = {
  type: "Point"
  coordinates: [number, number]
}

export type Feature = {
  type: "Feature"
  geometry: Point
  properties: {
    id: string
    gid: string
    layer: string
    source: string
    source_id: string
    name: string
    housenumber: string
    street: string
    postalcode: string
    postalcode_gid: string
    confidence: number
    accuracy: string
    region: string
    region_gid: string
    localadmin: string
    localadmin_gid: string
    locality: string
    locality_gid: string
    neighbourhood: string
    neighbourhood_gid: string
    label: string
  }
}

export type Coordinate = [number, number]

export type Stop = {
  key: string
  distance: number
  code: string
  gtfsId: string
  locationType: string
  platformCode: string
  lat: number
  lon: number
  name: string
  routes: Route[]
}

export type Route = {
  key: string
  gtfsId: string
  code: string
  headsign: string
  name: string
  mode: string
  shortName: string
  longName: string
  stoptimes: Stoptime[]
}

export type Stoptime = {
  key: string
  gtfsId: string
  routeShortName: string
  geometry: Coordinate[]
  nearestPosition: Coordinate
  positionsFromStop: Coordinate[]
  color: string
  arrival: string
  departure: string
  stoptimes: any[]
}

export type RouteStop = {
  code: string
  name: string
  gtfsId: string
}

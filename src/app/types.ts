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

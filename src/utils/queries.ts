export const getStopsQuery = (lat: number, lon: number, radius: number) => {
  return `
{
  stopsByRadius(lat: ${lat}, lon: ${lon}, radius: ${radius}) {
    edges {
      node {
        distance
        stop {
          gtfsId
          name
          code
          lat
          lon
          locationType
          platformCode
          stoptimesForPatterns(numberOfDepartures: 1, startTime: 0, omitNonPickups: true) {
            pattern {
              code
              headsign
              route {
                gtfsId
                mode
                shortName
                type
              }
            }
            stoptimes {
              scheduledDeparture
              scheduledArrival
              serviceDay
              trip {
                gtfsId
                routeShortName
                tripShortName
                tripHeadsign
                geometry
                stoptimesForDate {
                  stop {
                    code
                    name
                    gtfsId
                    lat
                    lon
                    locationType
                  }
                  pickupType
                  scheduledArrival
                  scheduledDeparture
                  serviceDay
                }
              }
            }
          }
        }
      }
    }
  }
}
`
}

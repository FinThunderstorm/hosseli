export const getQuery = (lat: number, lon: number) => {
  return `
{
  stopsByRadius(lat: ${lat}, lon: ${lon}, radius: 500) {
    edges {
      node {
        stop {
          gtfsId
          name
          code
          lat
          lon
          locationType
          stoptimesForPatterns(numberOfDepartures: 1, startTime: 0, omitNonPickups: true) {
            pattern {
              code
              name
              headsign
              route {
                mode
              }
            }
            stoptimes {
              scheduledDeparture
              scheduledArrival
              serviceDay
              trip {
                gtfsId
                routeShortName
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

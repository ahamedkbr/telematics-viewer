const express = require("express");
const DeviceMetrics = require("./models/DeviceMetrics");
const cors = require("cors");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

app.get("/device-details/all", async (req, res) => {
  try {
    const data = await DeviceMetrics.find({});
    return res.status(200).json({ data });
  } catch (error) {
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/device-detail/:imei", async (req, res) => {
  try {

    // * Aggregate Query : Get all data when the IGNITION and MOVEMENT was ON and speed is greater than 5
    // ! DANGER : TOUCH THIS AGGREGATION AT YOUR OWN RISK
    const data = await DeviceMetrics.aggregate([
      {
        $match: {
          $and: [
            {
              deviceImei: req.params.imei
            },
            {
              "metadata.ioData": {
                $elemMatch: {
                  ioId: 240,
                  ioValue: 1
                }
              }
            }, {
              "metadata.ioData": {
                $elemMatch: {
                  ioId: 239,
                  ioValue: 1
                }
              }
            }, {
              "metadata.speed.value": {
                $gte: 5
              }
            }
          ]
        }
      }, {
        $project: {
          latitude: "$metadata.latitude.value",
          longitude: "$metadata.longitude.value",
          altitude: "$metadata.altitude.value",
          speed: "$metadata.speed.value",
          totalData: "$metadata.totalIoProps.value",
          imei: "$deviceImei",
          ioFormatted: {
            $arrayToObject: {
              $map: {
                'input': '$metadata.ioData',
                'as': 'ele',
                'in': {
                  'k': {
                    '$convert': {
                      'input': '$$ele.parameterName',
                      'to': 'string',
                      'onNull': {
                        '$convert': {
                          'input': '$$ele.ioId',
                          'to': 'string'
                        }
                      }
                    }
                  },
                  'v': '$$ele.ioValue'
                }
              }
            }
          },
          'timestamp': 1
        }
      }, {
        $sort: {
          timestamp: 1
        }
      }
    ]);
    return res.status(200).json({ data });
  } catch (error) {
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/device-detail/trips/:imei", async (req, res) => {
  try {

    let trips = [];
    async function getTripStartAndEndTimes(minimumStartTime = new Date(1970)) {
      const [startTime] = await DeviceMetrics.aggregate([
        {
          '$match': {
            '$and': [
              {
                'deviceImei': req.params.imei
              },
              {
                timestamp: {
                  $gt: minimumStartTime
                }
              },
              {
                'metadata.ioData': {
                  '$elemMatch': {
                    'ioId': 240,
                    'ioValue': 1
                  }
                }
              }, {
                'metadata.ioData': {
                  '$elemMatch': {
                    'ioId': 239,
                    'ioValue': 1
                  }
                }
              }, {
                'metadata.speed.value': {
                  '$gte': 5
                }
              }
            ]
          }
        }, {
          '$project': {
            'latitude': '$metadata.latitude.value',
            'longitude': '$metadata.longitude.value',
            'altitude': '$metadata.altitude.value',
            'speed': '$metadata.speed.value',
            'timestamp': 1
          }
        }, {
          '$sort': {
            'timestamp': 1
          }
        },
        {
          $limit: 1
        }
      ]);

      const [endTime] = await DeviceMetrics.aggregate([
        {
          '$match': {
            '$and': [
              {
                'deviceImei': req.params.imei
              },
              {
                timestamp: {
                  $gt: startTime.timestamp
                }
              },
              {
                'metadata.ioData': {
                  '$elemMatch': {
                    'ioId': 240,
                    'ioValue': 0
                  }
                }
              }, {
                'metadata.ioData': {
                  '$elemMatch': {
                    'ioId': 239,
                    'ioValue': 0
                  }
                }
              }, {
                'metadata.speed.value': 0
              }
            ]
          }
        }, {
          '$project': {
            'latitude': '$metadata.latitude.value',
            'longitude': '$metadata.longitude.value',
            'altitude': '$metadata.altitude.value',
            'speed': '$metadata.speed.value',
            'timestamp': 1
          }
        }, {
          '$sort': {
            'timestamp': 1
          }
        },
        {
          $limit: 1
        }
      ]);

      if (startTime && endTime) {
        const positions = await DeviceMetrics.aggregate([
          {
            $match: {
              timestamp: {
                $gte: startTime.timestamp,
                $lte: endTime.timestamp
              }
            }
          },
          {
            $project: {
              'latitude': '$metadata.latitude.value',
              'longitude': '$metadata.longitude.value',
              'altitude': '$metadata.altitude.value',
              'speed': '$metadata.speed.value',
              'timestamp': 1
            }
          }
        ]);

        trips.push({
          start: startTime.timestamp,
          end: endTime.timestamp,
          startPos: {
            lat: startTime.latitude,
            long: startTime.longitude
          },
          endPos: {
            lat: endTime.latitude,
            long: endTime.longitude
          },
          positions
        });
        await getTripStartAndEndTimes(endTime.timestamp);
      }
    }
    await getTripStartAndEndTimes();
    return res.status(200).json({ trips, totalTrips: trips.length });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/", (req, res) => {
  return res.status(200).json({ message: "Ok" });
});

module.exports = app;

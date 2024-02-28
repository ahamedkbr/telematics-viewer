import { Typography, Paper, CircularProgress, Button } from "@mui/material";
import { TableContainer, Table, TableHead, TableRow, TableCell, TableBody } from "@mui/material";
import { useEffect, useState } from "react";
import axios from "axios";

let imei = 866344057563434;

function Dashboard() {
  const [loading, setLoading] = useState(false);
  const [trips, setTrips] = useState([]);
  const [iodata, setIodata] = useState([]);
  const [page, setPage] = useState(1);

  const formatOpts = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
  };



  async function getData() {
    let res = await axios.get(`http://localhost:3030/device-detail/trips/${imei}`);
    console.log(res.data);
    setTrips(res.data.trips);
    setLoading(false);
  }

  async function getIoData() {
    let result = await axios.get(`http://localhost:3030/device-detail/${imei}?pageNumber=${page}`);
    // console.log("iodata",result)
    setIodata(result.data.data);
    setLoading(false);
  }

  useEffect(() => {
    setLoading(true);
    getData();
    getIoData();
  }, [page]);

  console.log("iodata", iodata);
  return (
    <>
      <Typography variant="h2">Telematics data</Typography>
      {
        loading ? <CircularProgress /> : <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }}>
            <TableHead>
              <TableRow>
                <TableCell>S.no</TableCell>
                <TableCell>Start Time</TableCell>
                <TableCell>End Time</TableCell>
                <TableCell>Start(Lat,Long)</TableCell>
                <TableCell>End(Lat,Long)</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {trips.map((trip, index) => (
                <TableRow
                  key={index}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell component="th" scope="row">{index + 1}</TableCell>
                  <TableCell>{new Intl.DateTimeFormat('en-IN', formatOpts).format(new Date(trip.start))}</TableCell>
                  <TableCell>{new Intl.DateTimeFormat('en-IN', formatOpts).format(new Date(trip.end))}</TableCell>
                  <TableCell>{trip.startPos.lat}, {trip.startPos.long}</TableCell>
                  <TableCell>{trip.endPos.lat}, {trip.endPos.long}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      }
      <Typography variant="h2">Io Data</Typography>
      {
        loading ? <CircularProgress /> : <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }}>
            <TableHead>
              <TableRow>
                <TableCell>S.no</TableCell>
                <TableCell>TOTAL_ODOMETER</TableCell>
                <TableCell>SPEED</TableCell>
                <TableCell>IGNITION</TableCell>

                <TableCell>MOVEMENT</TableCell>
                <TableCell>DRIVING_TYPE</TableCell>
                <TableCell>ENGINE_LOAD</TableCell>
                <TableCell>COOLANT_TEMPERATURE</TableCell>
                <TableCell>ENGINE_RPM_OBD</TableCell>


                <TableCell>FUEL_LEVEL_PERCENT</TableCell>
                <TableCell>EXTERNAL_VOLTAGE</TableCell>
                <TableCell>VEHICLE_SPEED</TableCell>
                <TableCell>FUEL_LEVEL_LITRES</TableCell>
                <TableCell>ENGINE_RPM_CAN</TableCell>

                <TableCell>TOTAL_MILEAGE</TableCell>
                <TableCell>TOTAL_MILEAGE_CAN_COUNTED</TableCell>
                <TableCell>FUEL_CONSUMED_COUNTED</TableCell>

                <TableCell>FUEL_RATE</TableCell>
                <TableCell>ENGINE_TEMPERATURE</TableCell>
                <TableCell>TRIP_DISTANCE</TableCell>
                <TableCell>TRIP_ODOMETER</TableCell>
                <TableCell>IGNITION</TableCell>

                <TableCell>MOVEMENT</TableCell>
                <TableCell>DRIVING_TYPE</TableCell>



              </TableRow>
            </TableHead>
            <TableBody>
              {iodata.length > 0 && iodata.map((ele, index) => (
                <TableRow
                  key={index}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >

                  <TableCell component="th" scope="row">{index + 1}</TableCell>
                  <TableCell component="th" scope="row">{ele.ioFormatted.TOTAL_ODOMETER ? ele.ioFormatted.TOTAL_ODOMETER : "NA"}</TableCell>
                  <TableCell>{ele.speed ? ele.speed : "NA"}</TableCell>
                  <TableCell>{ele.ioFormatted.IGNITION ? ele.ioFormatted.IGNITION : "NA"}</TableCell>
                  <TableCell>{ele.ioFormatted.MOVEMENT ? ele.ioFormatted.MOVEMENT : "NA"}</TableCell>
                  <TableCell>{ele.ioFormatted.DRIVING_TYPE ? ele.ioFormatted.DRIVING_TYPE : "NA"}</TableCell>
                  <TableCell>{ele.ioFormatted[31] ? ele.ioFormatted[31] : "NA"}</TableCell>
                  <TableCell>{ele.ioFormatted[32] ? ele.ioFormatted[32] : "NA"}</TableCell>
                  <TableCell>{ele.ioFormatted[36] ? ele.ioFormatted[36] : "NA"}</TableCell>

                  <TableCell component="th" scope="row">{ele.ioFormatted[48] ? ele.ioFormatted[48] : "NA"}</TableCell>
                  <TableCell>{ele.ioFormatted.EXTERNAL_VOLTAGE ? ele.ioFormatted.EXTERNAL_VOLTAGE : "NA"}</TableCell>
                  <TableCell>{ele.ioFormatted.VEHICLE_SPEED ? ele.ioFormatted.VEHICLE_SPEED : "NA"}</TableCell>
                  <TableCell>{ele.ioFormatted.FUEL_LEVEL_LITRES ? ele.ioFormatted.FUEL_LEVEL_LITRES : "NA"}</TableCell>
                  <TableCell>{ele.ioFormatted.ENGINE_RPM_CAN ? ele.ioFormatted.ENGINE_RPM_CAN : "NA"}</TableCell>

                  <TableCell component="th" scope="row">{ele.ioFormatted[87] ? ele.ioFormatted[87] : "NA"}</TableCell>
                  <TableCell>{ele.ioFormatted[105] ? ele.ioFormatted[105] : "NA"}</TableCell>
                  <TableCell>{ele.ioFormatted[107] ? ele.ioFormatted[107] : "NA"}</TableCell>
                  <TableCell>{ele.ioFormatted[110] ? ele.ioFormatted[110] : "NA"}</TableCell>
                  <TableCell>{ele.ioFormatted[115] ? ele.ioFormatted[115] : "NA"}</TableCell>
                  <TableCell>{ele.ioFormatted[134] ? ele.ioFormatted[134] : "NA"}</TableCell>

                  <TableCell component="th" scope="row">{ele.ioFormatted[199] ? ele.ioFormatted[199] : "NA"}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      }
      <Button variant="outlined" disabled={page == 1} onClick={() => setPage(page - 1)} >PREV</Button>
      <Button variant="contained" >{page}</Button>
      <Button variant="outlined" onClick={() => setPage(page + 1)} >NEXT</Button>
    </>
  );
}

export default Dashboard;

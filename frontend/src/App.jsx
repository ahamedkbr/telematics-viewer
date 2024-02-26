import { Typography, Paper, CircularProgress } from "@mui/material";
import { TableContainer, Table, TableHead, TableRow, TableCell, TableBody } from "@mui/material";
import { useEffect, useState } from "react";
import axios from "axios";

function App() {
  const [loading, setLoading] = useState(false);
  const [trips, setTrips] = useState([]);

  const formatOpts = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
  };

  useEffect(() => {
    async function getData() {
      let res = await axios.get("http://localhost:3030/device-detail/trips/866344057563434");
      console.log(res.data);
      setTrips(res.data.trips);
      setLoading(false);
    }
    setLoading(true);
    getData();
  }, []);
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
    </>
  );
}

export default App;

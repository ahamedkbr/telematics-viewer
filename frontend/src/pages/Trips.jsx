import { Typography, Paper, CircularProgress, Button } from "@mui/material";
import { TableContainer, Table, TableHead, TableRow, TableCell, TableBody } from "@mui/material";
import { useEffect, useState } from "react";
import axios from "axios";
import TripView from "../components/TripView";

let imei = 866344057563434;

function Trips() {
  const [loading, setLoading] = useState(false);
  const [trips, setTrips] = useState([]);
  const [tripView, setTripView] = useState(null);

  const formatOpts = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
  };

  const handleTripView = (tripIndex) => {
    setTripView(trips[tripIndex]);
  };


  async function getData() {
    let res = await axios.get(`http://localhost:3030/device-detail/trips/${imei}`);
    setTrips(res.data.trips);
    setLoading(false);
  }

  useEffect(() => {
    setLoading(true);
    getData();
  }, []);

  return (
    <>
      {
        tripView ? <TripView tripStartPos={tripView.startPos} tripEndPos={tripView.endPos} positions={tripView.positions} /> : null
      }
      <Typography variant="h3" textAlign="center">Trips Details</Typography>
      {
        loading ? <CircularProgress /> : <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>S.no</TableCell>
                <TableCell>Start Time</TableCell>
                <TableCell>End Time</TableCell>
                <TableCell>Start(Lat,Long)</TableCell>
                <TableCell>End(Lat,Long)</TableCell>
                <TableCell>Action</TableCell>
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
                  <TableCell><Button onClick={() => handleTripView(index)}>View</Button></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      }
    </>
  );
}

export default Trips;

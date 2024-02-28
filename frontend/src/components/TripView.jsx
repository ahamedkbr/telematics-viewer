/* eslint-disable react/prop-types */
import { Container, Typography } from "@mui/material";
import { GoogleMap, useJsApiLoader, MarkerF, PolylineF } from "@react-google-maps/api";
import { useState, useEffect, useCallback } from "react";

const TripView = ({ tripStartPos, tripEndPos, positions }) => {

  const [map, setMap] = useState(null);
  const [path, setPath] = useState([]);

  const onLoad = useCallback((map) => setMap(map), []);
  useEffect(() => {
    if (map) {
      const bounds = new window.google.maps.LatLngBounds();
      console.log(positions);
      positions.map((p) => {
        setPath((prev) => ([...prev, { lat: p.latitude, lng: p.longitude }]));
        bounds.extend({ lat: p.latitude, lng: p.longitude });
      });
      map.fitBounds(bounds);
    }
  }, [map, tripStartPos, tripEndPos, positions]);

  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: "API_KEY_GOES_HERE"
  });

  return (
    <Container sx={{ mx: "auto" }}>
      <Typography variant="h5">Trip View</Typography>
      {!isLoaded ? (
        <h1>Loading...</h1>
      ) : (
        <GoogleMap
          mapContainerClassName="map-container"

          onLoad={onLoad}
        >
          <MarkerF position={{ lat: tripStartPos.lat, lng: tripStartPos.long }} />
          <MarkerF position={{ lat: tripEndPos.lat, lng: tripEndPos.long }} />
          <PolylineF
            path={path}
            options={{
              geodesic: true,
              strokeColor: "#0094D7",
              strokeOpacity: 0.75
            }
            }
          />
        </GoogleMap>
      )}
    </Container>
  );
};

export default TripView;
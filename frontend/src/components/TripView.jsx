/* eslint-disable react/prop-types */
import { Container, Typography } from "@mui/material";
import { GoogleMap, useJsApiLoader, MarkerF, PolylineF } from "@react-google-maps/api";
import { useState, useEffect, useCallback } from "react";

const TripView = ({ tripStartPos, tripEndPos, positions }) => {

  const [map, setMap] = useState(null);
  const [path, setPath] = useState([]);
  const [position, setPosition] = useState({ lat: tripStartPos.lat, lng: tripEndPos.long });

  let index = 0;

  const onLoad = useCallback((map) => setMap(map), []);

  useEffect(() => {
    if (map) {
      const bounds = new window.google.maps.LatLngBounds();
      positions.map((p) => {
        setPath((prev) => ([...prev, { lat: p.latitude, lng: p.longitude }]));
        bounds.extend({ lat: p.latitude, lng: p.longitude });
      });
      map.fitBounds(bounds);
      const intervalId = setInterval(() => {
        const newLat = positions[index].latitude;
        const newLng = positions[index].longitude;

        setPosition({ lat: newLat, lng: newLng });

        if (newLat === tripEndPos.lat && newLng === tripEndPos.long) {
          clearInterval(intervalId);
        }
        index++;
      }, 750);

      return () => { clearInterval(intervalId); setPath([]); }; // Cleanup on component unmount
    }
  }, [map, tripStartPos, tripEndPos, positions]);

  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: import.meta.env.VITE_GM_API_KEY
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
          mapTypeId={window.google.maps.MapTypeId.ROADMAP}
        >
          <MarkerF position={{ lat: tripStartPos.lat, lng: tripStartPos.long }} icon={{ url: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png" }} />
          <MarkerF position={{ lat: tripEndPos.lat, lng: tripEndPos.long }} icon={{ url: "http://maps.google.com/mapfiles/ms/icons/red-dot.png" }} />
          <MarkerF position={position} />
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
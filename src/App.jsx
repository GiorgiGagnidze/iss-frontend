import "leaflet/dist/leaflet.css";

import { MapContainer, Marker, TileLayer } from "react-leaflet";

import { MapLayout, Row } from "./style";
import { useCallback, useEffect, useState } from "react";
import { fetchLocation } from "./api/location";
import useInterval from "./hooks/useInterval";

const ZOOM = 3;

const App = () => {
  const [currentLocation, setCurrentLocation] = useState({
    latitude: 0,
    longitude: 0,
    timestamp: null,
  });
  const [map, setMap] = useState();

  const { latitude, longitude, timestamp } = currentLocation;

  const fetchData = useCallback(async () => {
    const data = await fetchLocation();
    if (data) {
      console.log(data);
      const {
        iss_position: { latitude, longitude },
        timestamp,
      } = data;
      setCurrentLocation({
        latitude,
        longitude,
        timestamp,
      });
      if (map) map.setView([latitude, longitude], ZOOM);
    }
  }, [map]);

  useInterval(fetchData, 20000, true);

  useEffect(() => {
    if (map) map.setView([latitude, longitude], ZOOM);
  }, [map, latitude, longitude]);

  return (
    <MapLayout>
      <MapContainer center={[51.505, -0.09]} zoom={3} scrollWheelZoom={false} ref={setMap}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
        />
        <Marker position={[latitude, longitude]}></Marker>
      </MapContainer>
      <Row>
        <button onClick={fetchData}>Refresh</button>
        {timestamp && <div>{new Date(timestamp * 1000).toLocaleTimeString()}</div>}
      </Row>
    </MapLayout>
  );
};

export default App;

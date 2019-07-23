import React from "react";
import { Marker, Circle as MapCircle } from "react-leaflet";
import L, { LatLngTuple } from "leaflet";
import { Circle, Polygon } from "./LocationPicker";

export interface IOverlaysProps {
  points: LatLngTuple[];
  circles: Circle[];
  polygons: Polygon[];
}
const icon = L.divIcon({ html: "<div>V</div>" });

const Overlays: React.FC<IOverlaysProps> = props => {
  const mapObjects: JSX.Element[] = [];
  props.points.forEach((point, i) =>
    mapObjects.push(<Marker position={point} key={"m" + i} icon={icon} />)
  );
  props.circles.forEach((circle, i) =>
    mapObjects.push(<MapCircle {...circle} key={"p" + i} />)
  );
  return <React.Fragment>{mapObjects}</React.Fragment>;
};

export default Overlays;

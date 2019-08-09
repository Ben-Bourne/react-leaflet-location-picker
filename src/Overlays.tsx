import React from "react";
import {
  Marker,
  Circle as MapCircle,
  Rectangle as MapRectangle,
  Polygon as MapPolygon
} from "react-leaflet";
import L, { LatLngTuple } from "leaflet";
import { Circle, Rectangle, Polygon } from "./LocationPicker";
import { markerIcon } from "./icons";

export interface IOverlaysProps {
  points: LatLngTuple[];
  circles: Circle[];
  rectangles: Rectangle[];
  polygons: Polygon[];
}

const icon = L.icon({ iconUrl: markerIcon, iconAnchor: [16, 30] });

const Overlays: React.FC<IOverlaysProps> = props => {
  const mapObjects: JSX.Element[] = [];
  props.points.forEach((point, i) =>
    mapObjects.push(<Marker position={point} key={"m" + i} icon={icon} />)
  );
  props.circles.forEach((circle, i) =>
    mapObjects.push(<MapCircle {...circle} key={"c" + i} />)
  );
  props.rectangles.forEach((rectangle, i) =>
    mapObjects.push(<MapRectangle bounds={rectangle} key={"r" + i} />)
  );
  props.polygons.forEach((polygon, i) =>
    mapObjects.push(<MapPolygon positions={polygon} key={"p" + i} />)
  );
  return <React.Fragment>{mapObjects}</React.Fragment>;
};

export default Overlays;

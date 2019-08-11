import React from "react";
import {
  Marker as MapMarker,
  Circle as MapCircle,
  Rectangle as MapRectangle,
  Polygon as MapPolygon,
  Polyline as MapPolyLine
} from "react-leaflet";
import L, { LatLngTuple } from "leaflet";
import { Circle, Rectangle, PointSeries } from "./LocationPicker";
import { markerIcon } from "./icons";

export interface IOverlaysProps {
  points: LatLngTuple[];
  circles: Circle[];
  rectangles: Rectangle[];
  polygons: PointSeries[];
  polylines: PointSeries[];
}

const icon = L.icon({ iconUrl: markerIcon, iconAnchor: [16, 30] });

const Overlays: React.FC<IOverlaysProps> = props => {
  const mapObjects: JSX.Element[] = [];
  props.points.forEach((point, i) =>
    mapObjects.push(<MapMarker position={point} key={"m" + i} icon={icon} />)
  );
  props.circles.forEach((circle, i) =>
    mapObjects.push(<MapCircle {...circle} key={"c" + i} />)
  );
  props.rectangles.forEach((rectangle, i) =>
    mapObjects.push(<MapRectangle bounds={rectangle} key={"r" + i} />)
  );
  props.polylines.forEach((polyline, i) =>
    mapObjects.push(<MapPolyLine positions={polyline} key={"l" + i} />)
  );
  props.polygons.forEach((polygon, i) =>
    mapObjects.push(<MapPolygon positions={polygon} key={"p" + i} />)
  );
  return <>{mapObjects}</>;
};

export default Overlays;

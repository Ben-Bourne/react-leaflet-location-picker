import React from "react";
import { LatLngTuple, circle } from "leaflet";
import { Circle, Polygon } from "./LocationPicker";
import { stringifyPoint, stringifyCircle } from "./utils";

export interface IBannerProps {
  precision: number;
  points?: LatLngTuple[];
  pointRemoval?: (point: LatLngTuple) => void;
  circles?: Circle[];
  circleRemoval?: (circle: Circle) => void;
  polygons?: Polygon[];
  polygonRemoval?: (polygon: Polygon) => void;
}

const Banner: React.FC<IBannerProps> = props => {
  const renderPointsBanner = () => {
    if (!props.points) return null;
    return props.points.map(point => {
      const stringPoint = stringifyPoint(point, props.precision);
      return <h4 key={stringPoint}>{stringPoint}</h4>;
    });
  };
  const renderCirclesBanner = () => {
    if (!props.circles) return null;
    return props.circles.map(circle => {
      const stringCircle = stringifyCircle(circle, props.precision);
      return <h4 key={stringCircle}>{stringCircle}</h4>;
    });
  };
  return (
    <>
      {renderPointsBanner()}
      {renderCirclesBanner()}
    </>
  );
};

export default Banner;

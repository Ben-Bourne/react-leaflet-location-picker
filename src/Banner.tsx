import React from "react";
import { LatLngTuple } from "leaflet";
import { Circle, Polygon } from "./LocationPicker";
import { stringifyPoint } from "./utils";

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
  const renderPointBanner = () => {
    if (props.points) {
      return props.points.map(point => {
        const stringPoint = stringifyPoint(point, props.precision);
        return <h4 key={stringPoint}>{stringPoint}</h4>;
      });
    }
  };
  return <>{renderPointBanner()}</>;
};

export default Banner;

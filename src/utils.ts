import L, { LatLngTuple } from "leaflet";
import { Circle, PointSeries, Rectangle } from "./LocationPicker";

const EARTH_CIRCUMFERENCE = 40030000;

export const toRadians = (angle: number) => {
  return angle * (Math.PI / 180);
};

export const toDegrees = (angle: number) => {
  return angle * (180 / Math.PI);
};

export const setPrecision = (
  value: number | string,
  precision: number
): number => {
  return +Number(value).toPrecision(precision);
};

export const calculateRadius = (
  point1: LatLngTuple,
  point2: LatLngTuple
): number => {
  const leafletPoint = new L.LatLng(point1[0], point1[1]);
  return leafletPoint.distanceTo(point2);
};

export const calculateCircleBox = (circle: Circle): Rectangle => {
  const { center, radius } = circle;
  const degreeSep = (radius * 360) / EARTH_CIRCUMFERENCE;
  return [
    [center[0] + degreeSep, center[1] - degreeSep],
    [center[0] - degreeSep, center[1] + degreeSep]
  ];
};

export const stringifyPoint = (point: LatLngTuple): string => {
  return `(${point[0]},${point[1]})`;
};

export const stringifyCircle = (circle: Circle): string => {
  const point = stringifyPoint(circle.center);
  return `(${point} - ${Math.round(circle.radius)})`;
};

export const stringifyRectangle = (rectangle: Rectangle): string => {
  return `[${stringifyPoint(rectangle[0])},${stringifyPoint(rectangle[1])}]`;
};

export const stringifyPointSeries = (pointSeries: PointSeries): string => {
  let stringPointSeries = "[";
  pointSeries.forEach(point => (stringPointSeries += stringifyPoint(point)));
  stringPointSeries += "]";
  return stringPointSeries;
};

export const indexOfObject = (arr: any[], value: any): number => {
  const stringVal = JSON.stringify(value);
  let i = 0;
  for (const obj of arr) {
    if (stringVal === JSON.stringify(obj)) {
      return i;
    }
    i += 1;
  }
  return -1;
};

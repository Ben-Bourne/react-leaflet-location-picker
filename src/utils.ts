import L, { LatLngTuple, LatLngBounds } from "leaflet";
import { Circle, Polygon, Rectangle } from "./LocationPicker";

export const earthRadius = 6371000;

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
  const lat1Rad = toRadians(center[0]);
  const degreeSep =
    toDegrees(
      Math.asin(
        Math.sin(lat1Rad) * Math.cos(radius / earthRadius) +
          Math.cos(lat1Rad) * Math.sin(radius / earthRadius)
      )
    ) - center[0];
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

export const stringifyPolygon = (polygon: Polygon): string => {
  let stringPolygon = "[";
  polygon.forEach(point => (stringPolygon += stringifyPoint(point)));
  stringPolygon += "]";
  return stringPolygon;
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

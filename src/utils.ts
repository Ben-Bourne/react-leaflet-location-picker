import L, { LatLngTuple } from "leaflet";
import { Circle } from "./LocationPicker";

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

export const stringifyPoint = (
  point: LatLngTuple,
  precision: number
): string => {
  const lat = setPrecision(point[0], precision);
  const lng = setPrecision(point[1], precision);
  return `(${lat},${lng})`;
};

export const stringifyCircle = (circle: Circle, precision: number): string => {
  const point = stringifyPoint(circle.center, precision);
  return `(${point} - ${Math.round(circle.radius)})`;
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

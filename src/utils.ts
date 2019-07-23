import { LatLngTuple } from "leaflet";

export const setPrecision = (
  value: number | string,
  precision: number
): number => {
  return +Number(value).toPrecision(precision);
};

export const stringifyPoint = (
  point: LatLngTuple,
  precision: number
): string => {
  const lat = setPrecision(point[0], precision);
  const lng = setPrecision(point[1], precision);
  return `(${lat},${lng})`;
};

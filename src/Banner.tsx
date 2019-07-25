import React from "react";
import { LatLngTuple } from "leaflet";
import { Circle, Polygon } from "./LocationPicker";
import Tag from "./Tag";
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
    const { points, pointRemoval, precision } = props;
    if (!points) return null;
    let pointTags: JSX.Element[] = [];
    if (pointRemoval) {
      const onRemove = (removePoint: LatLngTuple) => () => {
        pointRemoval(removePoint);
      };
      pointTags = points.map((point, i) => {
        const stringPoint = stringifyPoint(point, precision);
        return (
          <Tag
            content={stringPoint}
            onRemove={onRemove(point)}
            key={stringPoint + i}
          />
        );
      });
    } else {
      pointTags = points.map((point, i) => {
        const stringPoint = stringifyPoint(point, precision);
        return <Tag content={stringPoint} key={stringPoint + i} />;
      });
    }
    return (
      <>
        <h3 style={{ display: "inline" }}>Points: </h3>
        {pointTags}
      </>
    );
  };
  const renderCirclesBanner = () => {
    const { circles, circleRemoval, precision } = props;
    if (!circles) return null;
    let circleTags: JSX.Element[] = [];
    if (circleRemoval) {
      const onRemove = (removeCircle: Circle) => () => {
        circleRemoval(removeCircle);
      };
      circleTags = circles.map((circle, i) => {
        const stringCircle = stringifyCircle(circle, precision);
        return (
          <Tag
            content={stringCircle}
            onRemove={onRemove(circle)}
            key={stringCircle + i}
          />
        );
      });
    } else {
      circleTags = circles.map((circle, i) => {
        const stringCircle = stringifyCircle(circle, precision);
        return <Tag content={stringCircle} key={stringCircle + i} />;
      });
    }
    return (
      <>
        <h3 style={{ display: "inline" }}>Circles: </h3>
        {circleTags}
      </>
    );
  };
  return (
    <>
      {renderPointsBanner()}
      <br />
      {renderCirclesBanner()}
    </>
  );
};

export default Banner;

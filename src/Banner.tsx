import React from "react";
import { LatLngTuple } from "leaflet";
import { Circle, Polygon } from "./LocationPicker";
import Tag from "./Tag";
import { stringifyPoint, stringifyCircle, stringifyPolygon } from "./utils";

export interface IBannerProps {
  points?: LatLngTuple[];
  pointRemoval?: (point: LatLngTuple) => void;
  circles?: Circle[];
  circleRemoval?: (circle: Circle) => void;
  polygons?: Polygon[];
  polygonRemoval?: (polygon: Polygon) => void;
}

const Banner: React.FC<IBannerProps> = props => {
  const renderPointsBanner = () => {
    const { points, pointRemoval } = props;
    if (!points) return null;
    let pointTags: JSX.Element[] = [];
    if (pointRemoval) {
      const onRemove = (removePoint: LatLngTuple) => () => {
        pointRemoval(removePoint);
      };
      pointTags = points.map((point, i) => {
        const stringPoint = stringifyPoint(point);
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
        const stringPoint = stringifyPoint(point);
        return <Tag content={stringPoint} key={stringPoint + i} />;
      });
    }
    return (
      <div className="flex-container flex-wrap some-margin">
        <h3 className="text no-margin">Points: </h3>
        {pointTags}
      </div>
    );
  };
  const renderCirclesBanner = () => {
    const { circles, circleRemoval } = props;
    if (!circles) return null;
    let circleTags: JSX.Element[] = [];
    if (circleRemoval) {
      const onRemove = (removeCircle: Circle) => () => {
        circleRemoval(removeCircle);
      };
      circleTags = circles.map((circle, i) => {
        const stringCircle = stringifyCircle(circle);
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
        const stringCircle = stringifyCircle(circle);
        return <Tag content={stringCircle} key={stringCircle + i} />;
      });
    }
    return (
      <div className="flex-container flex-wrap some-margin">
        <h3 className="text no-margin">Circles: </h3>
        {circleTags}
      </div>
    );
  };
  const renderPolygonsBanner = () => {
    const { polygons, polygonRemoval } = props;
    if (!polygons) return null;
    let polygonTags: JSX.Element[] = [];
    if (polygonRemoval) {
      const onRemove = (removePolygon: Polygon) => () => {
        polygonRemoval(removePolygon);
      };
      polygonTags = polygons.map((polygon, i) => {
        const stringPolygon = stringifyPolygon(polygon);
        return (
          <Tag
            content={stringPolygon}
            onRemove={onRemove(polygon)}
            key={stringPolygon + i}
          />
        );
      });
    } else {
      polygonTags = polygons.map((polygon, i) => {
        const stringPolygon = stringifyPolygon(polygon);
        return <Tag content={stringPolygon} key={stringPolygon + i} />;
      });
    }
    return (
      <div className="flex-container flex-wrap some-margin">
        <h3 className="text no-margin">Polygons: </h3>
        {polygonTags}
      </div>
    );
  };
  return (
    <>
      {renderPointsBanner()}
      {renderCirclesBanner()}
      {renderPolygonsBanner()}
    </>
  );
};

export default Banner;

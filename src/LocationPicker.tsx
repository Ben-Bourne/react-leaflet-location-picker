import React, { Component } from "react";
import { Map, TileLayer } from "react-leaflet";
import { LatLngTuple, LatLngBounds, LeafletMouseEvent } from "leaflet";
import Control from "react-leaflet-control";
import Banner, { IBannerProps } from "./Banner";
import Overlays, { IOverlaysProps } from "./Overlays";
import {
  calculateRadius,
  calculateCircleBox,
  indexOfObject,
  setPrecision
} from "./utils";
import "leaflet/dist/leaflet.css";

export type Circle = { center: LatLngTuple; radius: number };
export type Rectangle = [LatLngTuple, LatLngTuple];
export type Polygon = LatLngTuple[];
export type PickerMode = "points" | "circles" | "rectangles" | "polygons";
export type IViewport = { center: [number, number]; zoom: number };

export type ILocationPickerProps = Readonly<typeof defaultProps>;
const defaultProps = {
  tileLayer: {
    url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    attribution:
      '&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
  },
  mapStyle: { height: 300, width: "auto" } as React.CSSProperties,
  bindMap: true,
  startPort: "default" as "auto" | "default" | IViewport,
  overlayAll: true,
  showControls: true,
  showInputs: true,
  useDynamic: true,
  precision: 6,
  pointMode: undefined as PointMode | undefined,
  circleMode: undefined as CircleMode | undefined,
  rectangleMode: undefined as RectangleMode | undefined,
  polygonMode: undefined as PolygonMode | undefined
};

export type PointMode = {
  control?: {
    values: LatLngTuple[];
    onClick?: (point: LatLngTuple) => void;
    onRemove?: (point: LatLngTuple) => void;
  };
  banner: boolean;
};

export type CircleMode = {
  control?: {
    values: Circle[];
    onClick?: (point: LatLngTuple) => void;
    onRemove?: (circle: Circle) => void;
  };
  banner: boolean;
};

export type RectangleMode = {
  control?: {
    values: Rectangle[];
    onClick?: (point: LatLngTuple) => void;
    onRemove?: (rectangle: Rectangle) => void;
  };
  banner: boolean;
};

export type PolygonMode = {
  control?: {
    values: Polygon[];
    onClick?: (point: LatLngTuple) => void;
    onAdd?: () => void;
    onRemove?: (polygon: Polygon) => void;
  };
  banner: boolean;
};

type ILocationPickerState = Readonly<typeof defaultState>;
const defaultState = {
  throttleTimer: new Date().getTime(),
  lat: 0,
  lng: 0,
  hoverPosition: [0, 0] as LatLngTuple,
  pickerMode: "points" as PickerMode,
  points: [] as LatLngTuple[],
  circles: [] as Circle[],
  circleCenter: null as LatLngTuple | null,
  rectangles: [] as Rectangle[],
  rectangleCorner: null as LatLngTuple | null,
  polygons: [] as Polygon[],
  partialPolygon: [] as Polygon
};

const mapBounds: [LatLngTuple, LatLngTuple] = [[-90, -180], [90, 180]];
const defaultViewport: IViewport = {
  center: [30, 0],
  zoom: 2
};

export default class LocationPicker extends Component<
  ILocationPickerProps,
  ILocationPickerState
> {
  constructor(props: ILocationPickerProps) {
    super(props);
    this.state = defaultState;
  }
  static defaultProps = defaultProps;

  render() {
    const { bindMap, mapStyle, useDynamic, tileLayer } = this.props;
    return (
      <>
        {this.renderBanner()}
        <Map
          style={mapStyle}
          className="leaflet-crosshair"
          viewport={defaultViewport}
          maxBounds={bindMap ? mapBounds : undefined}
          maxBoundsViscosity={1}
          onClick={this.handleClick}
          onMouseMove={useDynamic ? this.handleMouseMove : undefined}
          minZoom={2}
          ref="map"
        >
          <TileLayer {...tileLayer} />
          {this.renderModeControl()}
          {this.renderOverlays()}
        </Map>
        {this.renderInputs()}
      </>
    );
  }
  public componentDidMount = () => {
    // @ts-ignore
    const map: Map = this.refs.map;
    const {
      startPort,
      pointMode,
      circleMode,
      rectangleMode,
      polygonMode
    } = this.props;
    if (startPort === "auto") {
      let points: LatLngTuple[] = [];
      if (pointMode && pointMode.control)
        points = Array.from(pointMode.control.values);
      if (circleMode && circleMode.control)
        circleMode.control.values.forEach(circ =>
          calculateCircleBox(circ).forEach(point => points.push(point))
        );
      if (rectangleMode && rectangleMode.control)
        rectangleMode.control.values.forEach(rect =>
          rect.forEach(point => points.push(point))
        );
      if (polygonMode && polygonMode.control)
        polygonMode.control.values.forEach(poly =>
          poly.forEach(point => points.push(point))
        );
      if (points.length > 0) {
        const bounds = new LatLngBounds(points);
        const zoom = map.leafletElement.getBoundsZoom(bounds);
        map.leafletElement.setView(bounds.getCenter(), zoom);
      }
    } else if (startPort !== "default") {
      map.leafletElement.setView(startPort.center, startPort.zoom);
    }
  };
  private renderBanner = () => {
    const { pointMode, circleMode, rectangleMode, polygonMode } = this.props;
    const bannerProps: IBannerProps = {};
    if (pointMode && pointMode.banner) {
      if (pointMode.control) {
        bannerProps.points = pointMode.control.values;
        bannerProps.pointRemoval = pointMode.control.onRemove;
      } else {
        bannerProps.points = this.state.points;
        bannerProps.pointRemoval = this.removeObject("points");
      }
    }
    if (circleMode && circleMode.banner) {
      if (circleMode.control) {
        bannerProps.circles = circleMode.control.values;
        bannerProps.circleRemoval = circleMode.control.onRemove;
      } else {
        bannerProps.circles = this.state.circles;
        bannerProps.circleRemoval = this.removeObject("circles");
      }
    }
    if (rectangleMode && rectangleMode.banner) {
      if (rectangleMode.control) {
        bannerProps.rectangles = rectangleMode.control.values;
        bannerProps.rectangleRemoval = rectangleMode.control.onRemove;
      } else {
        bannerProps.rectangles = this.state.rectangles;
        bannerProps.rectangleRemoval = this.removeObject("rectangles");
      }
    }
    if (polygonMode && polygonMode.banner) {
      if (polygonMode.control) {
        bannerProps.polygons = polygonMode.control.values;
        bannerProps.polygonRemoval = polygonMode.control.onRemove;
      } else {
        bannerProps.polygons = this.state.polygons;
        bannerProps.polygonRemoval = this.removeObject("polygons");
      }
    }
    return <Banner {...bannerProps} />;
  };
  private renderModeControl = () => {
    const {
      pointMode,
      circleMode,
      rectangleMode,
      polygonMode,
      showControls
    } = this.props;
    if (!showControls) return null;
    const buttons: JSX.Element[] = [];
    if (pointMode) {
      buttons.push(
        <button key={"point"} onClick={this.changeMode("points")}>
          Point
        </button>
      );
    }
    if (circleMode) {
      buttons.push(
        <button key={"circle"} onClick={this.changeMode("circles")}>
          Circle
        </button>
      );
    }
    if (rectangleMode) {
      buttons.push(
        <button key={"rectangle"} onClick={this.changeMode("rectangles")}>
          Rectangle
        </button>
      );
    }
    if (polygonMode) {
      buttons.push(
        <button key={"polygon"} onClick={this.changeMode("polygons")}>
          Polygon
        </button>
      );
      if (this.state.partialPolygon.length > 0) {
        if (polygonMode.control) {
          if (polygonMode.control.onAdd) {
            buttons.push(
              <button key="polygonAdd" onClick={polygonMode.control.onAdd}>
                Add
              </button>
            );
          }
        } else {
          buttons.push(
            <button key="polygonAdd" onClick={this.addPolygon}>
              Add
            </button>
          );
        }
      }
    }
    return <Control position="topright">{buttons}</Control>;
  };
  private renderOverlays = () => {
    const opts: IOverlaysProps = {
      points: this.calculatePoints(),
      circles: this.calculateCircles(),
      rectangles: this.calculateRectangles(),
      polygons: this.calculatePolygons()
    };
    return <Overlays {...opts} />;
  };
  private calculatePoints = (): LatLngTuple[] => {
    const { pointMode, overlayAll } = this.props;
    const { pickerMode, points } = this.state;
    if (pointMode && (overlayAll || pickerMode === "points")) {
      return pointMode.control ? pointMode.control.values : points;
    }
    return [];
  };
  private calculateCircles = (): Circle[] => {
    const { circleMode, overlayAll, useDynamic } = this.props;
    const { pickerMode, circles, circleCenter, hoverPosition } = this.state;
    if (circleMode && (overlayAll || pickerMode === "circles")) {
      if (circleMode.control) return circleMode.control.values;
      const movingCircle: Circle | null =
        useDynamic && circleCenter
          ? {
              center: circleCenter,
              radius: calculateRadius(circleCenter, hoverPosition)
            }
          : null;
      return movingCircle ? circles.concat([movingCircle]) : circles;
    }
    return [];
  };
  private calculateRectangles = (): Rectangle[] => {
    const { rectangleMode, overlayAll, useDynamic } = this.props;
    const {
      pickerMode,
      rectangles,
      rectangleCorner,
      hoverPosition
    } = this.state;
    if (rectangleMode && (overlayAll || pickerMode === "rectangles")) {
      if (rectangleMode.control) return rectangleMode.control.values;
      const movingRectangle: Rectangle | null =
        useDynamic && rectangleCorner ? [rectangleCorner, hoverPosition] : null;
      return movingRectangle
        ? rectangles.concat([movingRectangle])
        : rectangles;
    }
    return [];
  };
  private calculatePolygons = (): Polygon[] => {
    const { polygonMode, overlayAll, useDynamic } = this.props;
    const { pickerMode, polygons, partialPolygon, hoverPosition } = this.state;
    if (polygonMode && (overlayAll || pickerMode === "polygons")) {
      if (polygonMode.control) return polygonMode.control.values;
      return useDynamic
        ? polygons.concat([partialPolygon.concat([hoverPosition])])
        : polygons.concat([partialPolygon]);
    }
    return [];
  };
  private renderInputs = () => {
    if (!this.props.showInputs) return null;
    return (
      <div className="flex-container some-margin">
        <div className="full-width">
          <label className="text pad-right">Latitude:</label>
          <input
            type="number"
            value={this.state.lat}
            onChange={this.inputChange("lat")}
            className="large-width input-field"
          />
        </div>
        <div className="full-width some-margin">
          <label className="text pad-right">Longitude:</label>
          <input
            type="number"
            value={this.state.lng}
            onChange={this.inputChange("lng")}
            className="large-width input-field"
          />
        </div>
      </div>
    );
  };

  private handleClick = (e: LeafletMouseEvent) => {
    const {
      precision,
      pointMode,
      circleMode,
      rectangleMode,
      polygonMode
    } = this.props;
    const {
      pickerMode,
      points,
      circles,
      circleCenter,
      rectangles,
      rectangleCorner,
      partialPolygon
    } = this.state;
    const lat = setPrecision(e.latlng.lat, precision);
    const lng = setPrecision(e.latlng.lng, precision);
    this.setState({ lat, lng });
    switch (pickerMode) {
      case "points": {
        if (pointMode && pointMode.control && pointMode.control.onClick) {
          pointMode.control.onClick([lat, lng]);
        } else {
          this.setState({ points: points.concat([[lat, lng]]) });
        }
        break;
      }
      case "circles": {
        if (circleMode && circleMode.control && circleMode.control.onClick) {
          circleMode.control.onClick([lat, lng]);
        } else {
          if (circleCenter) {
            const circle: Circle = {
              center: circleCenter,
              radius: calculateRadius(circleCenter, [lat, lng])
            };
            this.setState({
              circleCenter: null,
              circles: circles.concat([circle])
            });
          } else {
            this.setState({ circleCenter: [lat, lng] });
          }
        }
        break;
      }
      case "rectangles": {
        if (
          rectangleMode &&
          rectangleMode.control &&
          rectangleMode.control.onClick
        ) {
          rectangleMode.control.onClick([lat, lng]);
        } else {
          if (rectangleCorner) {
            const rectangle: Rectangle = [rectangleCorner, [lat, lng]];
            this.setState({
              rectangleCorner: null,
              rectangles: rectangles.concat([rectangle])
            });
          } else {
            this.setState({ rectangleCorner: [lat, lng] });
          }
        }
        break;
      }
      case "polygons": {
        if (polygonMode && polygonMode.control && polygonMode.control.onClick) {
          polygonMode.control.onClick([lat, lng]);
        } else {
          this.setState({
            partialPolygon: partialPolygon.concat([[lat, lng]])
          });
        }
      }
    }
  };
  private handleMouseMove = (e: LeafletMouseEvent) => {
    const now = new Date().getTime();
    if (now - this.state.throttleTimer > 50) {
      const lat = setPrecision(e.latlng.lat, this.props.precision);
      const lng = setPrecision(e.latlng.lng, this.props.precision);
      this.setState({ hoverPosition: [lat, lng], throttleTimer: now });
    }
  };
  private inputChange = (field: string) => (e: React.ChangeEvent<any>) => {
    const newState = { [field]: Number(e.target.value) } as Pick<
      ILocationPickerState,
      "lat" | "lng"
    >;
    this.setState(newState);
  };
  private changeMode = (pickerMode: PickerMode) => () => {
    this.setState({
      pickerMode,
      circleCenter: null,
      partialPolygon: [],
      rectangleCorner: null
    });
  };
  private addPolygon = () => {
    this.setState({
      polygons: this.state.polygons.concat([this.state.partialPolygon]),
      partialPolygon: []
    });
  };

  private removeObject = (type: PickerMode) => (
    mapObject: LatLngTuple | Circle | Polygon | Rectangle
  ) => {
    const index = indexOfObject(this.state[type], mapObject);
    const newState = Object.assign(this.state[type], []);
    newState.splice(index, 1);
    // @ts-ignore
    this.setState({ [type]: newState });
  };
}

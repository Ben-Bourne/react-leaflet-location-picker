import React, { Component } from "react";
import { Map, TileLayer, Viewport } from "react-leaflet";
import { LatLngTuple, LeafletMouseEvent } from "leaflet";
import Control from "react-leaflet-control";
import Banner, { IBannerProps } from "./Banner";
import Overlays, { IOverlaysProps } from "./Overlays";
import { calculateRadius, indexOfObject, setPrecision } from "./utils";
import "leaflet/dist/leaflet.css";

export type Circle = { center: LatLngTuple; radius: number };
export type Polygon = LatLngTuple[];
export type PickerMode = "points" | "circles" | "polygons";

export type ILocationPickerProps = Readonly<typeof defaultProps>;
const defaultProps = {
  tileLayer: {
    url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    attribution:
      '&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
  },
  mapStyle: { height: 300, width: "auto" } as React.CSSProperties,
  bindMap: true,
  overlayAll: true,
  showInputs: true,
  precision: 6,
  pointMode: undefined as PointMode | undefined,
  circleMode: undefined as CircleMode | undefined
};

type PointMode = {
  control?: {
    values: LatLngTuple[];
    onClick?: (point: LatLngTuple) => void;
    onRemove?: (point: LatLngTuple) => void;
  };
  banner: boolean;
};

type CircleMode = {
  control?: {
    values: Circle[];
    onClick?: (point: LatLngTuple) => void;
    onRemove?: (circle: Circle) => void;
  };
  banner: boolean;
};

type ILocationPickerState = Readonly<typeof defaultState>;
const defaultState = {
  lat: 0,
  lng: 0,
  pickerMode: "points" as PickerMode,
  points: [] as LatLngTuple[],
  circles: [] as Circle[],
  circleCenter: null as LatLngTuple | null,
  polygons: [] as Polygon[]
};

const mapBounds: [LatLngTuple, LatLngTuple] = [[-90, -180], [90, 180]];
const defaultViewport: Viewport = {
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
    const { bindMap, mapStyle, tileLayer } = this.props;
    const bounds = bindMap ? mapBounds : undefined;
    return (
      <>
        {this.renderBanner()}
        <Map
          style={mapStyle}
          className="leaflet-crosshair"
          viewport={defaultViewport}
          maxBounds={bounds}
          maxBoundsViscosity={1}
          onClick={this.handleClick}
          minZoom={2}
        >
          <TileLayer {...tileLayer} />
          {this.renderModeControl()}
          {this.renderOverlays()}
        </Map>
        {this.renderInputs()}
      </>
    );
  }
  private renderBanner = () => {
    const { pointMode, circleMode } = this.props;
    const bannerProps: IBannerProps = { precision: this.props.precision };
    if (pointMode && pointMode.banner) {
      if (pointMode.control && pointMode.control.values) {
        bannerProps.points = pointMode.control.values;
        bannerProps.pointRemoval = pointMode.control.onRemove;
      } else {
        bannerProps.points = this.state.points;
        bannerProps.pointRemoval = this.removeObject("points");
      }
    }
    if (circleMode && circleMode.banner) {
      if (circleMode.control && circleMode.control.values) {
        bannerProps.circles = circleMode.control.values;
        bannerProps.circleRemoval = circleMode.control.onRemove;
      } else {
        bannerProps.circles = this.state.circles;
        bannerProps.circleRemoval = this.removeObject("circles");
      }
    }
    return <Banner {...bannerProps} />;
  };
  private renderModeControl = () => {
    const { pointMode, circleMode } = this.props;
    const buttons: JSX.Element[] = [];
    if (pointMode) {
      buttons.push(
        <button key={"point"} onClick={this.changeMode("points")}>
          point
        </button>
      );
    }
    if (circleMode) {
      buttons.push(
        <button key={"circle"} onClick={this.changeMode("circles")}>
          circle
        </button>
      );
    }
    return <Control position="topright">{buttons}</Control>;
  };
  private renderOverlays = () => {
    const { points, circles, polygons, pickerMode } = this.state;
    const { pointMode, circleMode } = this.props;
    if (this.props.overlayAll) {
      const opts: IOverlaysProps = { points, circles, polygons };
      if (pointMode && pointMode.control)
        opts.points = pointMode.control.values;
      if (circleMode && circleMode.control)
        opts.circles = circleMode.control.values;
      return <Overlays {...opts} />;
    } else {
      const opts: IOverlaysProps = { points: [], circles: [], polygons: [] };
      switch (pickerMode) {
        case "points": {
          opts.points =
            pointMode && pointMode.control ? pointMode.control.values : points;
          break;
        }
        case "circles": {
          opts.circles =
            circleMode && circleMode.control
              ? circleMode.control.values
              : circles;
          break;
        }
      }
      return <Overlays {...opts} />;
    }
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
    const { precision, pointMode, circleMode } = this.props;
    const { pickerMode, points, circles, circleCenter } = this.state;
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
    this.setState({ pickerMode, circleCenter: null });
  };

  private removeObject = (type: PickerMode) => (
    mapObject: LatLngTuple | Circle | Polygon
  ) => {
    const index = indexOfObject(this.state[type], mapObject);
    const newState = Object.assign(this.state[type], []);
    newState.splice(index, 1);
    // @ts-ignore
    this.setState({ [type]: newState });
  };
}

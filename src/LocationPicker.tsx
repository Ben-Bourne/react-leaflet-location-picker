import React, { Component } from "react";
import { Map, TileLayer, Viewport } from "react-leaflet";
import { LatLngTuple, LeafletMouseEvent } from "leaflet";
import Control from "react-leaflet-control";
import Banner, { IBannerProps } from "./Banner";
import Overlays, { IOverlaysProps } from "./Overlays";
import { calculateRadius, setPrecision } from "./utils";
import "leaflet/dist/leaflet.css";

export type Circle = { center: LatLngTuple; radius: number };
export type Polygon = LatLngTuple[];
type pickerMode = "points" | "circles" | "polygons";

type ILocationPickerProps = Readonly<typeof defaultProps>;
const defaultProps = {
  tileLayer: {
    url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    attribution:
      '&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
  },
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
    onClick: (point: LatLngTuple) => void;
  };
  banner: boolean;
};

type CircleMode = {
  control?: {
    values: Circle[];
    onClick: (point: LatLngTuple) => void;
  };
  banner: boolean;
};

type ILocationPickerState = Readonly<typeof defaultState>;
const defaultState = {
  lat: 0,
  lng: 0,
  pickerMode: "point" as pickerMode,
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
    const bounds = this.props.bindMap ? mapBounds : undefined;
    return (
      <div>
        {this.renderBanner()}
        <Map
          style={{ height: 400, width: 600 }}
          viewport={defaultViewport}
          maxBounds={bounds}
          maxBoundsViscosity={1}
          onClick={this.handleClick}
          minZoom={2}
        >
          <TileLayer {...this.props.tileLayer} />
          {this.renderControl()}
          {this.renderOverlays()}
        </Map>
        {this.renderInputs()}
      </div>
    );
  }
  private renderBanner = () => {
    const { pointMode, circleMode } = this.props;
    const bannerProps: IBannerProps = { precision: this.props.precision };
    if (pointMode && pointMode.banner) {
      if (pointMode.control) {
        bannerProps.points = pointMode.control.values;
      } else {
        bannerProps.points = this.state.points;
      }
    }
    if (circleMode && circleMode.banner) {
      if (circleMode.control) {
        bannerProps.circles = circleMode.control.values;
      } else {
        bannerProps.circles = this.state.circles;
      }
    }
    return <Banner {...bannerProps} />;
  };
  private renderControl = () => {
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
    const { points, circles, pickerMode } = this.state;
    if (this.props.overlayAll) {
      return <Overlays points={points} circles={circles} polygons={[]} />;
    } else {
      const opts: IOverlaysProps = { points: [], circles: [], polygons: [] };
      // @ts-ignore
      opts[pickerMode] = this.state[pickerMode];
      return <Overlays {...opts} />;
    }
  };
  private renderInputs = () => {
    if (this.props.showInputs) {
      return (
        <div style={{ display: "inline-block" }}>
          <input
            type="number"
            value={this.state.lat}
            onChange={this.inputChange("lat")}
          />
          <input
            type="number"
            value={this.state.lng}
            onChange={this.inputChange("lng")}
          />
        </div>
      );
    }
  };
  private handleClick = (e: LeafletMouseEvent) => {
    const { precision, pointMode, circleMode } = this.props;
    const { pickerMode, points, circles, circleCenter } = this.state;
    const lat = setPrecision(e.latlng.lat, precision);
    const lng = setPrecision(e.latlng.lng, precision);
    this.setState({ lat, lng });
    switch (pickerMode) {
      case "points": {
        if (pointMode && pointMode.control) {
          pointMode.control.onClick([lat, lng]);
        } else {
          this.setState({ points: points.concat([[lat, lng]]) });
        }
        break;
      }
      case "circles": {
        if (circleMode && circleMode.control) {
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
  private changeMode = (pickerMode: pickerMode) => () => {
    this.setState({ pickerMode, circleCenter: null });
  };
}

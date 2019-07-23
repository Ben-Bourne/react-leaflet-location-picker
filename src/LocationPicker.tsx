import React, { Component } from "react";
import { Map, TileLayer, Viewport } from "react-leaflet";
import { LatLngTuple, LeafletMouseEvent } from "leaflet";
import Control from "react-leaflet-control";
import Banner, { IBannerProps } from "./Banner";
import { setPrecision } from "./utils";
import "leaflet/dist/leaflet.css";

export type Circle = { centre: LatLngTuple; radius: number };
export type Polygon = LatLngTuple[];

type pickerMode = "point" | "circle" | "polygon" | "none";

interface ILocationPickerProps {
  tileLayer: {
    url: string;
    attribution: string;
  };
  bindMap: boolean;
  showInputs: boolean;
  precision: number;
  pointMode?: {
    control?: {
      values: LatLngTuple[];
      onClick: (point: LatLngTuple) => void;
    };
    showBanner: boolean;
  };
}

type ILocationPickerState = Readonly<typeof defaultState>;
const defaultState = {
  lat: 0,
  lng: 0,
  pickerMode: "point" as pickerMode,
  points: [] as LatLngTuple[] | undefined
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
  static defaultProps: ILocationPickerProps = {
    tileLayer: {
      url: "http://{s}.tile.osm.org/{z}/{x}/{y}.png",
      attribution:
        '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
    },
    bindMap: true,
    showInputs: true,
    precision: 6
  };

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
          <Control position="topright">
            <button>Success!</button>
          </Control>
        </Map>
        {this.renderInputs()}
      </div>
    );
  }
  private renderBanner = () => {
    const { pointMode } = this.props;
    const bannerProps: IBannerProps = { precision: this.props.precision };
    if (pointMode) {
      if (pointMode.control) {
        bannerProps.points = pointMode.control.values;
      } else {
        bannerProps.points = this.state.points;
      }
    }
    return <Banner {...bannerProps} />;
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
    const { precision, pointMode } = this.props;
    const lat = setPrecision(e.latlng.lat, precision);
    const lng = setPrecision(e.latlng.lng, precision);
    this.setState({ lat, lng });
    switch (this.state.pickerMode) {
      case "point": {
        if (pointMode && pointMode.control) {
          pointMode.control.onClick([lat, lng]);
        } else {
          this.setState({ points: this.state.points!.concat([[lat, lng]]) });
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
}

import React, { Component } from "react";
import { Map, TileLayer, Viewport } from "react-leaflet";
import { LatLngTuple, LeafletMouseEvent } from "leaflet";
import "leaflet/dist/leaflet.css";

interface ILocationPickerProps {
  tileLayer: {
    url: string;
    attribution: string;
  };
  bindMap: boolean;
  precision: number;
  pointMode?: {
    onClick: () => void;
  };
}

interface ILocationPickerState {
  lat: number | undefined;
  lng: number | undefined;
}

const defaultState: ILocationPickerState = {
  lat: 0,
  lng: 0
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
  static defaultProps = {
    tileLayer: {
      url: "http://{s}.tile.osm.org/{z}/{x}/{y}.png",
      attribution:
        '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
    },
    bindMap: true,
    precision: 6
  };

  render() {
    const bounds = this.props.bindMap ? mapBounds : undefined;
    return (
      <div style={{ display: "inline-block" }}>
        <Map
          style={{ height: 400, width: 600 }}
          viewport={defaultViewport}
          maxBounds={bounds}
          maxBoundsViscosity={1}
          onClick={this.handleClick}
          minZoom={2}
        >
          <TileLayer {...this.props.tileLayer} />
        </Map>
        <div>
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
      </div>
    );
  }
  private handleClick = (e: LeafletMouseEvent) => {
    this.setState({
      lat: setPrecision(e.latlng.lat, this.props.precision),
      lng: setPrecision(e.latlng.lng, this.props.precision)
    });
  };
  private inputChange = (field: string) => (e: React.ChangeEvent<any>) => {
    const newState = { [field]: Number(e.target.value) } as Pick<
      ILocationPickerState,
      "lat" | "lng"
    >;
    this.setState(newState);
  };
}

const setPrecision = (value: number | string, precision: number): number => {
  return +Number(value).toPrecision(precision);
};

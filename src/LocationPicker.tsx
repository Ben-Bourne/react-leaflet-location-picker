import React, { Component } from "react";
import { Map, TileLayer, Viewport } from "react-leaflet";
import { LatLngTuple } from "leaflet";

interface ILocationPickerProps {
  tileUrl: string;
  tileAttribution: string;
  bindMap: boolean;
}

export default class LocationPicker extends Component<ILocationPickerProps> {
  static defaultProps = {
    tileUrl: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    tileAttribution:
      '&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
    bindMap: true
  };
  static mapBounds: [LatLngTuple, LatLngTuple] = [[0, 0], [0, 0]];
  static defaultViewport: Viewport = {
    center: [51.505, -0.09],
    zoom: 13
  };
  render() {
    const bounds = this.props.bindMap ? LocationPicker.mapBounds : undefined;
    return (
      <Map bounds={bounds} viewport={LocationPicker.defaultViewport}>
        <TileLayer
          attribution={this.props.tileAttribution}
          url={this.props.tileUrl}
        />
      </Map>
    );
  }
}

# react-leaflet-location-picker

This module expands upon react-leaflet to give the user an easy way of selecting points and shapes from the map.
The project is in its infancy at the moment but regular feature releases are planned.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [Props](#props)

## Installation

Download into your project with npm. Optionally also use the types for typescript.

```sh
npm i react-leaflet-location-picker
npm i @types/react-leaflet-location-picker
```

## Usage

Import into your file and get started straight away.

```javascript
import React from "react";
import LocationPicker from "react-leaflet-location-picker";

const MyComponent = () => {
  return <LocationPicker />;
};

export default MyComponent;
```

## Props

The component currently accepts the following props:

- tileLayer: An object with url and attribution properties for the tile layer if you're familiar with leaflet. Defaults to OpenStreetMap settings.
- bindMap: Boolean. Allows you to set whether the map should be bound to the area of the globe. Default true.
- precision: Number. Allows you to set the level of precision coordinates are set to. Default 6.

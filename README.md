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
- overlayAll: Boolean. The map can display all map objects or only the type of the ones being selects. Default true.
- showInputs: Boolean. The number input fields can be shown or hidden. Default true.
- precision: Number. Allows you to set the level of precision coordinates are set to. Default 6.

- pointMode: {(optional)control:{values:Point[], onClick:(Point)=>void}, banner: boolean} Default undefined
- circleMode: {(optional)control:{values:Circle[], onClick:(Point)=>void}, banner: boolean} Default undefined

The mode props require some additional explanation. They are all optional, if omitted the map will not use the corresponding mode at all. If included but the 'control' object is omitted then the component will manage it's own state internally. This is the simplest way to use a mode but will make it difficult to do anything other than use the component visually.
If the 'control' object is provided then managing the components values is up to YOU, the component will use the values you pass it and clicking on the map will pass the onClick method of the current mode of operation (i.e. point, circle or polygon) the lat lng tuple of the click location. You can decide what to do with this.

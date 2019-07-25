# react-leaflet-location-picker

This module expands upon react-leaflet to give the user an easy way of selecting points and shapes from the map.
The project is in its infancy at the moment but regular feature releases are planned.

## Table of Contents

- [Installation](#installation)
- [Types](#types)
- [Props](#props)
- [Examples](#examples)

## Installation

Download into your project with npm. Optionally also use the types for typescript.

```sh
npm i react-leaflet-location-picker
npm i @types/react-leaflet-location-picker -D
```

## Types

The map objects are stored in the state in the following manner.

```javascript
type Point = [number, number];
type Circle = {
  centre: Point,
  radius: number // in metres
};
```

## Props

The component currently accepts the following props (props with question marks are optional):

- tileLayer?: An object with url and attribution properties for the tile layer if you're familiar with leaflet. Defaults to OpenStreetMap settings.
- bindMap?: Boolean. Allows you to set whether the map should be bound to the area of the globe. Default true.
- overlayAll?: Boolean. The map can display all map objects or only the type of the ones being selects. Default true.
- showInputs?: Boolean. The number input fields can be shown or hidden. Default true.
- precision?: Number. Allows you to set the level of precision coordinates are set to. Default 6.

Mode props:

- pointMode: {control?:{values:Point[], onClick?:(Point)=>void, onRemove?:(Point)=>void}, banner: boolean} Default undefined
- circleMode: {control?:{values:Circle[], onClick?:(Point)=>void, onRemove?:(Circle)=>void}, banner: boolean} Default undefined

The mode props require some additional explanation. They are all optional, if omitted the map will not use the corresponding mode at all. If included but the 'control' object is omitted then the component will manage it's own state internally. This is the simplest way to use a mode but will make it difficult to do anything other than use the component visually.
If the 'control' object is provided then managing the components values is up to YOU, the component will use the values you pass it and clicking on the map will pass the onClick method of the current mode of operation (i.e. points, circles or polygons) the lat lng tuple of the click location. You can decide what to do with this. Passing one of the modes an onRemove method will call that function with the value of the corresponding point when the X button is pressed in the banner

## Examples

```javascript
import React from "react";
import LocationPicker from "react-leaflet-location-picker";

const MyComponent = () => {
  const pointVals = [[50, 2], [45, -10]];
  const pointMode = {
    banner: true,
    control: {
      values: pointVals,
      onClick: point =>
        console.log("I've just been clicked on the map!", point),
      onRemove: point =>
        console.log("I've just been clicked for removal :(", point)
    }
  };
  const circleMode = {
    banner: false
  };
  return <LocationPicker pointMode={pointMode} circleMode={circleMode} />;
};

export default MyComponent;
```

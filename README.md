# react-leaflet-location-picker

This module expands upon react-leaflet to give the user an easy way of selecting points and circles from the map. It is highly configurable and allows the user to use all, none or any combination in between of the selection modes. Additionally each mode can be controlled internally by the component or externally by a parent component effectively making it a controlled component.

This gives you a simple to use and very powerful tool for an application that needs to select points or areas from a map.

Project progress can be tracked on the <a href="https://trello.com/b/9xlwajmT/react-leaflet-location-picker">trello board</a>.

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
  center: Point,
  radius: number // in metres
};
type Rectangle = [Point, Point];
type PointSeries = Point[];
```

## Props

The component currently accepts the following props (props with question marks are optional):

- geoserver?: Boolean value to enable geoserver support. Default is false and will use an object with url and attribution properties for the tile layer if you're familiar with leaflet (Defaults to OpenStreetMap settings). When enabled, provide the following props:
-geoPort: String. The port on which local geoserver is running.
-geoWorkspace: String. The workspace in which the maps layers are stored on geoserver.
-geoLayer: String. The map layer from the workspace that is to be used.
- mapStyle?: Object. You can pass this prop as an object that contains any properties you could give to html element. If defining yourself you MUST pass it a fixed height property or the component will not display. Default { height: 300, width: "auto" }
- bindMap?: Boolean. Allows you to set whether the map should be bound to the area of the globe. Default true.
- startPort?: "auto" | "default" | Viewport. Where the map should set its initial viewport. "default" starts zoomed out viewing the whole globe. "auto" creates a view zoomed in on all the map entities provided i.e. points, circles etc. You can also pass in your own viewport and it will use that. Default "default".
- overlayAll?: Boolean. The map can display all map objects or only the type of the ones being selects. Default true.
- useDynamic?: Boolean. The map can display the polygon or circle that the user would get if they clicked. This must also be true in order for the coordinate tracker to work. Default true.
- showControls? Boolean. Whether the map should show the control buttons. Setting this false leaves you no way to switch mode so this is intended for a 'display only' usage. Default false.
- showInputs?: Boolean. The number input fields can be shown or hidden. Default true.
- precision?: Number. Allows you to set the level of precision coordinates are set to. Default 6.

Mode props:

- pointMode?: {control?:{values:Point[], onClick?:(Point)=>void, onRemove?:(Point)=>void}, banner: boolean} Default undefined
- circleMode?: {control?:{values:Circle[], onClick?:(Point)=>void, onRemove?:(Circle)=>void}, banner: boolean} Default undefined
- rectangleMode?: {control?:{values:Rectangle[], onClick?:(Point)=>void, onRemove?:(Rectangle)=>void}, banner: boolean} Default undefined
- polylineMode?: {control?:{values:PointSeries[], onClick?:(Point)=>void, onRemove?:(PointSeries)=>void, onAdd?:()=>void}, banner: boolean} Default undefined
- polygonMode?: {control?:{values:PointSeries[], onClick?:(Point)=>void, onRemove?:(PointSeries)=>void, onAdd?:()=>void}, banner: boolean} Default undefined

The mode props require some additional explanation. They are all optional, if omitted the map will not use the corresponding mode at all. If included but the 'control' object is omitted then the component will manage it's own state internally. This is the simplest way to use a mode but will make it difficult to do anything other than use the component visually.

If the 'control' object is provided then managing the components values is up to YOU, the component will use the values you pass it and clicking on the map will pass the onClick method of the current mode of operation (e.g. points, circles or polygons) the lat lng tuple of the click location. You can decide what to do with this. Passing one of the modes an onRemove method will call that function with the value of the corresponding entity when the X button is pressed in the banner.

The polygonMode and polylineMode props have one additional method 'onAdd', this will be called when the user clicks the 'Add' button in the control section. This is neccessary because unlike points and circles, a point series can require any number of clicks in its construction.

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

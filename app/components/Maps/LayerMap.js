"use client"

import 'maplibre-gl/dist/maplibre-gl.css';
import DeckGL from '@deck.gl/react';
import {
    COORDINATE_SYSTEM,
    _GlobeView as GlobeView,
    MapView
} from '@deck.gl/core'
import {BitmapLayer, ArcLayer} from '@deck.gl/layers';
// import {ParticleLayer} from 'deckgl-particle-layer';
import { ParticleLayer } from 'deck.gl-particle'

import Map from 'react-map-gl/maplibre'
import {useCallback, useEffect, useMemo, useState} from "react";
import ColorRemapBitmapLayer from "@/app/components/CustomLayers/ColorRemapBitmapLayer";

import chroma from "chroma-js"
import {Slider, RangeSlider, Loader} from 'rsuite';
import {DrawerDefault} from "@/app/components/Drawer/DrawerDefault";
import {BottomDrawer} from "@/app/components/Drawer/BottomDrawer";
import {
    ArrowTrendingUpIcon,
    GlobeAltIcon,
    MagnifyingGlassIcon,
    MapIcon,
    MinusIcon,
    PlayIcon,
    PlusIcon,
    EyeDropperIcon,
    CloudIcon,
    FireIcon, StopCircleIcon, XMarkIcon, ChevronDownIcon,
    EyeIcon
} from "@heroicons/react/20/solid";
import {
    FaWind,
    FaThermometerFull
} from "react-icons/fa";
import { WiHumidity } from 'react-icons/wi'
import { BsFillCloudLightningRainFill } from "react-icons/bs";
import { FaRegEye } from "react-icons/fa";
import {Button, IconButton, Input, Tooltip, Typography} from "@material-tailwind/react";

import {readPixelsToArray} from '@luma.gl/core';
import TemparatureScale from "@/app/components/Scale/TemparatureScale";
import {
    lightingEffect
} from '@/app/components/lib/mapconfig'

import BitMapLayerCustomShader from "@/app/components/CustomLayers/BitMapLayerCustomShader";

const LayerMap = (props) => {
    const { layerData, selectedLayer, setSelectedLayer } = props
    const [initialMapViewState, setInitialMapViewState] = useState({
        longitude: -122.4,
        latitude: 37.74,
        zoom: 4,
        maxZoom: 10,
        // pitch: 30,
        // bearing: 0
    });
    const [zoom, setZoom] = useState(initialMapViewState.zoom);

    const onViewStateChange = useCallback(({viewState}) => {
        setZoom(viewState.zoom);
    }, []);

    // State variables for zoom level and other properties
    const [zoomLevel, setZoomLevel] = useState(initialMapViewState.zoom);
    // ... (Other state variables)

    // Function to handle Zoom In
    const handleZoomIn = () => {
        setInitialMapViewState((prevInitialMapViewState) => ({
            ...prevInitialMapViewState,
            zoom: prevInitialMapViewState.zoom * 1.2,
        }))
    };

    // Function to handle Zoom Out
    // const handleZoomOut = () => {
    //     const newZoomLevel = Math.max(zoomLevel - 1, initialMapViewState.minZoom);
    //     setZoomLevel(newZoomLevel);
    // };

    const handleZoomOut = () => {
        setInitialMapViewState((prevInitialMapViewState) => ({
            ...prevInitialMapViewState,
            zoom: prevInitialMapViewState.zoom / 1.2,
        }))
    };

    const [isWindLayerVisible, setIsWindLayerVisible] = useState(false);
    const [rgbColors, setRgbColors] = useState([])
    const [currentDataIndex, setCurrentDataIndex] = useState(0);
    const [imageUrl, setImageUrl] = useState('https://imgtr.ee/images/2023/10/25/a3a1343c2b86bc0ee83ad8fd91a1ef17.png');
    // const [imageUrl, setImageUrl] = useState('https://raw.githubusercontent.com/visgl/deck.gl-data/master/website/sf-districts.png');
    // const [imageUrl, setImageUrl] = useState('https://imgtr.ee/images/2023/10/10/65c35a75a5c03becc2450fa419f21b92.png');
    const [data, setData] = useState(null);

    const [openBottomDrawer, setOpenBottomDrawer] = useState(false);

    const openBottomDrawerHandle = () => {
        setOpenBottomDrawer(true);
    }

    const closeBottomDrawerHandle = () => setOpenBottomDrawer(false);

    const layers = [
        // {
        //     id: "arc",
        //     label: "Arc Layer",
        //     icon: FireIcon,
        //     config: new ArcLayer({
        //         data: 'https://raw.githubusercontent.com/visgl/deck.gl-data/master/website/bart-segments.json',
        //         getSourcePosition: d => d.from.coordinates,
        //         getTargetPosition: d => d.to.coordinates,
        //         getSourceColor: [255, 200, 0],
        //         getTargetColor: [0, 140, 255],
        //         getWidth: 12,
        //         pickable: true,
        //         autoHighlight: true
        //     }),
        // },
        {
            id: "temp",
            label: "Temperature",
            icon: FaThermometerFull,
            config: new ColorRemapBitmapLayer({
                id: `BitmapLayer with color remapping#${Math.random()}`,
                _imageCoordinateSystem: COORDINATE_SYSTEM.LNGLAT,
                // image: 'https://imgtr.ee/images/2023/10/10/65c35a75a5c03becc2450fa419f21b92.png',
                image: layerData[currentDataIndex].image_url,
                bounds: [-180.0, -90, 180.0, 90],
                colormapData: rgbColors,
                colorRange: [
                    0.0, 0.05, 0.1, 0.15, 0.2, 0.25, 0.3, 0.35, 0.4, 0.45, 0.5, 0.55, 0.6,
                    0.65, 0.7, 0.75, 0.8, 0.85, 0.9, 0.95,
                ],
                // colorRange: [0.0, 0.0625, 0.125, 0.1875, 0.25, 0.3125, 0.375, 0.4375, 0.5, 0.5625, 0.625, 0.6875, 0.75, 0.8125, 0.875, 0.9375, 1.0],
                pickable: true,
                highlightRed: false,
                onClick: ({bitmap, layer, coordinate, x, y, size, uv}) => {
                    if (bitmap) {
                        const pixelColor = readPixelsToArray(layer.props.image, {
                            sourceX: bitmap.pixel[0],
                            sourceY: bitmap.pixel[1],
                            sourceWidth: 1,
                            sourceHeight: 1,
                        });
                        console.log('Color at picked pixel:', pixelColor);
                        console.log('Coordinates of picked pixel:', coordinate);
                        console.log('Clicked layer:', layer);
                        console.log('Click position in local x, y:', {x, y});
                    }
                },
            }),
        },
        {
            id: "bitmap",
            label: "Rain",
            icon: BsFillCloudLightningRainFill,
            config: new BitMapLayerCustomShader({
                id: `BitmapLayer with color remapping#${Math.random()}`,
                _imageCoordinateSystem: COORDINATE_SYSTEM.LNGLAT,
                // image: 'https://imgtr.ee/images/2023/10/10/65c35a75a5c03becc2450fa419f21b92.png',
                // image: layerData[currentDataIndex].image_url,
                image: "https://imgtr.ee/images/2023/11/02/574d87f73c17c2cea7ce328b78baa712.png",
                bounds: [-180.0, -90, 180.0, 90],
                colormapData: rgbColors,
                colorRange: [
                    0.0, 0.05, 0.1, 0.15, 0.2, 0.25, 0.3, 0.35, 0.4, 0.45, 0.5, 0.55, 0.6,
                    0.65, 0.7, 0.75, 0.8, 0.85, 0.9, 0.95,
                ],
                // colorRange: [0.0, 0.0625, 0.125, 0.1875, 0.25, 0.3125, 0.375, 0.4375, 0.5, 0.5625, 0.625, 0.6875, 0.75, 0.8125, 0.875, 0.9375, 1.0],
                pickable: true,
                highlightRed: false,
                onClick: ({bitmap, layer, coordinate, x, y, size, uv}) => {
                    if (bitmap) {
                        const pixelColor = readPixelsToArray(layer.props.image, {
                            sourceX: bitmap.pixel[0],
                            sourceY: bitmap.pixel[1],
                            sourceWidth: 1,
                            sourceHeight: 1,
                        });
                        console.log('Color at picked pixel:', pixelColor);
                        console.log('Coordinates of picked pixel:', coordinate);
                        console.log('Clicked layer:', layer);
                        console.log('Click position in local x, y:', {x, y});
                    }
                },
            }),
        },
        // {
        //     id: "wind",
        //     label: "Wind Layer",
        //     icon: FireIcon,
        //     config: new ParticleLayer({
        //         id: 'particle1',
        //         image: 'https://mapbox.github.io/webgl-wind/demo/wind/2016112000.png',
        //         numParticles: 5000,
        //         maxAge: 50,
        //         speedFactor: 0.3,
        //         uWindMin: -21.32,
        //         uWindMax: 26.8,
        //         vWindMin: -21.57,
        //         vWindMax: 21.42,
        //         bounds: [-180, -90, 180, 90],
        //         boundsClip: false,
        //         width: 2,
        //         opacity: 1,
        //         colors: {
        //             0.0: '#3288bd',
        //             0.1: '#66c2a5',
        //             0.2: '#abdda4',
        //             0.3: '#e6f598',
        //             0.4: '#fee08b',
        //             0.5: '#fdae61',
        //             0.6: '#f46d43',
        //             1.0: '#d53e4f'
        //         }
        //     }),
        // },
        {
            id: "wind",
            label: "Wind Layer",
            icon: FaWind,
            config: new ParticleLayer({
                id: `particlelayer#${Math.random()}`,
                image: 'https://mapbox.github.io/webgl-wind/demo/wind/2016112000.png',
                // image: 'https://imgtr.ee/images/2023/11/02/5f3f2abdc650e7da81ef42115074c941.png',
                // image: 'https://imgtr.ee/images/2023/11/02/d665f69f5bfe67d672ea2ac500a2a4a2.png',
                imageUnscale: [-128, 127],
                bounds: [-180, -90, 180, 90],
                numParticles: 5000, // number
                maxAge: 25, // number
                speedFactor: 1, // number
                color: [255, 255, 255], // [number, number, number]
                width: 2, // number
                opacity: 0.1,
                animate: true
            }),
        },
        {
            id: "colorMap",
            label: "Color Map",
            icon: EyeDropperIcon,
            config: new ColorRemapBitmapLayer({
                id: `BitmapLayer with color remapping#${Math.random()}`,
                _imageCoordinateSystem: COORDINATE_SYSTEM.LNGLAT,
                // image: 'https://imgtr.ee/images/2023/10/10/65c35a75a5c03becc2450fa419f21b92.png',
                image: layerData[currentDataIndex].image_url,
                bounds: [-180.0, -90, 180.0, 90],
                colormapData: rgbColors,
                colorRange: [
                    0.0, 0.05, 0.1, 0.15, 0.2, 0.25, 0.3, 0.35, 0.4, 0.45, 0.5, 0.55, 0.6,
                    0.65, 0.7, 0.75, 0.8, 0.85, 0.9, 0.95,
                ],
                // colorRange: [0.0, 0.0625, 0.125, 0.1875, 0.25, 0.3125, 0.375, 0.4375, 0.5, 0.5625, 0.625, 0.6875, 0.75, 0.8125, 0.875, 0.9375, 1.0],
                pickable: true,
                highlightRed: false,
                onClick: ({bitmap, layer, coordinate, x, y, size, uv}) => {
                    if (bitmap) {
                        const pixelColor = readPixelsToArray(layer.props.image, {
                            sourceX: bitmap.pixel[0],
                            sourceY: bitmap.pixel[1],
                            sourceWidth: 1,
                            sourceHeight: 1,
                        });
                        console.log('Color at picked pixel:', pixelColor);
                        console.log('Coordinates of picked pixel:', coordinate);
                        console.log('Clicked layer:', layer);
                        console.log('Click position in local x, y:', {x, y});
                    }
                },
            }),
        },
        {
            id: "humidity",
            label: "Humidity",
            icon: WiHumidity,
            config: new ColorRemapBitmapLayer({
                id: `Humidity with color remapping#${Math.random()}`,
                _imageCoordinateSystem: COORDINATE_SYSTEM.LNGLAT,
                // image: 'https://imgtr.ee/images/2023/10/10/65c35a75a5c03becc2450fa419f21b92.png',
                // image: layerData[currentDataIndex].image_url,
                image: "https://imgtr.ee/images/2023/11/02/324c550b665d8de0233165fdd7bb0b23.png",
                bounds: [-180.0, -90, 180.0, 90],
                colormapData: rgbColors,
                colorRange: [
                    0.0, 0.05, 0.1, 0.15, 0.2, 0.25, 0.3, 0.35, 0.4, 0.45, 0.5, 0.55, 0.6,
                    0.65, 0.7, 0.75, 0.8, 0.85, 0.9, 0.95
                ],
                // colorRange: [0.0, 0.0625, 0.125, 0.1875, 0.25, 0.3125, 0.375, 0.4375, 0.5, 0.5625, 0.625, 0.6875, 0.75, 0.8125, 0.875, 0.9375, 1.0],
                pickable: true,
                highlightRed: false,
                onClick: ({bitmap, layer, coordinate, x, y, size, uv}) => {
                    if (bitmap) {
                        const pixelColor = readPixelsToArray(layer.props.image, {
                            sourceX: bitmap.pixel[0],
                            sourceY: bitmap.pixel[1],
                            sourceWidth: 1,
                            sourceHeight: 1,
                        });
                        console.log('Color at picked pixel:', pixelColor);
                        console.log('Coordinates of picked pixel:', coordinate);
                        console.log('Clicked layer:', layer);
                        console.log('Click position in local x, y:', {x, y});
                    }
                },
            }),
        },
        {
            id: "visibility",
            label: "visibility",
            icon: EyeIcon,
            config: new ColorRemapBitmapLayer({
                id: `visibility with color remapping#${Math.random()}`,
                _imageCoordinateSystem: COORDINATE_SYSTEM.LNGLAT,
                // image: 'https://imgtr.ee/images/2023/10/10/65c35a75a5c03becc2450fa419f21b92.png',
                // image: layerData[currentDataIndex].image_url,
                image: "https://imgtr.ee/images/2023/11/02/40c106973f3999e7e8411284afb56b96.png",
                bounds: [-180.0, -90, 180.0, 90],
                colormapData: rgbColors,
                colorRange: [
                    0.0, 0.05, 0.1, 0.15, 0.2, 0.25, 0.3, 0.35, 0.4, 0.45, 0.5, 0.55, 0.6,
                    0.65, 0.7, 0.75, 0.8, 0.85, 0.9, 0.95
                ],
                // colorRange: [0.0, 0.0625, 0.125, 0.1875, 0.25, 0.3125, 0.375, 0.4375, 0.5, 0.5625, 0.625, 0.6875, 0.75, 0.8125, 0.875, 0.9375, 1.0],
                pickable: true,
                highlightRed: false,
                onClick: ({bitmap, layer, coordinate, x, y, size, uv}) => {
                    if (bitmap) {
                        const pixelColor = readPixelsToArray(layer.props.image, {
                            sourceX: bitmap.pixel[0],
                            sourceY: bitmap.pixel[1],
                            sourceWidth: 1,
                            sourceHeight: 1,
                        });
                        console.log('Color at picked pixel:', pixelColor);
                        console.log('Coordinates of picked pixel:', coordinate);
                        console.log('Clicked layer:', layer);
                        console.log('Click position in local x, y:', {x, y});
                    }
                },
            }),
        },

    ];

    // Function to update the image URL based on the current data index

    const dateRange = [
        '2023-10-01',
        // '2023-10-02',
        // '2023-10-03',
        // '2023-10-04',
        // '2023-10-05',
        // '2023-10-06',
        // '2023-10-07',
        // '2023-10-08',
        // '2023-10-09',
        // '2023-10-10',
    ];

    const timesPerDay = [
        '12:00 AM',
        '6:00 AM',
        '12:00 PM',
        '6:00 PM',
    ];

    const dateTimeValues = dateRange.reduce((acc, date) => {
        return acc.concat(timesPerDay.map(time => `${date} ${time}`));
    }, []);

    const dateTimeToValue = (dateTime) => {
        return dateTimeValues.indexOf(dateTime);
    };

    const valueToDateTime = (value) => {
        return dateTimeValues[value];
    };

    // const [value, setValue] = useState(dateTimeToValue(dateTimeValues[currentDataIndex]));
    const [value, setValue] = useState(dateTimeToValue(dateTimeValues[currentDataIndex]));

    const customTooltip = (
        valueToDateTime(value)
    )

    const formatDate = (dateStr) => {
        const date = new Date(dateStr);
        const options = {weekday: 'short', month: 'short', day: 'numeric'};
        return date.toLocaleString('en-US', options);
    };

    const dayDividerStyle = {
        width: `${100 / (dateRange.length - 1)}%`,
        height: '10px',  // Adjust the height as needed
        borderRight: '1px solid #000000',  // Adjust the border style and color as needed
    };

    const updateImage = () => {
        if (layerData.length > 0) {
            const nextIndex = (currentLayerDataIndex + 1) % layerData.length;
            console.log("nextIndex", nextIndex)
            console.log("data.length", layerData.length)
            setCurrentLayerDataIndex(nextIndex);
        }
    };


    useMemo(() => {
        // Initialize colors
        const colors = chroma
            .scale(['#5e4fa2', '#555ba8', '#4c66ad', '#4372b3', '#3a7eb8', '#3389bd', '#3e95b8', '#48a1b3', '#53adae', '#5eb9a9', '#69c3a5', '#77c9a5', '#85cea5', '#93d4a4', '#a1d9a4', '#afdea3', '#bbe3a1', '#c7e89e', '#d3ed9c', '#dff299', '#e8f69b', '#edf8a3', '#f2faab', '#f7fcb3', '#fcfebb', '#fffcba', '#fff6af', '#feefa4', '#fee99a', '#fee38f', '#feda86', '#fed07d', '#fdc575', '#fdbb6c', '#fdb164', '#fca55d', '#fa9757', '#f88a50', '#f67d4a', '#f47044', '#ef6545', '#e95c47', '#e2524a', '#dc494c', '#d63f4f', '#cb334d', '#c0264a', '#b41a47', '#a90d45', '#9e0142'])
            .mode('lch')
            .colors(21);
        // const colors = chroma
        //     .scale([
        //         "#9589D3",
        //         "#9589D3",
        //         "#9589D3",
        //         "#9589D3",
        //         "#96D1D8",
        //         "#81CCC5",
        //         "#67B4BA",
        //         "#5F8F9C",
        //         "#508C3E",
        //         "#79921C",
        //         "#AB9D0E",
        //         "#DFB106",
        //         "#F39606",
        //         "#EC5F15",
        //         "#BE4112",
        //         "#8A2B0A",
        //         "#8A2B0A"
        //     ])
        //     .mode('lch')
        //     .colors(21);
        // const colors = chroma
        //     .scale(['#845428', '#9a723e', '#b18f54', '#c7ad6a', '#ddcb81', '#f4e897', '#eff2a5', '#dcf1af', '#c9f0b9', '#b6efc3', '#a4efcd', '#91e6d1', '#7dcec6', '#6ab6bc', '#569eb2', '#4386a7', '#2f6e9d'])
        //     .mode('lch')
        //     .colors(17);

        setRgbColors(colors.map((c) => chroma(c).rgb()));

        // console.log("colors.map((c) => chroma(c).rgb())-------", colors.map((c) => chroma(c).gl()))
        // console.log("colors.map((c) => chroma(c).rgb())-------",chroma("#AA4A44").gl())

    }, []);


    const layer = new BitmapLayer({
        id: 'bitmap-layer',
        bounds: [-122.5190, 37.7045, -122.355, 37.829],
        image: 'https://raw.githubusercontent.com/visgl/deck.gl-data/master/website/sf-districts.png'
    });

    const ColorBitMapLayer = new ColorRemapBitmapLayer({
        id: `BitmapLayer with color remapping#${Math.random()}`,
        _imageCoordinateSystem: COORDINATE_SYSTEM.LNGLAT,
        // image: data[currentDataIndex].image_url,
        image: "https://imgtr.ee/images/2023/10/25/bab90395229c7766196175d8ebdf7a5c.png",
        bounds: [-180.0, -90, 180.0, 90],
        // bounds: [30, -40, 200, 45],
        colormapData: rgbColors,
        colorRange: [
            0.0, 0.05, 0.1, 0.15, 0.2, 0.25, 0.3, 0.35, 0.4, 0.45, 0.5, 0.55, 0.6,
            0.65, 0.7, 0.75, 0.8, 0.85, 0.9, 0.95,
        ],
        pickable: true,
    })

    const oldlayers = [ColorBitMapLayer]


    console.log("dateTimeToValue(dateTimeValues[0])", dateTimeToValue(dateTimeValues[0]))

    // ----------- Globe view and Map view Toggle Start -------------
    const [isMapView, setIsMapView] = useState(true);


    const switchToMapView = () => {
        setIsMapView(true);
    };

    const switchToGlobeView = () => {
        setIsMapView(false);
    };
    // ----------- Globe view and Map view Toggle end -------------


    // ----------- Temperature Scale Data Start -------------
    const progressData = [
        {percentage: 0, color: 'yellow-500'},
        {percentage: 20, color: 'blue-500'},
        {percentage: 40, color: 'green-500'},
        {percentage: 50, color: 'yellow-500'},
        {percentage: 60, color: 'red-900'},
    ];
    // ----------- Temperature Scale Data End -------------

    const toggleWindLayerVisibility = () => {
        setIsWindLayerVisible(!isWindLayerVisible);
    };


    // ------------- Play Button function --------------------

    const [isPlaying, setIsPlaying] = useState(false);

    const [currentStep, setCurrentStep] = useState(0);

    // Function to update the current data index and step
    // const updateDataIndex = () => {
    //     if (currentStep < dateTimeValues.length) {
    //         setCurrentDataIndex(currentStep);
    //         setValue(currentStep)
    //         setCurrentStep(currentStep + 1);
    //     } else {
    //         setIsPlaying(false); // Stop playing when the last step is reached
    //     }
    // };

    // Define the updateDataIndex function inside a useCallback hook
    // const updateDataIndex = useCallback(() => {
    //     if (currentStep < dateTimeValues.length) {
    //         setCurrentDataIndex(currentStep);
    //         setValue(currentStep);
    //         setCurrentStep(currentStep + 1);
    //     } else {
    //         setIsPlaying(false); // Stop playing when the last step is reached
    //     }
    // }, [currentStep, dateTimeValues, setCurrentDataIndex, setValue, setIsPlaying]);

    // Toggle the "Play" button state
    const togglePlay = () => {
        if (currentStep < dateTimeValues.length - 1) {
            setIsPlaying(!isPlaying);
        } else {
            setCurrentStep(0); // Start over from the beginning
            setValue(0)
            setIsPlaying(true);
        }
    };

    // Use useEffect to start/stop the interval when isPlaying changes
    // useEffect(() => {
    //     let intervalId;
    //
    //     if (isPlaying) {
    //         intervalId = setInterval(updateDataIndex, 1000); // Change data every second (adjust as needed)
    //     } else {
    //         clearInterval(intervalId);
    //     }
    //
    //     return () => clearInterval(intervalId); // Cleanup on component unmount
    // }, [isPlaying, currentStep, updateDataIndex]);


    // ----------- Marker logic Start -----------
    const [clickedtext, setClickedtext] = useState({})
    const [showMarker, setShowMarker] = useState(false)

    const expandTooltip = info => {
        console.log("-------------expandTooltip----------", info)
        setClickedtext(info);
        setShowMarker(true)
    };

    const textToDisplay = (info) => {

        if (info && showMarker) {
            // const pixelColor = readPixelsToArray(info.layer.props.image, {
            //     sourceX: info.bitmap.pixel[0],
            //     sourceY: info.bitmap.pixel[1],
            //     sourceWidth: 1,
            //     sourceHeight: 1,
            // });

            return (
                <div className="absolute bg-transparent" style={{left: info.x - 15, top: info.y - 15}}>
                    {!openBottomDrawer ?
                        (
                            <div className="max-w-md mx-auto overflow-hidden shadow-lg relative">

                                {/*<span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>*/}

                                <StopCircleIcon className="h-6 w-6 absolute top-2 left-0"/>
                                <XMarkIcon className="h-6 w-6 absolute top-2 right-2 p-1" onClick={turnOffMarker}/>
                                <Tooltip content="Forcast of this location" className="text-xs">
                                    <ChevronDownIcon
                                        className="h-8 w-8 absolute top-6 right-5 p-2 bg-white rounded-full font-bold"
                                        onClick={openBottomDrawerHandle}/>
                                </Tooltip>

                                {/*<button className="absolute top-2 right-2 p-1 bg-gray-50 text-black text-xs rounded-full mb-1">X</button>*/}
                                <div className="p-4">
                                    <h5 className="text-xl font-bold mt-3">
                                        <p>coordinate: {info.coordinate[0]}</p>
                                        <p>{info.coordinate[1]}</p>
                                        {/*<p>pixelColor: {pixelColor}</p>*/}
                                    </h5>
                                </div>
                            </div>

                        ) : (
                            <StopCircleIcon className="h-4 w-4 absolute top-2 left-0"/>
                            // <div>
                            //     {/*<StopCircleIcon className="animate-ping h-3 w-3 absolute top-2 left-0"/>*/}
                            //     {/*<div className="animate-ping h-6 w-6 bg-blue-500 rounded-full"></div>*/}
                            // </div>
                            // <div className="h-4 w-4 relative">
                            //     <div className="rounded-full bg-transparent border-4 border-blue-500 absolute -inset-0 animate-expand"><StopCircleIcon className="animate-ping h-6 w-6 absolute top-2 left-0"/></div>
                            // </div>

                        )
                    }
                </div>
            )
        }
    }

    const turnOffMarker = () => {
        setShowMarker(false)
        setClickedtext({})
    }

    // ----------- Marker logic Start -----------

    return (
        <div className="">
            {isMapView ? (
                <DeckGL
                    views={new MapView({
                        id: 'mapId',
                        resolution: 5,
                        repeat: true,
                        display: "block"
                    })}
                    width="100%"
                    height="100%"
                    layers={[
                        layers.find(layer => layer.id === selectedLayer).config,
                        isWindLayerVisible && layers.find(layer => layer.id === "wind").config
                    ]}
                    // layers={layers.filter((layer) => layer !== null).map((layer) => layer.config)}
                    initialViewState={initialMapViewState}
                    controller={true}
                    // onViewStateChange={onViewStateChange}
                    effects={[lightingEffect]}
                    minZoom={10}
                    maxZoom={10}
                    onClick={expandTooltip}
                >
                    <Map reuseMaps mapStyle="https://basemaps.cartocdn.com/gl/positron-gl-style/style.json" preventStyleDiffing={false}/>
                </DeckGL>
            ) : (
                <DeckGL
                    views={new GlobeView({
                        id: 'globeId',
                        resolution: 5,
                        // repeat: true
                    })}
                    width="100%"
                    height="100%"
                    layers={[
                        layers.find(layer => layer.id === selectedLayer).config,
                        isWindLayerVisible && layers.find(layer => layer.id === "wind").config
                    ]}
                    initialViewState={initialMapViewState}
                    controller={true}
                    // onViewStateChange={onViewStateChange}
                    effects={[lightingEffect]}
                    minZoom={10}
                    maxZoom={10}
                >
                    {/* Add your globe-specific layers and settings here */}
                </DeckGL>
            )}


            {/* ---------------- Main search bar start --------------------*/}
            <div className="absolute flex items-center ml-4">
                {textToDisplay(clickedtext)}
                {/*<Typography variant="h3"> MET Studio </Typography>*/}
                <div className="p-2 w-72">
                    {/*<Input icon={<MagnifyingGlassIcon className="h-5 w-5 text-black" />} label="Search" color="black" className="border-white bg-white" />*/}
                    <Input
                        type="email"
                        placeholder="Search Location"
                        className="h-3 !border !border-gray-300 bg-white text-gray-900 shadow-lg shadow-gray-900/5 ring-4 ring-transparent placeholder:text-gray-500 focus:!border-gray-900 focus:!border-t-gray-900 focus:ring-gray-900/10"
                        labelProps={{
                            className: "hidden",
                        }}
                        containerProps={{className: "min-w-[100px]"}}
                        icon={<MagnifyingGlassIcon className="h-4 w-5 text-black"/>}
                    />
                </div>
            </div>

            {/* ---------------- Main search bar ENd --------------------*/}

            <div className="absolute bottom-4 left-4 w-2/3">
                <div className="flex justify-between items-center">
                    <div className="mr-3">
                        <IconButton
                            className="rounded-full"
                            size="md"
                            onClick={togglePlay}
                        >
                            {isPlaying ?
                                <Loader className="h-5 w-5 text-white" />
                                :
                                <PlayIcon className="h-5 w-5"/>
                            }
                        </IconButton>
                    </div>
                    {/*<div className="w-full">*/}
                    {/*    <Slider*/}
                    {/*        className="custom-slider"*/}
                    {/*        defaultValue={dateTimeToValue(dateTimeValues[0])}*/}
                    {/*        min={0}*/}
                    {/*        max={dateTimeValues.length - 1}*/}
                    {/*        step={1}*/}
                    {/*        progress*/}
                    {/*        handleStyle={{*/}
                    {/*            borderRadius: 5,*/}
                    {/*            color: '#fff',*/}
                    {/*            fontSize: 12,*/}
                    {/*            width: 130,*/}
                    {/*        }}*/}
                    {/*        handleTitle={customTooltip}*/}
                    {/*        tooltip={false}*/}
                    {/*        value={value}*/}
                    {/*        onChange={value => {*/}
                    {/*            console.log("slider value", value);*/}
                    {/*            setValue(value)*/}
                    {/*            setCurrentDataIndex(value)*/}
                    {/*        }}*/}
                    {/*    />*/}

                    {/*    <div className="flex justify-between z-50">*/}
                    {/*        {dateRange.map((date, index) => (*/}
                    {/*            <div key={index} className="flex text-lg !font-thin"*/}
                    {/*                 style={{width: `${100 / (dateRange.length)}%`}}>|<span*/}
                    {/*                className="text-xs items-center py-2 ml-2 text-black font-bold"> {formatDate(date)}</span>*/}
                    {/*            </div>*/}
                    {/*        ))}*/}
                    {/*    </div>*/}
                    {/*</div>*/}
                </div>
            </div>

            {/* ----------- Main layer menu start --------------- */}

            <div className="absolute top-2 right-2 text-center">
                <div className="mb-1">
                    <div className="mb-1">
                        <Tooltip content="Zoom In" placement="left-end">
                            <IconButton className="rounded-full" size="sm" onClick={handleZoomIn}>
                                <PlusIcon className="h-3 w-3"/>
                            </IconButton>
                        </Tooltip>
                    </div>
                    <div>
                        <Tooltip content="Zoom Out" placement="left-end">
                            <IconButton className="rounded-full" size="sm" onClick={handleZoomOut}>
                                <MinusIcon className="h-3 w-3"/>
                            </IconButton>
                        </Tooltip>
                    </div>
                </div>


                {isMapView ? (
                    <div className="mb-1">
                        <Tooltip content="3D Mode" placement="left-end">
                            <IconButton className="rounded-full" size="sm" onClick={switchToGlobeView}>
                                <GlobeAltIcon className="h-3 w-3"/>
                            </IconButton>
                        </Tooltip>
                    </div>

                ) : (
                    <div className="mb-1">
                        <Tooltip content="2D Mode" placement="left-end">
                            <IconButton className="rounded-full" size="sm" onClick={switchToMapView}>
                                <MapIcon className="h-3 w-3"/>
                            </IconButton>
                        </Tooltip>
                    </div>
                )}


                <div className="rounded-2xl bg-white p-1 mb-1">
                    {layers.map((layer) => (
                        <div key={layer.id} className="mb-1">
                            <Tooltip content={layer.label} placement="left-end">
                                <IconButton className="rounded-full" size="sm" onClick={() => setSelectedLayer(layer.id)}>
                                    {<layer.icon className="h-3 w-3" />}
                                </IconButton>
                            </Tooltip>
                        </div>
                    ))}
                </div>

                {/* ------------ Drawer section start -------------- */}
                <DrawerDefault
                    layers={layers}
                    setSelectedLayer={setSelectedLayer}
                />

                <div className="mt-1">
                    <BottomDrawer
                        locationInfo={clickedtext}
                        // handleLayerToggle={handleLayerToggle}
                        openBottomDrawerHandle={openBottomDrawerHandle}
                        closeBottomDrawerHandle={closeBottomDrawerHandle}
                        openBottomDrawer={openBottomDrawer}
                    />
                </div>
                {/* --------------- Drawer section End --------------- */}
            </div>


            {/* Bottom right icon */}
            {/* This all are common layer */}
            <div className="absolute bottom-5 right-5 text-right">
                <div className="mb-5">
                    <Tooltip content="Particles" placement="left-end">
                        <IconButton
                            className={`rounded-full ${
                                isWindLayerVisible
                                && 'bg-blue-500'
                            }`}
                            size="sm"
                            onClick={toggleWindLayerVisibility}
                        >
                            <ArrowTrendingUpIcon className="h-4 w-4"/>
                        </IconButton>
                    </Tooltip>
                </div>


                <div className="flex flex-col items-center justify-center w-72">
                    <h1 className="text-xs">Temperature Bar</h1>
                    <TemparatureScale progressData={progressData}/>
                </div>
            </div>

        </div>
    )
}

export default LayerMap;
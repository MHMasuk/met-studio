import {BitmapLayer, ArcLayer} from '@deck.gl/layers';

import {EyeDropperIcon, FireIcon} from "@heroicons/react/20/solid";
import {FaThermometerFull, FaWind} from "react-icons/fa";
import ColorRemapBitmapLayer from "@/app/components/CustomLayers/ColorRemapBitmapLayer";
import {BsFillCloudLightningRainFill} from "react-icons/bs";
import {ParticleLayer} from "deck.gl-particle";
import {WiHumidity} from "react-icons/wi";

import {
    COORDINATE_SYSTEM,
} from '@deck.gl/core'

export const layers = [
    {
        id: "arc",
        label: "Arc Layer",
        icon: FireIcon,
        config: new ArcLayer({
            data: 'https://raw.githubusercontent.com/visgl/deck.gl-data/master/website/bart-segments.json',
            getSourcePosition: d => d.from.coordinates,
            getTargetPosition: d => d.to.coordinates,
            getSourceColor: [255, 200, 0],
            getTargetColor: [0, 140, 255],
            getWidth: 12,
            pickable: true,
            autoHighlight: true
        }),
    },
    {
        id: "temp",
        label: "Temperature",
        icon: FaThermometerFull,
        config: new ColorRemapBitmapLayer({
            id: `BitmapLayer with color remapping#${Math.random()}`,
            _imageCoordinateSystem: COORDINATE_SYSTEM.LNGLAT,
            // image: 'https://imgtr.ee/images/2023/10/10/65c35a75a5c03becc2450fa419f21b92.png',
            image: data[1].image_url,
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
        config: new ColorRemapBitmapLayer({
            id: `BitmapLayer with color remapping#${Math.random()}`,
            _imageCoordinateSystem: COORDINATE_SYSTEM.LNGLAT,
            // image: 'https://imgtr.ee/images/2023/10/10/65c35a75a5c03becc2450fa419f21b92.png',
            image: data[currentDataIndex].image_url,
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
            id: 'particle1',
            image: 'https://mapbox.github.io/webgl-wind/demo/wind/2016112000.png',
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
            image: data[currentDataIndex].image_url,
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
            image: 'https://imgtr.ee/images/2023/10/10/65c35a75a5c03becc2450fa419f21b92.png',
            // image: data[currentDataIndex].image_url,
            // image: "https://imgtr.ee/images/2023/10/26/34d1da852f7bd219df8428ee00607749.png",
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


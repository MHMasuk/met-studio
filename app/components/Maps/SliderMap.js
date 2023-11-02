"use client"


import 'maplibre-gl/dist/maplibre-gl.css';
import DeckGL from '@deck.gl/react';
import {COORDINATE_SYSTEM} from '@deck.gl/core'
import {BitmapLayer} from '@deck.gl/layers';

import Map from 'react-map-gl/maplibre'
import {useMemo, useState} from "react";
import ColorRemapBitmapLayer from "@/app/components/CustomLayers/ColorRemapBitmapLayer";

import chroma from "chroma-js"
import { Slider, RangeSlider } from 'rsuite';

const MainMap = () => {
    const [rgbColors, setRgbColors] = useState([])
    const [initialMapViewState, setInitialMapViewState] = useState({
        longitude: -122.4,
        latitude: 37.74,
        zoom: 11,
        maxZoom: 20,
        // pitch: 30,
        // bearing: 0
    });
    const [imageUrl, setImageUrl] = useState('https://imgtr.ee/images/2023/10/25/a3a1343c2b86bc0ee83ad8fd91a1ef17.png');
    // const [imageUrl, setImageUrl] = useState('https://raw.githubusercontent.com/visgl/deck.gl-data/master/website/sf-districts.png');
    // const [imageUrl, setImageUrl] = useState('https://imgtr.ee/images/2023/10/10/65c35a75a5c03becc2450fa419f21b92.png');
    const [data, setData] = useState([
        {
            "time": "435435",
            "image_url": "https://imgtr.ee/images/2023/10/25/a3a1343c2b86bc0ee83ad8fd91a1ef17.png"
        },
        {
            "time": "123456",
            "image_url": "https://imgtr.ee/images/2023/10/10/65c35a75a5c03becc2450fa419f21b92.png"
        },
        {
            "time": "123456",
            "image_url": "https://imgtr.ee/images/2023/10/10/65c35a75a5c03becc2450fa419f21b92.png"
        },
        {
            "time": "435435",
            "image_url": "https://imgtr.ee/images/2023/10/25/a3a1343c2b86bc0ee83ad8fd91a1ef17.png"
        },
    ]);

    const [currentDataIndex, setCurrentDataIndex] = useState(0);

    // Function to update the image URL based on the current data index
    const updateImage = () => {
        if (data.length > 0) {
            const nextIndex = (currentDataIndex + 1) % data.length;
            console.log("nextIndex", nextIndex)
            console.log("data.length", data.length)
            setCurrentDataIndex(nextIndex);
        }
    };

    useMemo(() => {
        // Initialize colors
        const colors = chroma
            .scale(['#5e4fa2', '#555ba8', '#4c66ad', '#4372b3', '#3a7eb8', '#3389bd', '#3e95b8', '#48a1b3', '#53adae', '#5eb9a9', '#69c3a5', '#77c9a5', '#85cea5', '#93d4a4', '#a1d9a4', '#afdea3', '#bbe3a1', '#c7e89e', '#d3ed9c', '#dff299', '#e8f69b', '#edf8a3', '#f2faab', '#f7fcb3', '#fcfebb', '#fffcba', '#fff6af', '#feefa4', '#fee99a', '#fee38f', '#feda86', '#fed07d', '#fdc575', '#fdbb6c', '#fdb164', '#fca55d', '#fa9757', '#f88a50', '#f67d4a', '#f47044', '#ef6545', '#e95c47', '#e2524a', '#dc494c', '#d63f4f', '#cb334d', '#c0264a', '#b41a47', '#a90d45', '#9e0142'])
            .mode('lch')
            .colors(20);
        setRgbColors(colors.map((c) => chroma(c).rgb()));

    }, []);


    const layer = new BitmapLayer({
        id: 'bitmap-layer',
        bounds: [-122.5190, 37.7045, -122.355, 37.829],
        image: 'https://raw.githubusercontent.com/visgl/deck.gl-data/master/website/sf-districts.png'
    });

    const ColorBitMapLayer = new ColorRemapBitmapLayer({
        id: `BitmapLayer with color remapping#${Math.random()}`,
        _imageCoordinateSystem: COORDINATE_SYSTEM.LNGLAT,
        image: data[currentDataIndex].image_url,
        bounds: [-180.0, -90, 180.0, 90],
        colormapData: rgbColors,
        colorRange: [
            0.0, 0.05, 0.1, 0.15, 0.2, 0.25, 0.3, 0.35, 0.4, 0.45, 0.5, 0.55, 0.6,
            0.65, 0.7, 0.75, 0.8, 0.85, 0.9, 0.95,
        ],
        pickable: true,
    })

    const layers = [ColorBitMapLayer]

    console.log(data[0])

    return (
        <div>
            <DeckGL
                // width="100%"
                // height="100%"
                layers={layers}
                initialViewState={initialMapViewState}
                controller={true}
            >
                <Map mapStyle="https://basemaps.cartocdn.com/gl/positron-gl-style/style.json"/>

            </DeckGL>
            <div className="z-50 absolute left-3 bottom-4 w-2/3">

                <button className="mb-4" onClick={updateImage}>Change Image</button>

                <br />

                <Slider
                    progress
                    defaultValue={0}
                    min={0}
                    max={3}
                    step={1}
                    onChange={value => {
                        console.log(value);
                        setCurrentDataIndex(value)
                    }}
                />

            </div>
        </div>
    )
}

export default MainMap;
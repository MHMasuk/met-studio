"use client"

import React, { useEffect, useState } from 'react';

import { Loader, Placeholder } from 'rsuite';

import LayerMap from '@/app/components/Maps/LayerMap';
import {getTemparatureData} from "@/app/components/api/layer-api/temparature-data";

const MainMap = () => {
    const [layerData, setLayerData] = useState(null);
    const [loading, setLoading] = useState(true);

    const [selectedLayer, setSelectedLayer] = useState("colorMap");

    useEffect(() => {
        getTemparatureData()
            .then((data) => {
                console.log("------------- MainMap", data);
                setLayerData(data.temp_layer_data);
                setLoading(false); // Set loading to false once data is fetched
            })
            .catch((error) => {
                console.error("Error fetching data:", error);
                setLoading(false); // Set loading to false even on error
            });
    }, []);

    return (
        <div>
            {loading ? (
                <Loader backdrop content="loading..." vertical />
            ) : (
                // Once loading is complete, display the LayerMap component with data
                <LayerMap
                    layerData={layerData}
                    selectedLayer={selectedLayer}
                    setSelectedLayer={setSelectedLayer}
                />
            )}
        </div>
    );
}

export default MainMap;
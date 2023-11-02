"use client"

import React, { useEffect, useState } from 'react';

import { Loader, Placeholder } from 'rsuite';

import LayerMap from '@/app/components/Maps/LayerMap';
import {getTemparatureData} from "@/app/components/api/layer-api/temparature-data";

const mainLayerData = [
    {
        "date": "2023-10-02",
        "image_url": "https://imgtr.ee/images/2023/10/10/65c35a75a5c03becc2450fa419f21b92.png"
    },
    {
        "date": "2023-10-01",
        "image_url": "https://imgtr.ee/images/2023/10/25/a3a1343c2b86bc0ee83ad8fd91a1ef17.png"
    },
    {
        "date": "2023-10-02",
        "image_url": "https://imgtr.ee/images/2023/10/10/65c35a75a5c03becc2450fa419f21b92.png"
    },
    {
        "date": "2023-10-03",
        "image_url": "https://imgtr.ee/images/2023/10/10/65c35a75a5c03becc2450fa419f21b92.png"
    },
    {
        "date": "2023-10-04",
        "image_url": "https://imgtr.ee/images/2023/10/26/26af366260f28b704315bbb1aa61cd32.png"
    },
    {
        "date": "2023-10-05",
        "image_url": "https://imgtr.ee/images/2023/10/10/65c35a75a5c03becc2450fa419f21b92.png"
    },
    {
        "date": "2023-10-06",
        "image_url": "https://imgtr.ee/images/2023/10/10/65c35a75a5c03becc2450fa419f21b92.png"
    },
    {
        "date": "2023-10-07",
        "image_url": "https://imgtr.ee/images/2023/10/10/65c35a75a5c03becc2450fa419f21b92.png"
    },
    {
        "date": "2023-10-08",
        "image_url": "https://imgtr.ee/images/2023/10/10/65c35a75a5c03becc2450fa419f21b92.png"
    },
    {
        "date": "2023-10-09",
        "image_url": "https://imgtr.ee/images/2023/10/10/65c35a75a5c03becc2450fa419f21b92.png"
    },
    {
        "date": "2023-10-10",
        "image_url": "https://imgtr.ee/images/2023/10/10/65c35a75a5c03becc2450fa419f21b92.png"
    },
    {
        "date": "2023-10-01",
        "image_url": "https://imgtr.ee/images/2023/10/25/a3a1343c2b86bc0ee83ad8fd91a1ef17.png"
    },
    {
        "date": "2023-10-02",
        "image_url": "https://imgtr.ee/images/2023/10/10/65c35a75a5c03becc2450fa419f21b92.png"
    },
    {
        "date": "2023-10-03",
        "image_url": "https://imgtr.ee/images/2023/10/10/65c35a75a5c03becc2450fa419f21b92.png"
    },
    {
        "date": "2023-10-04",
        "image_url": "https://imgtr.ee/images/2023/10/26/26af366260f28b704315bbb1aa61cd32.png"
    }
]

const MainMap = () => {
    const [layerData, setLayerData] = useState(mainLayerData);
    const [loading, setLoading] = useState(true);

    const [selectedLayer, setSelectedLayer] = useState("colorMap");

    // useEffect(() => {
    //     getTemparatureData()
    //         .then((data) => {
    //             console.log("------------- MainMap", data);
    //             setLayerData(data.temp_layer_data);
    //             setLoading(false); // Set loading to false once data is fetched
    //         })
    //         .catch((error) => {
    //             console.error("Error fetching data:", error);
    //             setLoading(false); // Set loading to false even on error
    //         });
    // }, []);

    return (
        <div>

                <LayerMap
                    layerData={layerData}
                    selectedLayer={selectedLayer}
                    setSelectedLayer={setSelectedLayer}
                />
        </div>
    );
}

export default MainMap;
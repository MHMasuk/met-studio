"use client";

import React from "react";
import {
    Drawer,
    Typography,
    IconButton,
    Tooltip
} from "@material-tailwind/react";
import {ChevronLeftIcon, FireIcon, MapPinIcon} from "@heroicons/react/24/solid";

export function BottomDrawer({openBottomDrawerHandle, closeBottomDrawerHandle, openBottomDrawer, locationInfo}) {
    console.log("locationInfo IN BOTTOM DRAWER", locationInfo)

    return (
        <React.Fragment>
            {/*<Tooltip content="More layers" placement="left-end">*/}
            {/*    <IconButton className="rounded-full" onClick={openBottomDrawerHandle} size="sm">*/}
            {/*        <ChevronLeftIcon className="h-4 w-4"/>*/}
            {/*    </IconButton>*/}
            {/*</Tooltip>*/}

            <Drawer open={openBottomDrawer} onClose={closeBottomDrawerHandle} overlay={false} placement={"bottom"} className="p-1 bg-blend-soft-light">
                <div className="mb-6 flex items-center justify-between">
                    <Typography variant="h5" color="blue-gray">
                        Forecast of coordinate: {locationInfo.coordinate}
                    </Typography>
                    <IconButton
                        variant="text"
                        color="blue-gray"
                        onClick={closeBottomDrawerHandle}
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={2}
                            stroke="currentColor"
                            className="h-5 w-5"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M6 18L18 6M6 6l12 12"
                            />
                        </svg>
                    </IconButton>
                </div>
                {/*<p>{locationInfo.coordinate}</p>*/}
                {/*<p>{locationInfo.x}</p>*/}
                {/*<p>{locationInfo.y}</p>*/}
            </Drawer>
        </React.Fragment>
    );
}




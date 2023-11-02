"use client";

import React from "react";
import {
    Drawer,
    Button,
    Typography,
    IconButton, Tooltip, List, ListItem, ListItemPrefix, ListItemSuffix, Chip,
} from "@material-tailwind/react";
import {ChevronLeftIcon, FireIcon, MapPinIcon} from "@heroicons/react/24/solid";

export function DrawerDefault(props) {
    const {layers, setSelectedLayer} = props
    const [open, setOpen] = React.useState(false);

    const openDrawer = () => setOpen(true);
    const closeDrawer = () => setOpen(false);

    return (
        <React.Fragment>
            <Tooltip content="More layers" placement="left-end">
                <IconButton className="rounded-full" onClick={openDrawer} size="sm">
                    <ChevronLeftIcon className="h-4 w-4"/>
                </IconButton>
            </Tooltip>

            <Drawer open={open} onClose={closeDrawer} overlay={false} placement={"right"}
                    className="p-1 bg-blend-soft-light">
                <div className="mb-6 flex items-center justify-between">
                    <Typography variant="h5" color="blue-gray">
                        Layers
                    </Typography>
                    <IconButton variant="text" color="blue-gray" onClick={closeDrawer}>
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
                <div className="mb-6 flex items-center justify-between">
                    {/*<Typography variant="h5" color="blue-gray">*/}
                    {/*    Material Tailwind*/}
                    {/*</Typography>*/}
                    <List className="p-0">

                        {layers.map((layer) => (
                            <ListItem
                                key={layer.id}
                                className="group rounded-none py-1.5 px-3 text-sm font-normal text-blue-gray-700 hover:bg-blue-500 hover:text-white focus:bg-blue-500 focus:text-white"
                                onClick={() => setSelectedLayer(layer.id)}
                            >
                                <ListItemPrefix>
                                    {<layer.icon className="h-4 w-4"/>}
                                </ListItemPrefix>
                                {layer.label}
                            </ListItem>
                        ))}
                    </List>
                </div>
            </Drawer>
        </React.Fragment>
    );
}




"use client"

import {Slider} from "rsuite";

const RSuiteSlider = (props) => {
    const {setcurrentdataindex} = props

    return (

            <Slider
                progress
                defaultValue={0}
                min={0}
                max={3}
                // step={1}
                onChange={value => {
                    console.log(value);
                    setcurrentdataindex(value)
                }}
            />

    )
}

export default RSuiteSlider
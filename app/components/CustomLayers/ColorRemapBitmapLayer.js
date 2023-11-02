import { BitmapLayer } from '@deck.gl/layers';


class ColorRemapBitmapLayer extends BitmapLayer {
    getShaders(opts) {
        return {
            ...super.getShaders(opts),
            inject: {
                'fs:#decl': `
                    uniform int maxArrayLength;
                    uniform vec3 colorMap[300];
                    uniform float colValues[300];`,
                'fs:DECKGL_FILTER_COLOR': `
                    vec3 value;
                    if (color.r < 0.0) {
                        value = vec3(0.6196078431372549, 0.00392156862745098, 0.25882352941176473);
                    } else if (color.r > 0.95) {
                        value = vec3(0.6196078431372549, 0.00392156862745098, 0.25882352941176473);
                    } else {
                        for (int i = 0; i < 22; i++) {
                            if (color.r < colValues[i]) {
                                value = colorMap[i];
                                break;
                            }
                        }
                    }
                    color.rgb = value;`
            }
        };
    }

    updateState({props, oldProps, changeFlags}) {
        super.updateState({props, oldProps, changeFlags});
        //
        // console.log("props", props)
        // console.log("oldProps", oldProps)

        if (props.highlightRed !== oldProps.highlightRed) {
            // Set the custom uniform
            this.state.model.setUniforms({
                highlightRed: props.highlightRed
            });
        }
    }

    draw(opts) {
        const { colormapData, colorRange } = this.props;
        const colorMapDataList = [];
        const colvaluesList = [];

        // for (let i = 0; i < Math.min(10, colormapData.length); i++) {
        for (let i = 0; i < colormapData.length; i++) {
            const colorMapDataItem = colormapData[i].map(x => x / 255);
            const colValue = i/10;
            colorMapDataList.push(...colorMapDataItem); // Spread the color components into the array
            colvaluesList.push(colValue);
        }

        opts.uniforms.colValues = colorRange
        // opts.uniforms.colvalues = colvaluesList
        // Ensure that the colormapDataList has a length that is a multiple of 3
        opts.uniforms.nColors = opts.uniforms.colValues.length
        const remainder = colorMapDataList.length % 3;
        if (remainder > 0) {
            const paddingLength = 3 - remainder;
            for (let i = 0; i < paddingLength; i++) {
                colorMapDataList.push(0); // Add padding with zero values
            }
        }
        opts.uniforms.colorMap = colorMapDataList;
        opts.uniforms.maxArrayLength = 300;

        super.draw(opts);
    }
}

ColorRemapBitmapLayer.layerName = 'ColorRemapBitmapLayer';

export default ColorRemapBitmapLayer;

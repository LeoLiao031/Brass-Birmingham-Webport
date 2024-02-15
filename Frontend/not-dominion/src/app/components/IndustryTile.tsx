import { Box } from "@mui/material";
import * as images from "../images/index"
import { grey } from "../utils/constants";

interface IIndustryTileProps {
    industry: string;
}

// only needs industry name asjust displaying the image with grey background
export default function IndustryTile (props: IIndustryTileProps) {
    const industryImage = images[props.industry as keyof typeof images];

    const wrappingBoxStyle = {
        backgroundImage: `url(${industryImage.src})`,
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        height: tileSize,
        width: tileSize,
        display: "flex",
        direction: "row",
        justifyContent: "space-between",
    }

    return (
        <Box sx={backgroundColorStyle}>
            <Box sx={wrappingBoxStyle}>
            </Box>
        </Box>
    )
}

const tileSize = "80px"

const backgroundColorStyle = {
    background: grey,
    height: tileSize,
    width: tileSize,
    margin: "8px", // remove this later just here for icon demonstration purposes
    perspective: "100px"
}
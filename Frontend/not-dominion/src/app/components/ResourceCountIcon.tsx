import { Box, Typography } from "@mui/material";
import { BlackCube, OrangeCube } from "../images";

interface IResourceCountIconProps {
    industry: string;
    resourceCount: number;
}

export default function ResourceCountIcon (props: IResourceCountIconProps) {
    const isCoal = props.industry.toLowerCase() == "coal"
    const resourceImage = isCoal ? BlackCube : OrangeCube

    const wrappingBoxStyle = {
        backgroundImage: `url(${resourceImage.src})`,
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        height: cubeSize,
        width: cubeSize,
        alignItems: "center",
        justifyContent: "center",
        display: "flex",
        alignContent: "center",
        position: "relative",
    }

    const resourceCountStyle = {
        fontSize: "12px",
        color: isCoal ? "#FFFFFF": "000000",
        fontWeight: "bold",
        textAlign: "center",
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)"
    }

    return(
        <Box sx={wrappingBoxStyle}>
            <Typography sx={resourceCountStyle}>
                {props.resourceCount}
            </Typography>
        </Box>
    )
}

const cubeSize = "24px"

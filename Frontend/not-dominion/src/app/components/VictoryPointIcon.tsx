import { Box, Typography } from "@mui/material"
import { PointHexagon } from "../images"

interface IVictoryPointIconProps {
    victoryPoints: number
}

export default function VictoryPointIcon (props: IVictoryPointIconProps) {
    return (
        <Box sx={wrappingBoxStyle}>
            <Typography sx={victoryPointStyle}>
                {props.victoryPoints}
            </Typography>
        </Box>
    )
}

const hexagonWidth = "14px"
const hexagonHeight = "17px"

const wrappingBoxStyle = {
    backgroundImage: `url(${PointHexagon.src})`,
    backgroundRepeat: "no-repeat",
    backgroundSize: "cover",
    height: hexagonHeight,
    width: hexagonWidth,
    alignItems: "center",
    justifyContent: "center",
    display: "flex",
    alignContent: "center",
    position: "relative",
    marginLeft: "8px",
    marginBottom: "8px"
}

const victoryPointStyle = {
    fontSize: "10px",
    color: "#FFFFFF",
    fontWeight: 300,
    textAlign: "center",
    position: "absolute",
    top: "55%",
    left: "50%",
    transform: "translate(-50%, -50%)"
}
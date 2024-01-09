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

const hexagonSize = "24px"

const wrappingBoxStyle = {
    backgroundImage: `url(${PointHexagon.src})`,
    backgroundRepeat: "no-repeat",
    backgroundSize: "cover",
    height: hexagonSize,
    width: hexagonSize,
    alignItems: "center",
    justifyContent: "center",
    display: "flex",
    alignContent: "center",
    position: "relative",
    marginLeft: "4px",
    marginBottom: "4px"
}

const victoryPointStyle = {
    fontSize: "10px",
    color: "#FFFFFF",
    fontWeight: 300,
    textAlign: "center",
    position: "absolute",
    top: "50%",
    left: "55%",
    transform: "translate(-50%, -50%)"
}
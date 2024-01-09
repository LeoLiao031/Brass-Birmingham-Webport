import { Box, Typography } from "@mui/material"
import { IncomeArrow } from "../images"

interface IIncomeIconProps {
    income: number
}

export default function IncomeIcon (props: IIncomeIconProps) {
    return (
        <Box sx={wrappingBoxStyle}>
            <Typography sx={victoryPointStyle}>
                {props.income}
            </Typography>
        </Box>
    )
}

const hexagonSize = "26px"

const wrappingBoxStyle = {
    backgroundImage: `url(${IncomeArrow.src})`,
    backgroundRepeat: "no-repeat",
    backgroundSize: "cover",
    height: hexagonSize,
    width: hexagonSize,
    alignItems: "center",
    justifyContent: "center",
    display: "flex",
    alignContent: "center",
    position: "relative",
    marginBottom: "1px"
}

const victoryPointStyle = {
    fontSize: "12px",
    color: "#000000",
    fontWeight: "bold",
    textAlign: "center",
    position: "absolute",
    top: "50%",
    left: "57%",
    transform: "translate(-50%, -50%)"
}
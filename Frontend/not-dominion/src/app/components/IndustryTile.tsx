import { Box, Typography } from "@mui/material";
import * as images from "../images/index"
import { numberToRoman } from "../utils/utils"
import BeerCostIcon from "./BeerCostIcon";
import ResourceCountIcon from "./ResourceCountIcon";
import VictoryPointIcon from "./VictoryPointIcon";
import IncomeIcon from "./IncomeIcon";
import LinkpointIcon from "./LinkpointIcon";
import { link } from "fs";

interface IIndustryTileProps {
    industry: string;
    flipped: boolean;
    tier: number;
    income: number;
    victoryPoints: number;
    linkPoints: number;
    flipCost?: number;
    resourceCount?: number;
}

export default function IndustryTile (props: IIndustryTileProps) {
    const { industry, flipped, victoryPoints, income, linkPoints } = props;
    const industryImage = images[industry as keyof typeof images];
    const flippedIndustryImage = images["Flipped"+industry as keyof typeof images]
    const tier = numberToRoman.get(props.tier)
    const flipCost = props.flipCost || 0
    const resourceCount = props.resourceCount || 0

    const wrappingBoxStyle = {
        backgroundImage: !flipped ? `url(${industryImage.src})`: `url(${flippedIndustryImage.src})`,
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        height: tileSize,
        width: tileSize,
        display: "flex",
        direction: "row",
        justifyContent: "space-between",
        margin: "8px" // remove this later just here for icon demonstration purposes
    }

    const rightColumnStyle = {
        display: "flex",
        flexDirection: "column",
        marginRight: "6px",
        marginTop: "10px",
        marginBottom: "6px",
        justifyContent: resourceCount != 0 ? "flex-end" : "none"
    }
    
    return(
        <>
            {/* Case where the tile hasn't been flipped yet */}
            {!flipped && 
                <Box sx={ wrappingBoxStyle }>
                    <Box sx={topIconBoxStyle}>
                        <Typography sx={ tierTextStyle }>
                            {tier}
                        </Typography>
                    </Box>    
                    <Box sx={ rightColumnStyle }>
                        <BeerCostIcon cost={flipCost}/>
                        {resourceCount != 0 && <ResourceCountIcon industry={industry} resourceCount={resourceCount} />}                    
                    </Box>
                 </Box>}
             {/* Case where the tile has been flipped */}
            {flipped && 
                <Box sx={ wrappingBoxStyle}>
                    <Box sx={flippedLeftColumnStyle}>
                        <Typography sx={ tierTextStyle }>
                            {tier}
                        </Typography>
                        <VictoryPointIcon victoryPoints={victoryPoints}/>
                    </Box>
                    <Box sx={flippedRightColumnStyle}>
                        <LinkpointIcon linkpoints={linkPoints}/>
                        <IncomeIcon income={income}/>
                    </Box>
                </Box>
            }
        </>
    )
}

const tileSize = "80px"

const tierTextStyle = {
    fontSize: "14px",
    color: "#e3e2c5",
    fontWeight: "bold",
    marginLeft: "8px",
    paddingTop: "8px"
}

const topIconBoxStyle = {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between"
}

const flippedLeftColumnStyle = {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between"
}

const flippedRightColumnStyle = {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "flex-end",
    marginRight: "8px",
    marginTop: "4px"
}
import { Box, Typography } from "@mui/material";
import * as images from "../images/index"
import { IndustryDataFromTile, IndustryNameFromTile, numberToRoman } from "../utils/utils"
import BeerCostIcon from "./BeerCostIcon";
import ResourceCountIcon from "./ResourceCountIcon";
import VictoryPointIcon from "./VictoryPointIcon";
import IncomeIcon from "./IncomeIcon";
import LinkpointIcon from "./LinkpointIcon";
import { Game } from "../gameplay_module/State/Game";
import { TileOnBoard } from "../gameplay_module/State/GameState";

interface IIndustryTileProps {
    gameInfo: Game;
    tile: TileOnBoard;
    colour?: string;
}

export default function IndustryTile (props: IIndustryTileProps) {
    const industry = IndustryNameFromTile(props.gameInfo, props.tile.industryIndex) || "blank"
    const flipped = props.tile.isFlipped
    const tier = numberToRoman.get(props.tile.industryLevel)
    let victoryPoints = 0
    let income = 0
    let linkPoints = 0
    let flipCost = 0
    let resourceCount = 0

    // fetch the industry data using the tileIndex number
    const industryData = IndustryDataFromTile(props.gameInfo, props.tile.industryIndex)

    if (industryData != undefined) {
        victoryPoints = industryData.victoryPoints
        income = industryData.incomeBonus
        flipCost = industryData.beerCostToFlip
        
        // switch to determine resource count as there multiple resource types
        switch(industry) {
            case "Coal": {
                resourceCount = props.tile.coal
            }
            case "Iron": {
                resourceCount = props.tile.iron
            }
            case "Brewery": {
                resourceCount = props.tile.beer
            }
        }
    }

    const industryImage = images[industry as keyof typeof images];
    const backgroundColour = props.colour || "#222426"

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

    const backgroundColorStyle = {
        background: flipped ? `linear-gradient(to bottom, black 50%, ${backgroundColour} 50%)`: backgroundColour,
        height: tileSize,
        width: tileSize,
        margin: "8px", // remove this later just here for icon demonstration purposes
        perspective: "100px"
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
                <Box sx={backgroundColorStyle}>
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
                    </Box>
                </Box>}
             {/* Case where the tile has been flipped */}
            {flipped &&
                <Box sx={backgroundColorStyle}> 
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

const cardFlipStyle = {
    position: "absolute",
    width: "100%",
    height: "100%",
    backfaceVisibility: "hidden",
    webkitBackfaceVisibility: "hidden"
}

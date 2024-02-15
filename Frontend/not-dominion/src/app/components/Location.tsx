import { Grid } from "@mui/material";
import { Town } from "../gameplay_module/State/Board";

interface ILocationProps {
    industryCount: number;
    cities: string[];
    town: Town;
}

// check the public gamestate and see if a tile has been placed in the location and if so,
// display an industry tile
export default function Location (props: ILocationProps) {
    const needTwoLayers = props.industryCount == 3 || props.industryCount == 4

    // 
    return (
        // split our gridding into 2 cases
        <>
            {/* 1 or 2 industies on one layer*/}
            {!needTwoLayers &&
                <Grid container spacing={0}>
                    <Grid item xs={12} sx={ singleLineIndustryStyle }>
                    </Grid>
                </Grid>}
            {/* 3 or 4 industries split into two layers */}
            {needTwoLayers &&
                <Grid>
                </Grid>}
        </>
    )
}

const singleLineIndustryStyle = {
    justifyContent: "center",
    alignItems: "center"
}
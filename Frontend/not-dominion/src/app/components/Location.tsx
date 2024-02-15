import { Grid } from "@mui/material";
import { Town } from "../gameplay_module/State/Board";

interface ILocationProps {
    industryCount: number;
    cities: string[];
    town: Town;
}

export default function Location (props: ILocationProps) {
    const needTwoLayers = props.industryCount == 3 || props.industryCount == 4
    return (
        // split our gridding into 2 cases
        <>
            {/* 1 or 2 industies */}
            {!needTwoLayers &&
                <Grid container spacing={0}>
                    <Grid item xs={12} sx={ singleLineIndustryStyle }>
                    </Grid>
                </Grid>}
        </>
    )
}

const singleLineIndustryStyle = {
    justifyContent: "center",
    alignItems: "center"
}
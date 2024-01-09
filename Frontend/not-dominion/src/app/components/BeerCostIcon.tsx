import Image from "next/image";
import { BeerCost } from "../images";

interface IBeerCostIconProps {
    cost: number;
}

export default function BeerCostIcon(props: IBeerCostIconProps) {
    return (
        <>
            {props.cost == 1 && <div style={singleBeerBoxStyle}>
                <Image src={BeerCost.src} alt={'BeerIcon'} width={imageSize} height={imageSize}/>
            </div>}

            {props.cost == 2 && <div style={doubleBeerBoxStyle}>
                <Image src={BeerCost.src} alt={'BeerIcon1'} width={imageSize} height={imageSize}/>
                <Image src={BeerCost.src} alt={'BeerIcon2'} width={imageSize} height={imageSize}/>
            </div>}
        </>
    );
}

const imageSize = 16

const singleBeerBoxStyle = {
}

const doubleBeerBoxStyle = {
    display: "flex",
}
import Image from "next/image";
import { Linkpoint, DoubleLinkpoint } from "../images";

interface ILinkpointIconProps {
    linkpoints: number;
}

export default function LinkpointIcon(props: ILinkpointIconProps) {
    return (
        <>
            {props.linkpoints == 1 && <Image src={Linkpoint.src} alt={'LinkIcon'} width={imageSize} height={imageSize}/>
            }

            {props.linkpoints == 2 && <Image src={DoubleLinkpoint.src} alt={'DoubleLinkIcon'} width={imageSize*1.4} height={imageSize*1.4} style={ doubleLinkImageStyling }/>
            }       
        </>
    );
}

const imageSize = 20

const doubleLinkImageStyling = {
    marginTop: "6px"
}
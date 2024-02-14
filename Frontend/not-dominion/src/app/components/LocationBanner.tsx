interface ILocationBannerProps {
    bannerText: string,
    bannerColour: string
}

export default function LocationBanner (props: ILocationBannerProps) {
    const bannerStyling = {
        background: props.bannerColour,
    }
    return (
        // can try looking into MUI box + typography as the middle of the banner
        // then can add the wavy edge bits after
        <>
        </>
    )
}

const bannerTextSize = "12px"


import { useStyle } from 'src/hooks/useStyle';
import { GiphyGIFPoweredByStyles } from 'src/utils/cssStyles';
import PoweredByGiphyLogo from 'src/assets/PoweredByGiphyLogo';

const PoweredByGiphy = () => {
    useStyle('PoweredByGiphy', GiphyGIFPoweredByStyles);

    return (
        <div className="reactGiphySearchbox-poweredByGiphy">
            <PoweredByGiphyLogo />
        </div>
    )
}

export default PoweredByGiphy

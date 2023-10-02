import { useStyle } from 'src/hooks/useStyle';
import { GiphyGIFSpinnerStyles } from 'src/utils/cssStyles';
import SpinnerIcon from '../../assets/SpinnerIcon'

type Props = {
    message: string,
    image?: string | null
}

const Spinner = (props: Props) => {
    const { message, image } = props;
    useStyle('Spinner', GiphyGIFSpinnerStyles);

    return (
        <div role="status" className="reactGiphySearchbox-spinnerWrapper">
            <div className="reactGiphySearchbox-spinner" data-testid="Spinner">
                {image ? <img src={image} alt="Loading icon" /> : <SpinnerIcon />}
            </div>

            <div
                className="reactGiphySearchbox-spinnerText"
                data-testid="SpinnerText"
            >
                {message}
            </div>
        </div>
    );
}

export default Spinner;
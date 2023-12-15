import { useStyle } from 'src/hooks/useStyle';
import { GiphyGIFAlertStyles } from 'src/utils/cssStyles';

type Props = {
  message: string
}

const Alert = (props : Props) => {
    const { message } = props;
    useStyle('Alert', GiphyGIFAlertStyles);

    return (
        <p
            role="alert"
            data-testid="Alert"
            className="reactGiphySearchbox-message"
        >
            {message}
        </p>
    );
}

export default Alert;
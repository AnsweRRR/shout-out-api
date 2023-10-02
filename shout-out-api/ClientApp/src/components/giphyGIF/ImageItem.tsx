import { useStyle } from 'src/hooks/useStyle';
import { GiphyGIFImageItemStyles } from 'src/utils/cssStyles';
import { ImageRenditionFileType } from 'src/@types/feed';

type Props = {
    backgroundColor: string,
    item: any,
    imageRenditionName: string,
    imageRenditionFileType: ImageRenditionFileType,
    onSelect: Function,
    size: number,
}

const getUrl = (fileType: ImageRenditionFileType): string => {
    if (fileType === 'gif') {
        return 'url';
    }

    return fileType;
}

const ImageItem = (props: Props) => {
    const {backgroundColor, item, imageRenditionName, imageRenditionFileType, size, onSelect } = props;
    useStyle('ImageItem', GiphyGIFImageItemStyles);

    console.log(item);

    return (
        <button
            data-testid="ImageItemButton"
            type="button"
            className="reactGiphySearchbox-imageButton"
            style={{
                backgroundColor,
                width: `${size}px`,
                height: `${(item.images[imageRenditionName].height * size) /
                item.images[imageRenditionName].width}px`,
            }}
            onClick={() => onSelect(item)}
        >
            <img
                data-testid="ImageItemImage"
                width={item.images[imageRenditionName].width}
                height={item.images[imageRenditionName].height}
                alt={item.title}
                src={item.images[imageRenditionName][getUrl(imageRenditionFileType)]}
                className="reactGiphySearchbox-image"
            />
        </button>
    )
}

export default ImageItem
// @mui
import { alpha } from '@mui/material/styles';

// ----------------------------------------------------------------------

type BgBlurProps = {
  blur?: number;
  opacity?: number;
  color?: string;
  imgUrl?: string;
};

export function bgBlur(props?: BgBlurProps) {
  const color = props?.color || '#000000';
  const blur = props?.blur || 6;
  const opacity = props?.opacity || 0.8;
  const imgUrl = props?.imgUrl;

  if (imgUrl) {
    return {
      position: 'relative',
      backgroundImage: `url(${imgUrl})`,
      '&:before': {
        position: 'absolute',
        top: 0,
        left: 0,
        zIndex: 9,
        content: '""',
        width: '100%',
        height: '100%',
        backdropFilter: `blur(${blur}px)`,
        WebkitBackdropFilter: `blur(${blur}px)`,
        backgroundColor: alpha(color, opacity),
      },
    } as const;
  }

  return {
    backdropFilter: `blur(${blur}px)`,
    WebkitBackdropFilter: `blur(${blur}px)`,
    backgroundColor: alpha(color, opacity),
  };
}

// ----------------------------------------------------------------------

type BgGradientProps = {
  direction?: string;
  color?: string;
  startColor?: string;
  endColor?: string;
  imgUrl?: string;
};

export function bgGradient(props?: BgGradientProps) {
  const direction = props?.direction || 'to bottom';
  const startColor = props?.startColor;
  const endColor = props?.endColor;
  const imgUrl = props?.imgUrl;
  const color = props?.color;

  if (imgUrl) {
    return {
      background: `linear-gradient(${direction}, ${startColor || color}, ${
        endColor || color
      }), url(${imgUrl})`,
      backgroundSize: 'cover',
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'center center',
    };
  }

  return {
    background: `linear-gradient(${direction}, ${startColor}, ${endColor})`,
  };
}

// ----------------------------------------------------------------------

export function textGradient(value: string) {
  return {
    background: `-webkit-linear-gradient(${value})`,
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  };
}

// ----------------------------------------------------------------------

export function filterStyles(value: string) {
  return {
    filter: value,
    WebkitFilter: value,
    MozFilter: value,
  };
}

// ----------------------------------------------------------------------

export const hideScrollbarY = {
  msOverflowStyle: 'none',
  scrollbarWidth: 'none',
  overflowY: 'scroll',
  '&::-webkit-scrollbar': {
    display: 'none',
  },
} as const;

// ----------------------------------------------------------------------

export const hideScrollbarX = {
  msOverflowStyle: 'none',
  scrollbarWidth: 'none',
  overflowX: 'scroll',
  '&::-webkit-scrollbar': {
    display: 'none',
  },
} as const;


// ----------------------------------------------------------------------

export const GiphyGIFSearchBoxStyles = `
  .reactGiphySearchbox-componentWrapper {
    box-sizing: border-box;
  }

  .reactGiphySearchbox-componentWrapper *,
  .reactGiphySearchbox-componentWrapper *:before,
  .reactGiphySearchbox-componentWrapper *:after {
    box-sizing: inherit;
  }

  .reactGiphySearchbox-listWrapper {
    overflow-y: auto;
  }
`;

export const GiphyGIFSearchFormStyles = `
  .reactGiphySearchbox-searchForm-form {
    position: relative;
    margin-bottom: 10px;
  }

  .reactGiphySearchbox-searchForm-input {
    padding: 6px 4px;
    width: 100%;
    font-size: 1em;
    font-family: inherit;
    outline: none;
    border: 1px solid #ddd;
  }

  .reactGiphySearchbox-searchForm-input:focus {
    border-color: #bbb;
  }
`;

export const GiphyGIFSpinnerStyles = `
  .reactGiphySearchbox-spinnerWrapper {
    text-align: center;
    padding-bottom: 10px;
  }

  .reactGiphySearchbox-spinner {
    display: inline-block;
    vertical-align: middle;
    width: 20px;
    height: 20px;
    background-size: contain;
    animation: spin 500ms linear infinite;
  }

  .reactGiphySearchbox-spinner img {
    display: block;
    width: 100%;
  }

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }

  .reactGiphySearchbox-spinnerText {
    border: 0;
    clip: rect(1px, 1px, 1px, 1px);
    -webkit-clip-path: inset(50%);
    clip-path: inset(50%);
    height: 1px;
    overflow: hidden;
    padding: 0;
    position: absolute;
    width: 1px;
    white-space: nowrap;
  }
`;

export const GiphyGIFAlertStyles = `
  .reactGiphySearchbox-message {
    margin: 0;
  }
`;

export const GiphyGIFImageItemStyles = `
  .reactGiphySearchbox-imageButton {
    color: inherit;
    border: none;
    padding: 0;
    font: inherit;
    cursor: pointer;
    outline: inherit;
    animation: fadeIn 300ms ease-in;
  }

  .reactGiphySearchbox-imageButton:focus {
    opacity: 0.6;
  }

  .reactGiphySearchbox-image {
    display: block;
    width: 100%;
    height: auto;
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
`;

export const GiphyGIFPoweredByStyles = `
  .reactGiphySearchbox-poweredByGiphy {
    padding-top: 10px;
    width: 100px;
  }

  .reactGiphySearchbox-poweredByGiphy img {
    display: block;
    width: 100%;
  }
`;
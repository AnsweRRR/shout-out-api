export const getMasonryConfig = (masonryConfig: any) =>
    masonryConfig
        .map((c: any) => ({
            columns: c.columns,
            imageWidth: c.imageWidth,
            gutter: c.gutter,
            }))
        .reverse();

export const getMasonryConfigExceptLast = (masonryConfig: any) => {
    const returnedMasonryConfig = getMasonryConfig(masonryConfig);

    return returnedMasonryConfig.slice(0, returnedMasonryConfig.length - 1);
}

export const getDefaultMasonryConfig = (masonryConfig: any) => {
    const returnedMasonryConfig = getMasonryConfig(masonryConfig);

    return returnedMasonryConfig[returnedMasonryConfig.length - 1];
}

export const getMediaBreakpoints = (masonryConfig: any) =>
    // Export in a reverse order `mp` property in an array and filter out undefined items (the `mq` param
    // for first array item is undefined since you don't have to specify it).
    masonryConfig
        .map((c: any) => c.mq && `(min-width: ${c.mq})`)
        .filter((i: any) => i != null)
        .reverse();

export const getComponentWrapperWidth = (masonryConfig: any) => masonryConfig.imageWidth * masonryConfig.columns + masonryConfig.gutter * (masonryConfig.columns - 1);
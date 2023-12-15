import { useEffect, useState } from 'react'

export default function useMedia(queries: any, values: any, defaultValue: any) {
    const mediaQueryLists = queries.map((q: any) => window.matchMedia(q))

    const getValue = () => {
        // Get index of first media query that matches
        const index = mediaQueryLists.findIndex((mql: any) => mql.matches)
        // Return related value or defaultValue if none
        return typeof values[index] !== 'undefined' ? values[index] : defaultValue
    }

    // State and setter for matched value
    const [value, setValue] = useState(getValue)

    useEffect(() => {
        const handler = () => setValue(getValue)

        // Set a listener for each media query with above handler as callback.
        mediaQueryLists.forEach((mql: any) => mql.addListener(handler))

        // Remove listeners on cleanup
        return () => mediaQueryLists.forEach((mql: any) => mql.removeListener(handler))
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return value;
}
import { useRef, useEffect, Children, ReactElement } from 'react';
import Bricks, { SizeDetail } from 'bricks.js';

type Props = {
  children: ReactElement,
  sizes: Array<SizeDetail>,
}

const MasonryLayout = (props : Props) => {
    const { children, sizes } = props;
    const container = useRef<any>(null);

    useEffect(() => {
        const bricks = Bricks({
            container: container.current,
            packed: 'data-packed',
            sizes,
            position: true
        })

        bricks.resize(true)

        if (Children.count(children) > 0) {
            bricks.pack()
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [children]);

    return (
        <div ref={container} data-testid="MasonryLayoutContainer">
            {children}
        </div>
    );
}

export default MasonryLayout;
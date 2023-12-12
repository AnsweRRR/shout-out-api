import { useEffect } from "react";
import { setHubConnection } from "src/redux/signalRHubSlicer";
import { useDispatch } from "src/redux/store";
import { hubConnectionBuilder, startHubConnection } from "./signalRHub";

type Props = {
    children: React.ReactNode;
};  

export default function SignalRHubProvider({ children }: Props) {
    const dispatch = useDispatch();

    useEffect(() => {
        const connection = hubConnectionBuilder();
        dispatch(setHubConnection(connection));

        startHubConnection(connection);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <>
            {children}
        </>
    )
}
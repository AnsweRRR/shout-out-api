import { useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { Container } from '@mui/material';
import { useAuthContext } from "src/auth/useAuthContext";
import PointSystemFeed from "src/components/point-system/PointSystemFeed";
import { dispatch } from "src/redux/store";
import { UpdateUsersActionPayload } from "src/redux/reducersAndActionsTypes/usersActionAndReducerTypes";
import { endFetchUsers, initalizeFetchUsers, updateUsers } from "src/redux/reducersAndActions/usersActionAndReducer";
import { getUsersAsync } from "src/api/userClient";
import { useSettingsContext } from '../../components/settings';


export default function FeedPage() {
    const { themeStretch } = useSettingsContext();
    const { user } = useAuthContext();

    useEffect(() => {
        const fethData = async () => {
            if (user) {
                try {
                    dispatch(initalizeFetchUsers());
                    const result = await getUsersAsync(user?.accessToken);
                    const { data } = result;
                    const payload: UpdateUsersActionPayload = {
                        users: data
                    }
                    dispatch(updateUsers(payload));
                    dispatch(endFetchUsers());
                }
                catch(error) {
                    dispatch(endFetchUsers());
                }
            }
        }

        fethData();
    }, [user]);

    return (
        <>
            <Helmet>
                <title>ShoutOut Feed</title>
            </Helmet>

            <Container maxWidth={themeStretch ? false : 'lg'}>
                <PointSystemFeed />
            </Container>
        </>
    );
}
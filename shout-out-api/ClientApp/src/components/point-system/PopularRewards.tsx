import { Avatar, Card, Divider, Stack, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { Reward } from "src/@types/reward";
import { getMostPopularRewardsAsync } from "src/api/rewardClient";
import { useAuthContext } from "src/auth/useAuthContext";
import useLocales from "src/locales/useLocales";

export default function PopularRewards() {
    const { user } = useAuthContext();
    const { translate } = useLocales();
    const [popularRewards, setPopularRewards] = useState<Array<Reward>>([]);

    useEffect(() => {
        const getRewards = async () => {
            if (user) {
                const result = await getMostPopularRewardsAsync(user?.accessToken);
                setPopularRewards(result.data);
            }
        }
        getRewards();
    }, [user]);

    return (
        <Stack sx={{ marginTop: 42 }}>
            <Typography>{`${translate('FeedPage.PopularRewards')}`}</Typography>
            {popularRewards.map(reward => (
                <Card key={reward.id} sx={{ p: 2, marginBottom: 1 }}>
                    <Stack direction="row" alignItems="center" spacing={2}>
                        <Avatar
                            alt={reward.name!}
                            src={reward.avatar as unknown as string}
                        />
                        <Typography>{reward.name}</Typography>
                        <Typography>{reward.cost}</Typography>
                    </Stack>
                </Card>
            ))}
        </Stack>
    );
}
import { Stack, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { _socials } from "src/assets/_socials";
import axios from "src/utils/axios";

export default function VersionInfo() {
    const [versionInfo, setVersionInfo] = useState<string>('');

    async function getVersionInfoAsync() {
        try {
            const response = await axios.get(`/api/versionInfo`);
            return response;
        }
        catch(error) {
            console.error(error);
            throw error;
        }
    }

    useEffect(() => {
        const fetchData = async () => {
            const result = await getVersionInfoAsync();
            const { data } = result;
            setVersionInfo(data)
        }

        fetchData();
    }, []);

    return (
        <Stack direction="row" alignItems="center" justifyContent="center" sx={{ mb: 1 }}>
            <Typography>{versionInfo}</Typography>
        </Stack>
    );
}
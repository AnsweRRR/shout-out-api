import { useEffect, useState } from "react";
import { IconButton, Stack, Tooltip, alpha } from "@mui/material";
import { useAuthContext } from "src/auth/useAuthContext";
import { getSocialInfo } from "src/api/socialClient";
import Iconify from "../iconify";

export default function Socials() {
  const { user } = useAuthContext();
  const [socials, setSocials] = useState<Array<any>>([]);

  useEffect(() => {
    const controller = new AbortController();

    const getSocialInfoAsync = async () => {
      const { signal } = controller;
      const result = await getSocialInfo(user?.accessToken, signal);
      const { data } = result;
      setSocials(data);
    }

    getSocialInfoAsync();

    return () => controller.abort();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
      <Stack direction="row" alignItems="center" justifyContent="center" sx={{ mt: 1 }}>
      {socials.map((social) => (
        <Tooltip key={social.name} title={social.name}>
          <IconButton
            href={social.value === 'email' ? `mailto:${social.path}` : social.path}
            target="_blank"
            sx={{
              color: social.color,
              '&:hover': {
                bgcolor: alpha(social.color, 0.08),
              },
            }}
          >
            <Iconify icon={social.icon} />
          </IconButton>
        </Tooltip>
      ))}
    </Stack>
  );
}
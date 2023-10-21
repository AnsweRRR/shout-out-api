import { IconButton, Stack, alpha } from "@mui/material";
import { _socials } from "src/assets/_socials";
import Iconify from "../iconify";

export default function Socials() {
    return (
        <Stack direction="row" alignItems="center" justifyContent="center" sx={{ mt: 1, mb: 3 }}>
        {_socials.map((social) => (
          <IconButton
            href={social.path}
            target="_blank"
            key={social.name}
            sx={{
              color: social.color,
              '&:hover': {
                bgcolor: alpha(social.color, 0.08),
              },
            }}
          >
            <Iconify icon={social.icon} />
          </IconButton>
        ))}
      </Stack>
    );
}
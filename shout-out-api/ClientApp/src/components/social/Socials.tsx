import { IconButton, Stack, Tooltip, alpha } from "@mui/material";
import { _socials } from "src/assets/_socials";
import Iconify from "../iconify";

export default function Socials() {
    return (
        <Stack direction="row" alignItems="center" justifyContent="center" sx={{ mt: 1 }}>
        {_socials.map((social) => (
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
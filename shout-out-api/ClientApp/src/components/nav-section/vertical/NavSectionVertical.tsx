import { List, Stack } from '@mui/material';
import { _socials } from 'src/assets/_socials';
import Socials from 'src/components/social/Socials';
import { useLocales } from '../../../locales';
import { NavSectionProps } from '../types';
import { StyledSubheader } from './styles';
import NavList from './NavList';


export default function NavSectionVertical({ data, sx, ...other }: NavSectionProps) {
  const { translate } = useLocales();

  return (
    <Stack sx={sx} {...other}>
      {data.map((group) => {
        const key = group.subheader || group.items[0].title;

        return (
          <List key={key} disablePadding sx={{ px: 2 }}>
            {group.subheader && (
              <StyledSubheader disableSticky>{`${translate(group.subheader)}`}</StyledSubheader>
            )}

            {group.items.map((list) => (
              <NavList
                key={list.title + list.path}
                data={list}
                depth={1}
                hasChild={!!list.children}
              />
            ))}
          </List>
        );
      })}

      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-end' }}>
        <div style={{ position: 'absolute', bottom: 0 }}>
          <Socials />
        </div>
      </div>
    </Stack>
  );
}

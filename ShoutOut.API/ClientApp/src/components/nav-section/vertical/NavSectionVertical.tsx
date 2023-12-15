import { useState } from 'react';
import { List, Stack } from '@mui/material';
import Socials from 'src/components/social/Socials';
import VersionInfo from 'src/components/versionInfo/VersionInfo';
import { m } from 'framer-motion';
import { useLocales } from '../../../locales';
import { NavSectionProps } from '../types';
import { StyledSubheader } from './styles';
import NavList from './NavList';

const hiddenMask = `repeating-linear-gradient(to right, rgba(0,0,0,0) 0px, rgba(0,0,0,0) 30px, rgba(0,0,0,1) 30px, rgba(0,0,0,1) 30px)`;
const visibleMask = `repeating-linear-gradient(to right, rgba(0,0,0,0) 0px, rgba(0,0,0,0) 0px, rgba(0,0,0,1) 0px, rgba(0,0,0,1) 30px)`;

export default function NavSectionVertical({ data, sx, ...other }: NavSectionProps) {
  const { translate } = useLocales();

  const [isInView, setIsInView] = useState(false);

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
          <m.div
            initial={false}
            animate={
              isInView
                ? { WebkitMaskImage: visibleMask, maskImage: visibleMask }
                : { WebkitMaskImage: hiddenMask, maskImage: hiddenMask }
            }
            transition={{ duration: 0.3, delay: 0.1 }}
            viewport={{ once: true }}
            onViewportEnter={() => setIsInView(true)}
          >
            <Socials />
            <VersionInfo />
          </m.div>
        </div>
      </div>
    </Stack>
  );
}

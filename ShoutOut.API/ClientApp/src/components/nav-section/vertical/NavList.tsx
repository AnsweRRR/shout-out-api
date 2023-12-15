import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuthContext } from 'src/auth/useAuthContext';
import { Collapse } from '@mui/material';
import useActiveLink from '../../../hooks/useActiveLink';
import { NavListProps } from '../types';
import NavItem from './NavItem';

// ----------------------------------------------------------------------

type NavListRootProps = {
  data: NavListProps;
  depth: number;
  hasChild: boolean;
};

export default function NavList({ data, depth, hasChild }: NavListRootProps) {
  const { active, isExternalLink } = useActiveLink(data.path);
  const [open, setOpen] = useState(true);

  const handleToggle = () => {
    setOpen(!open);
  };

  return (
    <>
      <NavItem
        item={data}
        depth={depth}
        open={open}
        active={active}
        isExternalLink={isExternalLink}
        onClick={handleToggle}
      />

      {hasChild && (
        <Collapse in={open} unmountOnExit>
          <NavSubList data={data.children} depth={depth} />
        </Collapse>
      )}
    </>
  );
}

// ----------------------------------------------------------------------

type NavListSubProps = {
  data: NavListProps[];
  depth: number;
};

function NavSubList({ data, depth }: NavListSubProps) {
  const { user } = useAuthContext();

  return (
    <>
      {data.map((list) => (
        (list.roles && list.roles?.includes(user?.role) || list.roles === undefined) &&
          <NavList
            key={list.title + list.path}
            data={list}
            depth={depth + 1}
            hasChild={!!list.children}
          />
      ))}
    </>
  );
}

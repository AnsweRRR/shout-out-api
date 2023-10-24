import { useEffect, useState } from 'react';
import {
  Box,
  Stack,
  List,
  Badge,
  Avatar,
  Tooltip,
  Divider,
  IconButton,
  Typography,
  ListItemText,
  ListItemAvatar,
  ListItem,
  Menu,
  MenuItem,
} from '@mui/material';
import { TFunctionDetailedResult } from 'i18next';
import InfiniteScroll from 'react-infinite-scroller';
import { useAuthContext } from 'src/auth/useAuthContext';
import { useLocales } from 'src/locales';
import { getNotificationsAsync, getAmountOfUnreadNotificationsAsync, markAllNotificationAsReadAsync, markNotificationAsUnReadAsync } from 'src/api/notificationClient';
import { EventTypes, NotificationItem as NotificationItemDto } from 'src/@types/notification';
import Spinner from 'src/components/giphyGIF/Spinner';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import CakeIcon from '@mui/icons-material/Cake';
import MilitaryTechIcon from '@mui/icons-material/MilitaryTech';
import RedeemIcon from '@mui/icons-material/Redeem';
import RequestPageIcon from '@mui/icons-material/RequestPage';
import { fToNow } from '../../../utils/formatTime';
import Iconify from '../../../components/iconify';
import MenuPopover from '../../../components/menu-popover';
import { IconButtonAnimate } from '../../../components/animate';

export default function NotificationsPopover() {
  const { user } = useAuthContext();
  const { translate } = useLocales();
  const [openPopover, setOpenPopover] = useState<HTMLElement | null>(null);
  const [notifications, setNotifications] = useState<Array<NotificationItemDto>>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isLastPage, setIsLastPage] = useState<boolean>(false);
  const [offset, setOffset] = useState<number>(0);
  const eventPerPage = 10;
  const [totalUnRead, setTotalUnRead] = useState<number>(notifications.filter((item: NotificationItemDto) => item.isRead === false).length);

  const handleOpenPopover = (event: React.MouseEvent<HTMLElement>) => {
    setOpenPopover(event.currentTarget);
  };

  const handleClosePopover = () => {
    setOpenPopover(null);
    setNotifications([]);
    setIsLastPage(false);
    setIsLoading(false);
    setOffset(0);
  };

  const handleMarkAllAsRead = async () => {
    if (user) {
      const result = await markAllNotificationAsReadAsync(user?.accessToken);
      if (result.status === 200) {
        const notificationItems = notifications.map((notification: NotificationItemDto) => {
          notification.isRead = true;
          return notification;
        });
        setNotifications(notificationItems);
        setTotalUnRead(notificationItems.filter((item: NotificationItemDto) => item.isRead === false).length);
      }
    }
  };

  useEffect(() => {
    const getNotifications = async () => {
      if (user) {
        setIsLoading(true);
        const result = await getNotificationsAsync(offset, eventPerPage, user?.accessToken);
        const items = result.data as Array<NotificationItemDto>;
        if (items.length < eventPerPage) {
          setIsLastPage(true);
        }
        else {
          setIsLastPage(false);
        }
        setNotifications(prevState => [...prevState, ...items]);
        setIsLoading(false);
      }
    }

    const getAmountOfUnreadNotifications = async () => {
      if (user) {
        const result = await getAmountOfUnreadNotificationsAsync(user?.accessToken);
        const { data } = result;
        setTotalUnRead(data);
      }
    }

    if (openPopover){
      getNotifications();
    } else {
      getAmountOfUnreadNotifications();
    }
    
  }, [user, offset, openPopover]);

  return (
    <>
      <IconButtonAnimate
        color={openPopover ? 'primary' : 'default'}
        onClick={handleOpenPopover}
        sx={{ width: 40, height: 40 }}
      >
        <Badge badgeContent={totalUnRead} color="error">
          <Iconify icon="eva:bell-fill" />
        </Badge>
      </IconButtonAnimate>

      <MenuPopover open={openPopover} onClose={handleClosePopover} sx={{ width: 360, p: 0 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', py: 2, px: 2.5 }}>
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="subtitle1">{`${translate('NotificationPopover.Notifications')}`}</Typography>
          </Box>

          {totalUnRead > 0 && (
            <Tooltip title={`${translate('NotificationPopover.MarkAllAsRead')}`}>
              <IconButton color="primary" onClick={handleMarkAllAsRead}>
                <Iconify icon="eva:done-all-fill" />
              </IconButton>
            </Tooltip>
          )}
        </Box>

        <Divider sx={{ borderStyle: 'dashed' }} />
        
        <List disablePadding style={{ overflowY: 'auto', height: '500px' }} >
          <InfiniteScroll
            pageStart={0}
            loadMore={(page: number) => {
              if (openPopover !== null) {
                setOffset(page * eventPerPage);
              }
              else {
                setOffset(0);
              }
            }}
            hasMore={!isLoading && !isLastPage}
            useWindow={false}
            initialLoad={false}
            loader={(
              <div key="loading">
                {isLoading && <Spinner message={`${translate(`FeedPage.Loading`)}`} image={null} />}
              </div>
            )}
          >
            {notifications.map((notification: NotificationItemDto) => (
              <NotificationItem key={notification.id} notification={notification} />
            ))}
          </InfiniteScroll>
        </List>
      </MenuPopover>
    </>
  );
}

// ----------------------------------------------------------------------

function NotificationItem({ notification }: { notification: NotificationItemDto }) {
  const { translate } = useLocales();
  const { user } = useAuthContext();
  const { avatar, title } = renderContent(notification, translate);
  const [anchorEl, setAnchorEl] = useState(null);
  const [isMenuOpen, setMenuOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleMenuOpen = (event: any) => {
    event.stopPropagation()
    setMenuOpen(true);
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = (event: any) => {
    event.stopPropagation()
    setMenuOpen(false);
    setAnchorEl(null);
  };

  const handleMarkAsUnread = async () => {
    setMenuOpen(false);
    setAnchorEl(null);
    setIsLoading(true);
    if (user) {
      const result = await markNotificationAsUnReadAsync(notification.id, user?.accessToken);
      if (result.status === 200) {
        const { data } = result;
        notification.isRead = data.isRead;
      }
      setIsLoading(false);
    }
  }

  return (
    <ListItem
      sx={{
        py: 1.5,
        px: 2.5,
        mt: '1px',
        ...(notification?.isRead === false && {
          bgcolor: 'action.selected',
        }),
      }}
    >
      <ListItemAvatar>
        <Avatar sx={{ bgcolor: 'background.neutral' }}>{avatar}</Avatar>
      </ListItemAvatar>

      <ListItemText
        disableTypography
        primary={title}
        secondary={
          <Stack direction="row" sx={{ mt: 0.5, typography: 'caption', color: 'text.disabled' }}>
            <Iconify icon="eva:clock-fill" width={16} sx={{ mr: 0.5 }} />
            <Typography variant="caption">{fToNow(notification.dateTime)}</Typography>
          </Stack>
        }
      />
      {notification.isRead === true && !isLoading &&
        <IconButton onClick={handleMenuOpen}>
          <MoreHorizIcon />
        </IconButton>
      }
      
      <Menu
        anchorEl={anchorEl}
        open={isMenuOpen}
        onClose={handleMenuClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <MenuItem
          onClick={(event) => {
            event.stopPropagation();
            handleMarkAsUnread();
          }}
        >
          {`${translate('NotificationPopover.MarkAsUnread')}`}
        </MenuItem>
      </Menu>
    </ListItem>
  );
}

// ----------------------------------------------------------------------

function renderContent(notification: NotificationItemDto, translate: (text: string, options?: any) => TFunctionDetailedResult<object>) {
  let titleText = '';
  let avatarImage = null;

  switch (notification.eventType) {
    case EventTypes.GetPointsByUser:
      titleText = `${translate('NotificationPopover.YouGotPointsFromSomeone', {pointAmount: notification.pointAmount, senderUser: notification.senderUserName})}`;
      avatarImage = <RedeemIcon color='primary' />
      break;
    case EventTypes.GetPointsByBirthday:
      titleText = `${translate('NotificationPopover.HappyBirthday', {pointAmount: notification.pointAmount})}`;
      avatarImage = <CakeIcon color='primary' />
      break;
    case EventTypes.GetPointsByJoinDate:
      titleText = `${translate('NotificationPopover.ThankYouForYourService', {pointAmount: notification.pointAmount})}`;
      avatarImage = <MilitaryTechIcon color='primary' />
      break;
    case EventTypes.RewardClaimed:
      titleText = `${translate('NotificationPopover.RewardClaimedBySomeone', {reward: notification.rewardName, claimerUser: notification.senderUserName})}`;
      avatarImage = <RequestPageIcon color='primary' />
      break;
    default:
      titleText = '';
      break;
  }

  return {
    avatar: avatarImage,
    title: <Typography variant="subtitle2">{titleText}</Typography>,
  };
}

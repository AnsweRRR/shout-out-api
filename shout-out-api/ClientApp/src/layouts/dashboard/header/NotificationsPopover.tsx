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
  ListItemButton,
} from '@mui/material';
import { TFunctionDetailedResult } from 'i18next';
import InfiniteScroll from 'react-infinite-scroller';
import { useAuthContext } from 'src/auth/useAuthContext';
import { useLocales } from 'src/locales';
import { getNotificationsAsync, getAmountOfUnreadNotificationsAsync, markAllNotificationAsReadAsync } from 'src/api/notificationClient';
import { EventTypes, NotificationItem as NotificationItemDto } from 'src/@types/notification';
import Spinner from 'src/components/giphyGIF/Spinner';
import { fToNow } from '../../../utils/formatTime';
import Iconify from '../../../components/iconify';
import Scrollbar from '../../../components/scrollbar';
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
  const [totalUnRead, setTotalUnRead] = useState<number>(notifications.filter((item: any) => item.isUnRead === true).length);

  const handleOpenPopover = (event: React.MouseEvent<HTMLElement>) => {
    setOpenPopover(event.currentTarget);
  };

  const handleClosePopover = () => {
    setNotifications([]);
    setOpenPopover(null);
  };

  const handleMarkAllAsRead = async () => {
    if (user) {
      const result = await markAllNotificationAsReadAsync(user?.accessToken);
      if (result.status === 200) {
        setOpenPopover(null);
      }
    }
  };

  useEffect(() => {
    const getNotifications = async () => {
      if (user) {
        const result = await getNotificationsAsync(offset, eventPerPage, user?.accessToken);
        const items = result.data as Array<NotificationItemDto>;
        if (items.length < eventPerPage) {
          setIsLastPage(true);
        }
        else {
          setIsLastPage(false);
        }
        setNotifications(prevState => [...prevState, ...items]);
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

      <MenuPopover open={openPopover} onClose={handleClosePopover} sx={{ width: 360, p: 0, height: 500, overflow: 'auto' }}>
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
        
        <List disablePadding>
          <InfiniteScroll
            pageStart={0}
            loadMore={(page: number) => setOffset(page * eventPerPage)}
            hasMore={!isLoading && !isLastPage}
            // useWindow={false}
            initialLoad={false}
            loader={(
              <div key="loading">
                {isLoading && <Spinner message={`${translate(`FeedPage.Loading`)}`} image={null} />}
              </div>
            )}
          >
            {notifications.map((notification: any) => (
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
  const { avatar, title } = renderContent(notification, translate);

  return (
    <ListItemButton
      sx={{
        py: 1.5,
        px: 2.5,
        mt: '1px',
        ...(!notification.isRead && {
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
    </ListItemButton>
  );
}

// ----------------------------------------------------------------------

function renderContent(notification: NotificationItemDto, translate: (text: any, options?: any) => TFunctionDetailedResult<object>) {
  let titleText = '';
  const avatarImage = null; // avatarImage = <img alt={titleText} src="/assets/icons/notification/ic_mail.svg"

  switch (notification.eventType) {
    case EventTypes.GetPointsByUser:
      titleText = `${translate('NotificationPopover.YouGotPointsFromSomeone', {pointAmount: notification.pointAmount, senderUser: notification.senderUserName})}`;
      break;
    case EventTypes.GetPointsByBirthday:
      titleText = `${translate('NotificationPopover.HappyBirthday', {pointAmount: notification.pointAmount})}`;
      break;
    case EventTypes.GetPointsByJoinDate:
      titleText = `${translate('NotificationPopover.ThankYouForYourService', {pointAmount: notification.pointAmount})}`;
      break;
    case EventTypes.RewardClaimed:
      titleText = `${translate('NotificationPopover.RewardClaimedBySomeone', {reward: notification.rewardName, claimerUser: notification.senderUserName})}`;
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

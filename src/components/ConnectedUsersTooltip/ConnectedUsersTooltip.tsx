import { useEffect, useMemo, useState } from 'react';
import useWebSocket, { ReadyState } from 'react-use-websocket';
import {
  Badge,
  Box,
  ClickAwayListener,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Tooltip,
  Typography,
} from '@mui/material';
import GroupIcon from '@mui/icons-material/Group';
import Config from '../../config';

type ConnectedUsersTooltipProps = {
  accessToken?: string;
};

const ConnectedUsersTooltip = ({ accessToken }: ConnectedUsersTooltipProps) => {
  const [users, setUsers] = useState<string[]>([]);
  const [isHovered, setIsHovered] = useState(false);
  const [isPinned, setIsPinned] = useState(false);

  const socketUrl = useMemo(() => {
    if (!accessToken) return null;
    return `${Config.WS_URL}ws/users/?token=${encodeURIComponent(accessToken)}`;
  }, [accessToken]);

  const { lastMessage, readyState } = useWebSocket(socketUrl, {
    shouldReconnect: () => true,
    reconnectAttempts: 10,
    reconnectInterval: (attemptNumber: number) =>
      Math.min(Math.pow(2, attemptNumber) * 1000, 10000),
  }, Boolean(accessToken));

  useEffect(() => {
    if (!lastMessage?.data) return;

    try {
      const payload = JSON.parse(lastMessage.data as string) as { users?: string[] };
      if (Array.isArray(payload.users)) {
        setUsers(payload.users);
      }
    } catch {
      // Ignore malformed websocket messages.
    }
  }, [lastMessage]);

  const isConnected = readyState === ReadyState.OPEN;
  const isOpen = isHovered || isPinned;

  const tooltipTitle = (
    <Box sx={{ minWidth: 260, maxWidth: 340 }}>
      <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
        Usuarios conectados ({users.length})
      </Typography>
      <Typography variant="caption" sx={{ opacity: 0.8, display: 'block', mb: users.length ? 1 : 0 }}>
        Estado: {isConnected ? 'Conectado' : 'Reconectando...'}
      </Typography>
      {users.length ? (
        <List dense disablePadding>
          {users.map((email) => (
            <ListItem key={email} disableGutters>
              <ListItemText primaryTypographyProps={{ variant: 'body2' }} primary={email} />
            </ListItem>
          ))}
        </List>
      ) : (
        <Typography variant="body2">No hay usuarios conectados.</Typography>
      )}
    </Box>
  );

  return (
    <ClickAwayListener onClickAway={() => setIsPinned(false)}>
      <Box
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <Tooltip
          title={tooltipTitle}
          open={isOpen}
          placement="bottom"
          arrow
          disableFocusListener
          disableTouchListener
        >
          <IconButton
            color="inherit"
            onClick={() => setIsPinned((prev) => !prev)}
            aria-label="usuarios conectados"
            size="large"
          >
            <Badge color="success" badgeContent={users.length} max={99}>
              <GroupIcon />
            </Badge>
          </IconButton>
        </Tooltip>
      </Box>
    </ClickAwayListener>
  );
};

export default ConnectedUsersTooltip;

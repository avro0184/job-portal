'use client';

import React, { useState } from 'react';
import {
  Badge,
  Menu,
  MenuItem,
  IconButton,
  Divider,
  Typography,
  Box
} from '@mui/material';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import { useSelector } from 'react-redux';

export default function NotificationDropdown() {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const userInfo = useSelector((state) => state.userInfo.userInfo);

  const handleOpen = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  const notifications = [
    { icon: '📢', message: (`Welcome ${userInfo?.full_name}`) },
  ];

  return (
    <div className="relative">
      <IconButton
        onClick={handleOpen}
        aria-label="notifications"
        className="text-gray-700 dark:text-white"
      >
        <Badge badgeContent={notifications.length} color="error">
          <NotificationsNoneIcon />
        </Badge>
      </IconButton>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        PaperProps={{
          sx: {
            width: 320,
            borderRadius: 2,
            mt: 1.5,
            boxShadow: 4,
            p: 0,
          },
        }}
      >
        {notifications.length > 0 ? (
          notifications.map((notif, index) => (
            <Box key={index}>
              <MenuItem
                onClick={handleClose}
                sx={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 1.5,
                  whiteSpace: 'normal',
                  py: 1.5,
                  px: 2,
                }}
              >
                <span className="text-lg">{notif.icon}</span>
                <Typography variant="body2" className="text-gray-800 hover:text-white dark:text-primary dark:hover:text-white" >
                  {notif.message}
                </Typography>
              </MenuItem>
              {index < notifications.length - 1 && <Divider />}
            </Box>
          ))
        ) : (
          <MenuItem disabled sx={{ px: 2, py: 2 }}>
            <Typography className='text-center dark:text-primary dark:hover:text-white ' variant="body2" color="text.secondary">
              No new notifications
            </Typography>
          </MenuItem>
        )}
      </Menu>
    </div>
  );
}

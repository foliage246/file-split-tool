import React from 'react';
import {
  AppBar,
  Box,
  Container,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Avatar,
  Chip,
} from '@mui/material';
import { AccountCircle, ExitToApp } from '@mui/icons-material';
import { useAuth } from '../../context/SimpleAuthContext';
import { useNavigate } from 'react-router-dom';

interface AppLayoutProps {
  children: React.ReactNode;
}

export const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    handleClose();
    await logout();
    navigate('/login');
  };

  const handleLogin = () => {
    navigate('/login');
  };

  const handleUpgrade = () => {
    navigate('/pricing');
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" sx={{ bgcolor: '#1976d2' }}>
        <Toolbar>
          <Typography
            variant="h6"
            component="div"
            sx={{ flexGrow: 1, cursor: 'pointer' }}
            onClick={() => navigate('/')}
          >
            檔案切分工具
          </Typography>

          {isAuthenticated && user ? (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              {/* 用戶等級標示 */}
              <Chip
                label={user.is_premium ? '付費版' : '免費版'}
                color={user.is_premium ? 'success' : 'default'}
                size="small"
                variant="outlined"
                sx={{
                  color: 'white',
                  borderColor: 'white',
                  '& .MuiChip-label': { color: 'white' },
                }}
              />

              {/* 升級按鈕 */}
              {!user.is_premium && (
                <Button
                  color="warning"
                  variant="contained"
                  size="small"
                  onClick={handleUpgrade}
                  sx={{ bgcolor: '#ff9800', '&:hover': { bgcolor: '#e68900' } }}
                >
                  升級
                </Button>
              )}

              {/* 用戶選單 */}
              <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleMenu}
                color="inherit"
              >
                <Avatar sx={{ width: 32, height: 32, bgcolor: '#1565c0' }}>
                  {user.email.charAt(0).toUpperCase()}
                </Avatar>
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={Boolean(anchorEl)}
                onClose={handleClose}
              >
                <MenuItem disabled>
                  <Box>
                    <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                      {user.email}
                    </Typography>
                    <Typography variant="caption" color="textSecondary">
                      {user.is_premium ? '付費會員' : '免費會員'}
                    </Typography>
                  </Box>
                </MenuItem>
                <MenuItem onClick={() => { handleClose(); navigate('/dashboard'); }}>
                  <AccountCircle sx={{ mr: 1 }} />
                  我的檔案
                </MenuItem>
                {user.is_premium && (
                  <MenuItem onClick={() => { handleClose(); navigate('/subscription'); }}>
                    訂閱管理
                  </MenuItem>
                )}
                {!user.is_premium && (
                  <MenuItem onClick={() => { handleClose(); navigate('/pricing'); }}>
                    升級方案
                  </MenuItem>
                )}
                <MenuItem onClick={handleLogout}>
                  <ExitToApp sx={{ mr: 1 }} />
                  登出
                </MenuItem>
              </Menu>
            </Box>
          ) : (
            <Button color="inherit" onClick={handleLogin}>
              登入
            </Button>
          )}
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        {children}
      </Container>
    </Box>
  );
};
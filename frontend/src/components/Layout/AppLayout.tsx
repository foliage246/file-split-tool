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
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../context/SimpleAuthContext';
import { useNavigate } from 'react-router-dom';
import { LanguageSwitcher } from '../LanguageSwitcher';

interface AppLayoutProps {
  children: React.ReactNode;
}

export const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation(['common']);
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
            {t('nav.app')}
          </Typography>

          {/* 語言切換器 */}
          <Box sx={{ mr: 2 }}>
            <LanguageSwitcher variant="icon" size="small" showText={false} />
          </Box>

          {isAuthenticated && user ? (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              {/* 用戶等級標示 */}
              <Chip
                label={user.is_premium ? t('user.premium') : t('user.free')}
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
                  {t('user.upgrade')}
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
                      {user.is_premium ? t('user.premiumMember') : t('user.freeMember')}
                    </Typography>
                  </Box>
                </MenuItem>
                <MenuItem onClick={() => { handleClose(); navigate('/dashboard'); }}>
                  <AccountCircle sx={{ mr: 1 }} />
                  {t('user.myFiles')}
                </MenuItem>
                {user.is_premium && (
                  <MenuItem onClick={() => { handleClose(); navigate('/subscription'); }}>
                    {t('user.subscriptionManage')}
                  </MenuItem>
                )}
                {!user.is_premium && (
                  <MenuItem onClick={() => { handleClose(); navigate('/pricing'); }}>
                    {t('user.upgradePlan')}
                  </MenuItem>
                )}
                <MenuItem onClick={handleLogout}>
                  <ExitToApp sx={{ mr: 1 }} />
                  {t('nav.logout')}
                </MenuItem>
              </Menu>
            </Box>
          ) : (
            <Button color="inherit" onClick={handleLogin}>
              {t('nav.login')}
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
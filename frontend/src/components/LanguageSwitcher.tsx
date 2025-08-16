import React, { useState } from 'react';
import {
  Button,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  CircularProgress,
  Box,
  Typography,
} from '@mui/material';
import {
  Language as LanguageIcon,
  Check as CheckIcon,
} from '@mui/icons-material';
import { useLanguage, useCurrentLanguageInfo } from '../context/LanguageContext';

interface LanguageSwitcherProps {
  variant?: 'button' | 'icon';
  size?: 'small' | 'medium' | 'large';
  showFlag?: boolean;
  showText?: boolean;
}

export const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({
  variant = 'button',
  size = 'medium',
  showFlag = true,
  showText = true,
}) => {
  const { currentLanguage, changeLanguage, supportedLanguages, isLoading } = useLanguage();
  const currentLangInfo = useCurrentLanguageInfo();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLanguageChange = async (langCode: string) => {
    if (langCode !== currentLanguage) {
      await changeLanguage(langCode);
    }
    handleClose();
  };

  const buttonContent = (
    <Box display="flex" alignItems="center" gap={1}>
      {isLoading && <CircularProgress size={16} />}
      {!isLoading && showFlag && (
        <Typography component="span" sx={{ fontSize: size === 'small' ? '1rem' : '1.2rem' }}>
          {currentLangInfo.flag}
        </Typography>
      )}
      {!isLoading && showText && (
        <Typography 
          variant={size === 'small' ? 'body2' : 'body1'} 
          component="span"
          sx={{ fontWeight: 500 }}
        >
          {currentLangInfo.name}
        </Typography>
      )}
      {!isLoading && variant === 'icon' && !showText && (
        <LanguageIcon />
      )}
    </Box>
  );

  return (
    <>
      <Button
        onClick={handleClick}
        variant={variant === 'button' ? 'outlined' : 'text'}
        size={size}
        disabled={isLoading}
        sx={{
          minWidth: variant === 'icon' && !showText ? 'auto' : undefined,
          borderRadius: 2,
          textTransform: 'none',
          '&:hover': {
            backgroundColor: 'rgba(0, 0, 0, 0.04)',
          },
        }}
        aria-label="切換語言 / Switch Language"
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
      >
        {buttonContent}
      </Button>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'language-switcher-button',
        }}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        PaperProps={{
          sx: {
            borderRadius: 2,
            minWidth: 160,
            boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
          },
        }}
      >
        {supportedLanguages.map((language) => (
          <MenuItem
            key={language.code}
            onClick={() => handleLanguageChange(language.code)}
            selected={language.code === currentLanguage}
            sx={{
              py: 1.5,
              '&.Mui-selected': {
                backgroundColor: 'rgba(25, 118, 210, 0.08)',
                '&:hover': {
                  backgroundColor: 'rgba(25, 118, 210, 0.12)',
                },
              },
            }}
          >
            <ListItemIcon sx={{ minWidth: 36 }}>
              <Typography component="span" sx={{ fontSize: '1.2rem' }}>
                {language.flag}
              </Typography>
            </ListItemIcon>
            <ListItemText 
              primary={language.name}
              primaryTypographyProps={{
                fontWeight: language.code === currentLanguage ? 600 : 400,
              }}
            />
            {language.code === currentLanguage && (
              <CheckIcon 
                color="primary" 
                sx={{ ml: 1, fontSize: '1.2rem' }} 
              />
            )}
          </MenuItem>
        ))}
      </Menu>
    </>
  );
};
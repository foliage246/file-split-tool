import React, { createContext, useContext, useState, ReactNode } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { 
  CssBaseline, 
  Container, 
  Typography, 
  Button, 
  Box, 
  Card, 
  CardContent,
  AppBar,
  Toolbar,
  Tab,
  Tabs,
  TextField,
  Alert,
  Menu,
  MenuItem,
  IconButton,
  Avatar
} from '@mui/material';
import { AccountCircle } from '@mui/icons-material';

// 創建 Material-UI 主題
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
    background: {
      default: '#fafafa',
      paper: '#ffffff',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", "Noto Sans TC", sans-serif',
    h1: {
      fontSize: '3.5rem',
      fontWeight: 700,
      lineHeight: 1.2,
    },
    h4: {
      fontSize: '1.875rem',
      fontWeight: 600,
      lineHeight: 1.4,
    },
    button: {
      textTransform: 'none',
      fontWeight: 600,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          padding: '10px 24px',
          fontSize: '1rem',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        },
      },
    },
  },
});

// 認證上下文
interface User {
  id: string;
  email: string;
  name: string;
  is_premium: boolean;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);

  const login = async (email: string, password: string): Promise<boolean> => {
    setLoading(true);
    try {
      // 模擬 API 調用
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // 模擬成功登入
      const mockUser: User = {
        id: '1',
        email,
        name: email.split('@')[0],
        is_premium: false
      };
      setUser(mockUser);
      return true;
    } catch (error) {
      return false;
    } finally {
      setLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string): Promise<boolean> => {
    setLoading(true);
    try {
      // 模擬 API 調用
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // 模擬成功註冊
      const mockUser: User = {
        id: '1',
        email,
        name,
        is_premium: false
      };
      setUser(mockUser);
      return true;
    } catch (error) {
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

// 導航組件
function Navigation() {
  const location = useLocation();
  const { user, logout } = useAuth();
  const currentTab = location.pathname;
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    handleClose();
  };

  return (
    <AppBar position="static" color="primary">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          檔案分割工具
        </Typography>
        <Tabs 
          value={currentTab} 
          textColor="inherit" 
          sx={{ '& .MuiTab-root': { color: 'white', minWidth: 80 } }}
        >
          <Tab label="首頁" value="/" component={Link} to="/" />
          {user && <Tab label="工具" value="/app" component={Link} to="/app" />}
          <Tab label="價格" value="/pricing" component={Link} to="/pricing" />
        </Tabs>
        <Box sx={{ ml: 2 }}>
          {user ? (
            <div>
              <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleMenu}
                color="inherit"
              >
                <Avatar sx={{ width: 32, height: 32, bgcolor: 'secondary.main' }}>
                  {user.name.charAt(0).toUpperCase()}
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
                <MenuItem onClick={handleClose}>
                  {user.name} ({user.is_premium ? '專業版' : '免費版'})
                </MenuItem>
                <MenuItem onClick={handleLogout}>登出</MenuItem>
              </Menu>
            </div>
          ) : (
            <>
              <Button color="inherit" component={Link} to="/login" sx={{ mr: 1 }}>
                登入
              </Button>
              <Button variant="outlined" color="inherit" component={Link} to="/register">
                註冊
              </Button>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
}

// 首頁組件
function HomePage() {
  const { user } = useAuth();

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {user && (
        <Alert severity="success" sx={{ mb: 4 }}>
          歡迎回來，{user.name}！您可以開始使用檔案分割工具。
        </Alert>
      )}
      
      {/* 標題區域 */}
      <Box textAlign="center" mb={6}>
        <Typography variant="h1" component="h1" gutterBottom>
          檔案分割工具
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 600, mx: 'auto' }}>
          快速、安全、易用的檔案分割服務
        </Typography>
      </Box>

      {/* 功能特色卡片 */}
      <Box display="grid" gridTemplateColumns={{ xs: '1fr', md: 'repeat(2, 1fr)' }} gap={3} mb={6}>
        <Card>
          <CardContent sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              🚀 免費版功能
            </Typography>
            <ul style={{ margin: 0, paddingLeft: '20px' }}>
              <li>每日 5 個檔案處理額度</li>
              <li>檔案大小限制 10MB</li>
              <li>支援 CSV 格式</li>
              <li>支援 Big5 編碼</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardContent sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              ⚡ 核心功能
            </Typography>
            <ul style={{ margin: 0, paddingLeft: '20px' }}>
              <li>按欄位值自動分割</li>
              <li>即時處理與下載</li>
              <li>ZIP 壓縮輸出</li>
              <li>資料安全保護</li>
            </ul>
          </CardContent>
        </Card>
      </Box>

      {/* 操作按鈕 */}
      <Box textAlign="center" gap={2} display="flex" justifyContent="center" flexWrap="wrap">
        {user ? (
          <Button 
            variant="contained" 
            size="large"
            component={Link}
            to="/app"
            sx={{ minWidth: 150 }}
          >
            開始使用
          </Button>
        ) : (
          <Button 
            variant="contained" 
            size="large"
            component={Link}
            to="/register"
            sx={{ minWidth: 150 }}
          >
            立即註冊
          </Button>
        )}
        <Button 
          variant="outlined" 
          size="large"
          component={Link}
          to="/pricing"
          sx={{ minWidth: 150 }}
        >
          了解更多
        </Button>
      </Box>
    </Container>
  );
}

// 工具頁面（需要認證）
function AppPage() {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        檔案分割工具
      </Typography>
      <Card>
        <CardContent sx={{ p: 4 }}>
          <Typography variant="h6" gutterBottom>
            📁 檔案上傳
          </Typography>
          <Typography color="text.secondary" paragraph>
            歡迎，{user.name}！您的帳戶類型：{user.is_premium ? '專業版' : '免費版'}
          </Typography>
          <Typography color="text.secondary" paragraph>
            檔案上傳功能開發中...
          </Typography>
          <Button variant="contained" disabled>
            選擇檔案
          </Button>
        </CardContent>
      </Card>
    </Container>
  );
}

// 價格頁面
function PricingPage() {
  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom textAlign="center">
        價格方案
      </Typography>
      <Box display="grid" gridTemplateColumns={{ xs: '1fr', md: 'repeat(2, 1fr)' }} gap={3}>
        <Card>
          <CardContent sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="h5" gutterBottom>
              免費版
            </Typography>
            <Typography variant="h3" color="primary" gutterBottom>
              $0
            </Typography>
            <Typography color="text.secondary" paragraph>
              每月
            </Typography>
            <ul style={{ textAlign: 'left' }}>
              <li>每日 5 個檔案</li>
              <li>10MB 檔案限制</li>
              <li>CSV 格式支援</li>
              <li>基本功能</li>
            </ul>
            <Button variant="outlined" fullWidth sx={{ mt: 2 }} component={Link} to="/register">
              開始使用
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardContent sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="h5" gutterBottom>
              專業版
            </Typography>
            <Typography variant="h3" color="primary" gutterBottom>
              $9.99
            </Typography>
            <Typography color="text.secondary" paragraph>
              每月
            </Typography>
            <ul style={{ textAlign: 'left' }}>
              <li>每日 50 個檔案</li>
              <li>100MB 檔案限制</li>
              <li>CSV + Excel + TXT</li>
              <li>優先處理</li>
            </ul>
            <Button variant="contained" fullWidth sx={{ mt: 2 }} disabled>
              升級專業版（開發中）
            </Button>
          </CardContent>
        </Card>
      </Box>
    </Container>
  );
}

// 登入頁面
function LoginPage() {
  const { login, loading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!email || !password) {
      setError('請填入所有欄位');
      return;
    }

    const success = await login(email, password);
    if (!success) {
      setError('登入失敗，請檢查帳號密碼');
    }
  };

  return (
    <Container maxWidth="sm" sx={{ py: 4 }}>
      <Card>
        <CardContent sx={{ p: 4 }}>
          <Typography variant="h4" gutterBottom textAlign="center">
            登入
          </Typography>
          
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          
          <Box component="form" onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="密碼"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              margin="normal"
              required
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              disabled={loading}
            >
              {loading ? '登入中...' : '登入'}
            </Button>
          </Box>
          
          <Box textAlign="center">
            <Typography variant="body2">
              還沒有帳號？{' '}
              <Link to="/register" style={{ textDecoration: 'none', color: theme.palette.primary.main }}>
                立即註冊
              </Link>
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
}

// 註冊頁面
function RegisterPage() {
  const { register, loading } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!name || !email || !password) {
      setError('請填入所有欄位');
      return;
    }

    const success = await register(name, email, password);
    if (!success) {
      setError('註冊失敗，請稍後再試');
    }
  };

  return (
    <Container maxWidth="sm" sx={{ py: 4 }}>
      <Card>
        <CardContent sx={{ p: 4 }}>
          <Typography variant="h4" gutterBottom textAlign="center">
            註冊
          </Typography>
          
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          
          <Box component="form" onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="姓名"
              value={name}
              onChange={(e) => setName(e.target.value)}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="密碼"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              margin="normal"
              required
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              disabled={loading}
            >
              {loading ? '註冊中...' : '註冊'}
            </Button>
          </Box>
          
          <Box textAlign="center">
            <Typography variant="body2">
              已有帳號？{' '}
              <Link to="/login" style={{ textDecoration: 'none', color: theme.palette.primary.main }}>
                立即登入
              </Link>
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
}

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <Router>
          <Navigation />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/app" element={<AppPage />} />
            <Route path="/pricing" element={<PricingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
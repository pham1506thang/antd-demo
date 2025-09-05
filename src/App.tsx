import React, { useState } from 'react';
import { Layout, Menu, theme, Dropdown, Modal } from 'antd';
import type { MenuProps } from 'antd';
import {
  BrowserRouter,
  Route,
  Routes,
  useNavigate,
  useLocation,
} from 'react-router-dom';
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  DashboardOutlined,
  ShoppingCartOutlined,
  UserOutlined,
  SettingOutlined,
  LogoutOutlined,
  QuestionCircleOutlined,
  BarChartOutlined,
  FileTextOutlined,
  SafetyCertificateOutlined,
} from '@ant-design/icons';
import Dashboard from './pages/Dashboard';
import Users from './pages/Users';
import Roles from './pages/Roles';
import Orders from './pages/Orders';
import Analytics from './pages/Analytics';
import Reports from './pages/Reports';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import Help from './pages/Help';
import Login from './pages/Login';
import CreateUserPage from './pages/Users/CreateUser';
import UpdateUserPage from './pages/Users/UpdateUser';
import CreateRolePage from './pages/Roles/CreateRole';
import UpdateRolePage from './pages/Roles/UpdateRole';
import { UserMenuTrigger } from './components/UserMenuTrigger';
import AppInit from '@/components/AppInit';
import { authApi } from '@/api/slices/authApi';
import { clearAuthState } from '@/utils/authUtils';
import { useAuthInit } from '@/hooks/useAuthInit';

const { Header, Sider, Content } = Layout;

// Wrapper component to handle navigation
const MenuWrapper: React.FC<{
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
}> = ({ collapsed, setCollapsed }) => {
  // collapsed is used in JSX below
  const navigate = useNavigate();
  const location = useLocation();
  const [logout] = authApi.useLogoutMutation();
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const handleLogout = () => {
    Modal.confirm({
      title: 'Confirm Logout',
      content: 'Are you sure you want to logout?',
      onOk: async () => {
        try {
          // Call logout API to invalidate session on server
          await logout().unwrap();
        } catch (error) {
          // Even if API fails, continue with local logout
          console.error('Logout API failed:', error);
        } finally {
          // Clear all auth state
          clearAuthState();
          // Navigate to login
          navigate('/login');
        }
      },
      okText: 'Logout',
      cancelText: 'Cancel',
    });
  };

  const menuItems = [
    {
      key: '/',
      icon: <DashboardOutlined />,
      label: 'Dashboard',
    },
    {
      key: '/users',
      icon: <UserOutlined />,
      label: 'Users',
    },
    {
      key: '/roles',
      icon: <SafetyCertificateOutlined />,
      label: 'Roles',
    },
    {
      key: '/orders',
      icon: <ShoppingCartOutlined />,
      label: 'Orders',
    },
    {
      key: '/analytics',
      icon: <BarChartOutlined />,
      label: 'Analytics',
    },
    {
      key: '/reports',
      icon: <FileTextOutlined />,
      label: 'Reports',
    },
    {
      key: '/profile',
      icon: <UserOutlined />,
      label: 'Profile',
    },
    {
      key: '/settings',
      icon: <SettingOutlined />,
      label: 'Settings',
    },
    {
      key: '/help',
      icon: <QuestionCircleOutlined />,
      label: 'Help',
    },
  ];

  const userMenuItems: MenuProps['items'] = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: 'Profile',
    },
    {
      key: 'settings',
      icon: <SettingOutlined />,
      label: 'Settings',
    },
    {
      type: 'divider',
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: 'Logout',
      danger: true,
    },
  ];

  const handleUserMenuClick: MenuProps['onClick'] = ({ key }) => {
    switch (key) {
      case 'logout':
        handleLogout();
        break;
      case 'profile':
        navigate('/profile');
        break;
      case 'settings':
        navigate('/settings');
        break;
    }
  };

  return (
    <Layout>
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        breakpoint="lg"
        collapsedWidth="0"
        width={240}
        style={{
          padding: '8px 0',
        }}
        onBreakpoint={(broken) => {
          if (broken) {
            setCollapsed(true);
          }
        }}
      >
        <div className="demo-logo-vertical" />
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[location.pathname]}
          style={{
            padding: '0 8px',
          }}
          onClick={({ key }) => navigate(key)}
          items={menuItems}
        />
      </Sider>
      <Layout>
        <Header
          style={{
            padding: '0 16px',
            background: colorBgContainer,
            position: 'sticky',
            top: 0,
            zIndex: 1,
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center' }}>
            {collapsed ? (
              <MenuUnfoldOutlined
                className="trigger"
                onClick={() => setCollapsed(!collapsed)}
              />
            ) : (
              <MenuFoldOutlined
                className="trigger"
                onClick={() => setCollapsed(!collapsed)}
              />
            )}
          </div>
          <Dropdown
            menu={{
              items: userMenuItems,
              onClick: handleUserMenuClick,
            }}
            placement="bottomRight"
            trigger={['click']}
          >
            <UserMenuTrigger>
              <UserOutlined style={{ fontSize: '18px' }} />
            </UserMenuTrigger>
          </Dropdown>
        </Header>
        <Content
          style={{
            margin: '24px 16px',
            padding: 24,
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
            minHeight: 280,
          }}
        >
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/users" element={<Users />} />
            <Route path="/users/create" element={<CreateUserPage />} />
            <Route path="/users/update/:userId" element={<UpdateUserPage />} />
            <Route path="/roles" element={<Roles />} />
            <Route path="/roles/create" element={<CreateRolePage />} />
            <Route path="/roles/update/:roleId" element={<UpdateRolePage />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/help" element={<Help />} />
          </Routes>
        </Content>
      </Layout>
    </Layout>
  );
};

// Main App component
const App: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  
  // Initialize auth state from server
  const { isInitialized } = useAuthInit();

  // Show loading while initializing auth
  if (!isInitialized) {
    return (
      <div
        style={{
          height: '100vh',
          width: '100vw',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#f0f2f5',
        }}
      >
        <div>Initializing...</div>
      </div>
    );
  }

  return (
    <BrowserRouter
      future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
    >
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/*"
          element={
            <AppInit>
              <MenuWrapper collapsed={collapsed} setCollapsed={setCollapsed} />
            </AppInit>
          }
        />
      </Routes>
    </BrowserRouter>
  );
};

export default App;

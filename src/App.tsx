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
import { Dashboard } from './pages/Dashboard';
import { UsersPage as Users } from './pages/Users';
import { RolesPage as Roles } from './pages/Roles';
import { OrdersPage as Orders } from './pages/Orders';
import { AnalyticsPage as Analytics } from './pages/Analytics';
import { ReportsPage as Reports } from './pages/Reports';
import { ProfilePage } from './pages/Profile';
import { SettingsPage as Settings } from './pages/Settings';
import { HelpPage as Help } from './pages/Help';
import { Login } from './pages/Login';
import { CreateUserPage } from './pages/Users/CreateUser';
import { EditUserPage } from './pages/Users/EditUser';
import { ViewUser } from './pages/Users/ViewUser';
import { CreateRolePage } from './pages/Roles/CreateRole';
import { EditRolePage } from './pages/Roles/EditRole';
import { ViewRole } from './pages/Roles/ViewRole';
import { NotFound } from './pages/NotFound';
import { Forbidden } from './pages/Forbidden';
import { UserMenuTrigger, RouteGuard } from './components';
import { AppInit } from '@/components/AppInit';
import { authApi } from '@/api/slices/authApi';
import { clearAuthState } from '@/utils/authUtils';
import { useAuthInit } from '@/hooks/useAuthInit';
import { usePermissionCheck } from '@/hooks/usePermissionCheck';
import { DOMAINS } from '@/models/permission';

const { Header, Sider, Content } = Layout;

// Wrapper component to handle navigation
const MenuWrapper: React.FC<{
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
}> = ({ collapsed, setCollapsed }) => {
  // collapsed is used in JSX below (lines 217-225)
  const navigate = useNavigate();
  const location = useLocation();
  const [logout] = authApi.useLogoutMutation();
  const checkPermission = usePermissionCheck();
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const handleLogout = () => {
    Modal.confirm({
      title: 'Xác nhận đăng xuất',
      content: 'Bạn có chắc chắn muốn đăng xuất không?',
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
      okText: 'Đăng xuất',
      cancelText: 'Hủy',
    });
  };

  // Define menu items with their corresponding domains
  const allMenuItems = [
    {
      key: '/',
      icon: <DashboardOutlined />,
      label: 'Bảng điều khiển',
      domain: null, // Dashboard doesn't require specific permission
    },
    {
      key: `/${DOMAINS.USERS.value}`,
      icon: <UserOutlined />,
      label: 'Người dùng',
      domain: DOMAINS.USERS.value,
    },
    {
      key: '/roles',
      icon: <SafetyCertificateOutlined />,
      label: 'Vai trò',
      domain: DOMAINS.ROLES.value,
    },
    {
      key: '/orders',
      icon: <ShoppingCartOutlined />,
      label: 'Đơn hàng',
      domain: null, // Orders doesn't have specific domain in DOMAINS
    },
    {
      key: '/analytics',
      icon: <BarChartOutlined />,
      label: 'Phân tích',
      domain: DOMAINS.ANALYTICS.value,
    },
    {
      key: '/reports',
      icon: <FileTextOutlined />,
      label: 'Báo cáo',
      domain: DOMAINS.REPORTS.value,
    },
    {
      key: '/profile',
      icon: <UserOutlined />,
      label: 'Hồ sơ',
      domain: null, // Profile is always accessible
    },
    {
      key: '/settings',
      icon: <SettingOutlined />,
      label: 'Cài đặt',
      domain: DOMAINS.SETTINGS.value,
    },
    {
      key: '/help',
      icon: <QuestionCircleOutlined />,
      label: 'Trợ giúp',
      domain: null, // Help is always accessible
    },
  ];

  // Filter menu items based on permissions
  const menuItems = allMenuItems.filter(item => {
    // Always show items without domain requirement
    if (!item.domain) return true;
    
    // Check permission for items with domain requirement
    return checkPermission(item.domain, 'view');
  });

  const userMenuItems: MenuProps['items'] = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: 'Hồ sơ',
    },
    {
      key: 'settings',
      icon: <SettingOutlined />,
      label: 'Cài đặt',
    },
    {
      type: 'divider',
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: 'Đăng xuất',
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
            minHeight: 'calc(100vh - 112px)', // 64px header + 48px margin
            height: 'calc(100vh - 112px)',
            overflowY: 'auto',
          }}
        >
          <Routes>
            <Route path="/" element={
              <RouteGuard>
                <Dashboard />
              </RouteGuard>
            } />
            <Route path={`/${DOMAINS.USERS.value}`} element={
              <RouteGuard domain="USERS" action="VIEW">
                <Users />
              </RouteGuard>
            } />
            <Route path={`/${DOMAINS.USERS.value}/create`} element={
              <RouteGuard domain="USERS" action="CREATE">
                <CreateUserPage />
              </RouteGuard>
            } />
            <Route path={`/${DOMAINS.USERS.value}/:userId`} element={
              <RouteGuard domain="USERS" action="VIEW">
                <ViewUser />
              </RouteGuard>
            } />
            <Route path={`/${DOMAINS.USERS.value}/edit/:userId`} element={
              <RouteGuard domain="USERS" action="VIEW">
                <EditUserPage />
              </RouteGuard>
            } />
            <Route path={`/${DOMAINS.ROLES.value}`} element={
              <RouteGuard domain="ROLES" action="VIEW">
                <Roles />
              </RouteGuard>
            } />
            <Route path={`/${DOMAINS.ROLES.value}/create`} element={
              <RouteGuard domain="ROLES" action="CREATE">
                <CreateRolePage />
              </RouteGuard>
            } />
            <Route path={`/${DOMAINS.ROLES.value}/:roleId`} element={
              <RouteGuard domain="ROLES" action="VIEW">
                <ViewRole />
              </RouteGuard>
            } />
            <Route path={`/${DOMAINS.ROLES.value}/edit/:roleId`} element={
              <RouteGuard domain="ROLES" action="VIEW">
                <EditRolePage />
              </RouteGuard>
            } />
            <Route path="/orders" element={
              <RouteGuard>
                <Orders />
              </RouteGuard>
            } />
            <Route path="/analytics" element={
              <RouteGuard domain="ANALYTICS" action="ACCESS">
                <Analytics />
              </RouteGuard>
            } />
            <Route path="/reports" element={
              <RouteGuard domain="REPORTS" action="VIEW_TRAFFIC">
                <Reports />
              </RouteGuard>
            } />
            <Route path="/profile" element={
              <RouteGuard>
                <ProfilePage />
              </RouteGuard>
            } />
            <Route path="/settings" element={
              <RouteGuard domain="SETTINGS" action="GENERAL">
                <Settings />
              </RouteGuard>
            } />
            <Route path="/help" element={
              <RouteGuard>
                <Help />
              </RouteGuard>
            } />
            <Route path="/403" element={<Forbidden />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Content>
      </Layout>
    </Layout>
  );
};

// Main App component
export const App: React.FC = () => {
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

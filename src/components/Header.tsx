
import React, { useState, useEffect } from 'react';
import { Layout, Avatar, Menu, Dropdown, notification } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import axios, { AxiosError } from 'axios';

const { Header: AntHeader } = Layout;

const Header: React.FC = () => {
  const [userName, setUserName] = useState<string>('User');
  const [showLogout, setShowLogout] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const accessToken = localStorage.getItem('accessToken');
    if (accessToken) {
      fetchUserName(accessToken);
    }
  }, []);

  const fetchUserName = async (accessToken: string) => {
    try {
      const response = await axios.get('http://localhost:8070/user', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      setUserName(response.data.name);
    } catch (error) {
      const axiosError = error as AxiosError;
      console.error('Error fetching user name:', axiosError);
      if (axiosError.response && axiosError.response.status === 401) {
        navigate('/login');
      } else {
        notification.error({
          message: 'Error',
          description: 'Failed to fetch user information.',
        });
      }
    }
  };

  const handleLogoutClick = () => {
    setShowLogout(!showLogout);
  };

  const handleListOrder = () => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (user.role === 'ADMIN') {
      navigate('/list-order-admin');
    } else {
      navigate('/list-order');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    navigate('/login');
  };

  const menu = (
    <Menu>
      <Menu.Item key="list-order" onClick={handleListOrder}>
        List Order
      </Menu.Item>
      <Menu.Item key="logout" onClick={handleLogout}>
        Logout
      </Menu.Item>
    </Menu>
  );

  return (
    <AntHeader className="site-layout-background" style={{ padding: 0, backgroundColor: '#fff', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <div></div>
      <div style={{ marginRight: 16 }}>
        <Avatar icon={<UserOutlined />} />
        <span style={{ marginLeft: 8, cursor: 'pointer' }} onClick={handleLogoutClick}>{userName}</span>
        {showLogout && (
          <Dropdown overlay={menu} visible={showLogout} onVisibleChange={setShowLogout}>
            <span></span>
          </Dropdown>
        )}
      </div>
    </AntHeader>
  );
};

export default Header;

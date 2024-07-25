import React, { useState } from 'react';
import { Form, Input, Button, Checkbox, Typography, notification } from 'antd';
import { MailOutlined, LockOutlined } from '@ant-design/icons';
import axios, { AxiosResponse } from 'axios';
import { useNavigate } from 'react-router-dom';

const { Title } = Typography;

const LoginForm: React.FC = () => {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const navigate = useNavigate();

  const onFinish = async (values: any) => {
    try {
      const res: AxiosResponse = await axios.post("http://localhost:8070/login", values);
      if (res.status === 200) {
        const token = res.data.accessToken;
        const reToken = res.data.refreshToken;
        localStorage.setItem('accessToken', token);
        localStorage.setItem('refreshToken', reToken);
        
        const userRes: AxiosResponse = await axios.get("http://localhost:8070/user", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        
        const user = userRes.data;
        localStorage.setItem('user', JSON.stringify(user));

        if (user.role === 'ADMIN') {
          notification.success({
            message: 'Login Success',
            description: 'Successful login!',
          });
          navigate('/user-list');
        } else if(user.role === 'USER') {
          notification.success({
            message: 'Login Success',
            description: 'Successful login!',
          });
          navigate('/user-list')
        }
        else {
          notification.error({
            message: 'Access Denied',
            description: 'You are not an ADMIN.',
          });
        }
      }
    } catch (error) {
      notification.error({
        message: 'Login failed',
        description: 'Email or password is incorrect.',
      });
    }
  };

  return (
    <div style={{ width: 450, margin: '0 auto', padding: '20px', backgroundColor: '#fff', borderRadius: '8px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }}>
      <Title level={1} style={{ textAlign: 'center', fontWeight: '700', color: '#333e65' }}>LOG IN</Title>
      <Form
        name="login_form"
        initialValues={{ remember: true }}
        onFinish={onFinish}
      >
        <Form.Item
          name="email"
          rules={[{ required: true, message: 'Please input your Email!', type: 'email' }]}
        >
          <Input prefix={<MailOutlined />} placeholder="Email" style={{ height: 50 }} />
        </Form.Item>
        <Form.Item
          name="password"
          rules={[{ required: true, message: 'Please input your Password!' }]}
        >
          <Input
            prefix={<LockOutlined />}
            type={passwordVisible ? 'text' : 'password'}
            placeholder="Password"
            style={{ height: 50 }}
          />
        </Form.Item>
        <Form.Item>
          <Checkbox onChange={() => setPasswordVisible(!passwordVisible)} style={{ float: 'left' }}>
            Show Password
          </Checkbox>
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit"
            style={{ width: '100%', fontWeight: '700', backgroundColor: '#333e65', height: 50 }}>
            LOG IN
          </Button>
        </Form.Item>
        <Form.Item>
          <p>Don't have an account yet? <a href="/signup">Sign up now</a></p>
        </Form.Item>
      </Form>
    </div>
  );
};

export default LoginForm;

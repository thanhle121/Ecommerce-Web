import React, { useState } from 'react';
import { Form, Input, Button, Checkbox, Typography, notification } from 'antd';
import { UserOutlined, HomeOutlined, MailOutlined, LockOutlined } from '@ant-design/icons';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const { Title } = Typography;

const SignUpForm: React.FC = () => {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const navigate = useNavigate();

  const onFinish = async (values: any) => {
    try {
      const res = await axios.post("http://localhost:8070/user", values);
      if (res.status === 201) {
        notification.success({
          message: 'Sign Up Success!',
          description: 'You have successfully registered! Please log in.'
        });
        navigate('/login');
      }
    } catch (error) {
      notification.error({
        message: 'Registration failed!',
        description: 'An error occurred, please try again.'
      });
    }
  };
  

  return (
    <div style={{ width: 450, margin: '0 auto', padding: '20px', backgroundColor: '#fff', borderRadius: '8px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }}>
      <Title level={1} style={{ textAlign: 'center', fontWeight: '700', color: '#333e65' }}>SIGN UP</Title>
      <Form
        name="signup_form"
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
        <Form.Item
          name="name"
          rules={[{ required: true, message: 'Please input your Name!' }]}
        >
          <Input prefix={<UserOutlined />} placeholder="Name" style={{ height: 50 }} />
        </Form.Item>
        <Form.Item
          name="address"
          rules={[{ required: true, message: 'Please input your Address!' }]}
        >
          <Input prefix={<HomeOutlined />} placeholder="Address" style={{ height: 50 }} />
        </Form.Item>
        <Form.Item>
          <Checkbox onChange={() => setPasswordVisible(!passwordVisible)} style={{ float: 'left' }}>
            Show Password
          </Checkbox>
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit"
            style={{ width: '100%', fontWeight: '700', backgroundColor: '#333e65', height: 50 }}>
            SIGN UP
          </Button>
        </Form.Item>
        <Form.Item>
          <p>Already have an account? <a href="/login">Log in</a></p>
        </Form.Item>
      </Form>
    </div>
  );
};

export default SignUpForm;

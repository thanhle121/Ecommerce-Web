import React, { useState, useEffect } from 'react';
import { Layout, Menu, Form, Input, InputNumber, Button, Avatar, notification, Typography } from 'antd';
import { UserOutlined, DashboardOutlined, AppstoreOutlined, TagsOutlined, TeamOutlined } from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom';
import axiosInstance from '../api/axios';
import { AxiosError } from 'axios';
import { useForm } from 'antd/es/form/Form';

const { Header, Sider, Content } = Layout;
const { Title } = Typography;

interface Product {
  id: string;
  name: string;
  basePrice: number;
  stock: number;
  discountPercentage: number;
  description: string; // Thêm trường description
}

const EditProduct: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { id } = location.state as { id: string };
  const [product, setProduct] = useState<Partial<Product>>({});
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchProduct();
  }, []);

  const fetchProduct = async () => {
    setLoading(true);
    const token = localStorage.getItem('accessToken');
    
    try {
      const response = await axiosInstance.get(`/product/id/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setProduct(response.data);
    } catch (error) {
      const axiosError = error as AxiosError;
      console.error('Error fetching product:', axiosError);
      notification.error({
        message: 'Error',
        description: 'Failed to fetch product details.',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (product) {
      form.setFieldsValue(product);
    }
  }, [product, form]);

  const handleSave = async (values: Partial<Product>) => {
    setLoading(true);
    const token = localStorage.getItem('accessToken');
    const payload = {
      ...values,
      basePrice: Number(values.basePrice),
      stock: Number(values.stock),
      discountPercentage: Number(values.discountPercentage),
      description: values.description
    };
    try {
      await axiosInstance.patch(`/product/${id}`, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      notification.success({
        message: 'Success',
        description: 'Product updated successfully',
      });
      navigate('/list');
    } catch (error) {
      const axiosError = error as AxiosError;
      console.error('Error updating product:', axiosError);
      notification.error({
        message: 'Error',
        description: 'Failed to update product.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider collapsible collapsed={collapsed} onCollapse={setCollapsed}>
        <div className="logo" />
        <Menu theme="dark" mode="inline" defaultSelectedKeys={['2']}>
          <Menu.Item key="1" icon={<DashboardOutlined />} onClick={() => navigate('/dashboard')}>
            Dashboard
          </Menu.Item>
          <Menu.Item key="2" icon={<AppstoreOutlined />} onClick={() => navigate('/list')}>
            Product
          </Menu.Item>
          <Menu.Item key="3" icon={<TagsOutlined />} onClick={() => navigate('/category')}>
            Category
          </Menu.Item>
          <Menu.Item key="4" icon={<TeamOutlined />} onClick={() => navigate('/user')}>
            User
          </Menu.Item>
        </Menu>
      </Sider>
      <Layout className="site-layout">
        <Header className="site-layout-background" style={{ padding: 0, backgroundColor: '#fff', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div></div>
          <div style={{ marginRight: 16 }}>
            <Avatar icon={<UserOutlined />} />
            <span style={{ marginLeft: 8 }}>Admin</span>
          </div>
        </Header>
        <Content style={{ margin: '0 16px', maxWidth: 500 }}>
          <div style={{ margin: '16px 0' }}>
            <Title level={2}>Edit Product</Title>
          </div>
          <Form
            form={form}
            layout="vertical"
            onFinish={handleSave}
          >
            <Form.Item name="name" label="Product Name" rules={[{ required: true, message: 'Please enter the product name' }]}>
              <Input style={{ minWidth: 500 }} />
            </Form.Item>
            <Form.Item name="basePrice" label="Base Price" rules={[{ required: true, message: 'Please enter the base price' }]}>
              <InputNumber min={0} style={{ minWidth: 500 }} />
            </Form.Item>
            <Form.Item name="stock" label="Stock" rules={[{ required: true, message: 'Please enter the stock' }]}>
              <InputNumber min={0} style={{ minWidth: 500 }} />
            </Form.Item>
            <Form.Item name="discountPercentage" label="Discount Percentage" rules={[{ required: true, message: 'Please enter the discount percentage' }]}>
              <InputNumber min={0} max={100} style={{ minWidth: 500 }} />
            </Form.Item>
            <Form.Item name="description" label="Description" rules={[{ required: true, message: 'Please enter the description' }]}>
              <Input.TextArea rows={4} style={{ minWidth: 500 }} />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit" loading={loading}>
                Save
              </Button>
            </Form.Item>
          </Form>
        </Content>
      </Layout>
    </Layout>
  );
};

export default EditProduct;

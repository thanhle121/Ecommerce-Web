import React, { useEffect, useState } from 'react';
import { Layout, Menu, Form, Input, Button, message, List, Modal, Avatar } from 'antd';
import { DashboardOutlined, AppstoreOutlined, UserOutlined, DeleteOutlined } from '@ant-design/icons';
import axios from 'axios';
import axiosInstance from '../api/axios';
import { useNavigate } from 'react-router-dom';

const { Header, Sider, Content } = Layout;

interface Category {
  id: number;
  name: string;
}

const Category: React.FC = () => {
  const [form] = Form.useForm();
  const [categories, setCategories] = useState<Category[]>([]);
  const [name, setName] = useState<string>('');
  const navigate = useNavigate();
  const fetchCategories = async () => {
    try {
      const response = await axiosInstance.get('http://localhost:8070/category');
      setCategories(response.data)
    } catch (error) {
      message.error('Failed to fetch categories');
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const onFinish = async () => {
    const data = {
      name: name
    }
    try {
      await axiosInstance.post('http://localhost:8070/category', data);
      message.success('Category added successfully');
      form.resetFields();
      fetchCategories()
    } catch (error) {
      console.error(error);
      message.error('Failed to add category');
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await axiosInstance.delete(`http://localhost:8070/category/${id}`);
      message.success('Category deleted successfully');
      fetchCategories();
    } catch (error) {
      console.error(error);
      message.error('Failed to delete category');
    }
  };

  const showDeleteConfirm = (id: number) => {
    Modal.confirm({
      title: 'Are you sure delete this category?',
      content: 'This action cannot be undone',
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk() {
        handleDelete(id);
      },
      onCancel() {
        console.log('Cancel');
      },
    });
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider>
        <Menu theme="dark" mode="inline">
          <Menu.Item key="1" icon={<DashboardOutlined />}>
            Dashboard
          </Menu.Item>
          <Menu.Item key="2" icon={<AppstoreOutlined />} onClick={() =>{navigate('/list')}}>
            Product
          </Menu.Item>
          <Menu.Item key="3" icon={<AppstoreOutlined />}>
            Category
          </Menu.Item>
          <Menu.Item key="4" icon={<UserOutlined />}>
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
        <Content style={{ margin: '0 16px' }}>
          <div style={{ padding: 24, background: '#fff', minHeight: 360, marginLeft: '20px', marginTop: '20px' }}>
            <Form form={form} layout="horizontal" onFinish={onFinish} labelCol={{ span: 6 }} wrapperCol={{ span: 14 }}>
              <Form.Item
                name="name"
                label="Category Name"
                rules={[{ required: true, message: 'Please input the category name' }]}
                style={{ maxWidth: '500px' }}
              >
                <Input onChange={(e) => setName(e.target.value)}/>
              </Form.Item>
              <Form.Item wrapperCol={{ offset: 6, span: 14 }} style={{ maxWidth: '500px' }}>
                <Button type="primary" htmlType="submit">
                  Add Category
                </Button>
              </Form.Item>
            </Form>
            <List
              bordered
              dataSource={categories}
              renderItem={(item: Category) => (
                <List.Item key={item.id}>
                  {item.name}
                  <DeleteOutlined style={{marginLeft: 20}} onClick={()=>showDeleteConfirm(item.id)}/>
                </List.Item>
              )}
              style={{ maxWidth: '500px', marginTop: '20px' }}
            />
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default Category;
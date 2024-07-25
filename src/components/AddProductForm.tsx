import React, { useState, useEffect } from 'react';
import { Layout, Menu, Form, Input, Button, Upload, message, Avatar } from 'antd';
import { UploadOutlined, DashboardOutlined, AppstoreOutlined, UserOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { RcFile, UploadFile } from 'antd/lib/upload/interface';
import SelectCategory from './SelectCategory';
import axiosInstance from '../api/axios';

const { Header, Sider, Content } = Layout;

interface Product {
  name: string;
  basePrice: number;
  discountPercentage: number;
  stock: number;
  description: string;
  categories: string[];
}

const AddProductForm: React.FC = () => {
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [selectedMenuKey, setSelectedMenuKey] = useState<string>('1');
  const [showNewCategoryButton, setShowNewCategoryButton] = useState<boolean>(false);
  const navigate = useNavigate();

  useEffect(() => {
    const accessToken = localStorage.getItem('accessToken');
    if (!accessToken) {
      navigate('/login');
    }
  }, [navigate]);

  const onFinish = async (values: Omit<Product, 'picture'>) => {
    const accessToken = localStorage.getItem('accessToken');
    if (!accessToken) {
      return;
    }

    const productData = {
      name: values.name,
      stock: Number(values.stock),
      basePrice: Number(values.basePrice),
      description: values.description,
      discountPercentage: Number(values.discountPercentage),
      categories: values.categories
    };
    try {
      const response = await axiosInstance.post('http://localhost:8070/product', productData, {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      });
      const productId = response.data.id;
      message.success('Product added successfully');

      if (fileList.length > 0) {
        const formData = new FormData();
        formData.append('file', fileList[0].originFileObj as RcFile);

        try {
          await axiosInstance.patch(`http://localhost:8070/product/picture/${productId}`, formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
              Authorization: `Bearer ${accessToken}`
            },
          });
          message.success('Picture uploaded successfully');
        } catch (error) {
          console.error('Error uploading picture:', error);
          message.error('Failed to upload picture');
        }
      }

      form.resetFields();
      setFileList([]);
      navigate('/list');
    } catch (error) {
      console.error('Error adding product:', error);
      message.error('Failed to add product');
    }
  };

  const handleFileChange = (info: { fileList: UploadFile[] }) => {
    setFileList(info.fileList);
  };

  const beforeUpload = (file: RcFile) => {
    const isImage = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isImage) {
      message.error('You can only upload JPG/PNG file!');
    }
    return isImage;
  };

  const handleMenuClick = ({ key }: { key: string }) => {
    setSelectedMenuKey(key);
    if (key === '3') {
      setShowNewCategoryButton(!showNewCategoryButton);
    } else {
      setShowNewCategoryButton(false);
    }
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[selectedMenuKey]}
          onClick={handleMenuClick}
        >
          <Menu.Item key="1" icon={<DashboardOutlined />}>
            Dashboard
          </Menu.Item>
          <Menu.Item key="2" icon={<AppstoreOutlined />} onClick={() => { navigate('/list') }}>
            Product
          </Menu.Item>
          <Menu.Item key="3" icon={<AppstoreOutlined />} style={{ height: 'fit-content' }}>
            Category
            {showNewCategoryButton && (
              <div style={{ marginTop: 16 }}>
                <Button type="link" style={{ color: '#1677ff', background: '#fff' }} onClick={() => navigate('/category')}>
                  New Category
                </Button>
              </div>
            )}
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
                label="Product Name"
                rules={[{ required: true, message: 'Please input the product name' }]}
                style={{ maxWidth: '700px' }}
              >
                <Input />
              </Form.Item>
              <Form.Item
                name="basePrice"
                label="Base Price"
                rules={[{ required: true, message: 'Please input the base price' }]}
                style={{ maxWidth: '700px' }}
              >
                <Input type="number" />
              </Form.Item>
              <Form.Item
                name="discountPercentage"
                label="Discount Percentage"
                rules={[{ required: true, message: 'Please input the discount percentage' }]}
                style={{ maxWidth: '700px' }}
              >
                <Input type="number" />
              </Form.Item>
              <Form.Item
                name="stock"
                label="Stock"
                rules={[{ required: true, message: 'Please input the stock' }]}
                style={{ maxWidth: '700px' }}
              >
                <Input type="number" />
              </Form.Item>
              <Form.Item
                name="description"
                label="Description"
                rules={[{ required: true, message: 'Please input the description' }]}
                style={{ maxWidth: '700px' }}
              >
                <Input.TextArea />
              </Form.Item>
              <Form.Item
                name="picture"
                label="Upload"
                style={{ maxWidth: '700px' }}
              >
                <Upload
                  fileList={fileList}
                  beforeUpload={beforeUpload}
                  onChange={handleFileChange}
                  listType="picture"
                >
                  <Button icon={<UploadOutlined />}>Select File</Button>
                </Upload>
              </Form.Item>
              <SelectCategory />
              <Form.Item wrapperCol={{ offset: 6, span: 14 }} style={{ maxWidth: '700px' }}>
                <Button type="primary" htmlType="submit">
                  Add Product
                </Button>
              </Form.Item>
            </Form>
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default AddProductForm;

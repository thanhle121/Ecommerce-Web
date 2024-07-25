import React, { useState, useEffect } from 'react';
import { Layout, Menu, Table, Button, Avatar, notification, Modal } from 'antd';
import { UserOutlined, DashboardOutlined, AppstoreOutlined, TagsOutlined, TeamOutlined, PlusOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import axios, { AxiosResponse, AxiosError } from 'axios';
import { useNavigate } from 'react-router-dom';
import Header from './Header'

const { Sider, Content } = Layout;
const { confirm } = Modal;

interface Product {
  id: string;
  name: string;
  picture: string;
  basePrice: number;
  stock: number;
  discountPercentage: number;
}

const ProductList: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response: AxiosResponse = await axios.get('http://localhost:8070/product', {
        params: {
          productName: '',
          page: 1,
          offset: 20,
        }
      });
      console.log('API response:', response.data);
      setProducts(response.data);
    } catch (error) {
      const axiosError = error as AxiosError;
      console.error('Error fetching products:', axiosError);
      if (axiosError.response && axiosError.response.status === 401) {
        navigate('/login');
      } else {
        notification.error({
          message: 'Error',
          description: 'Failed to fetch products.',
        });
      }
    }
    setLoading(false);
  };

  const deleteProduct = async (id: string) => {
    const token = localStorage.getItem('accessToken');
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    if (user.role !== 'ADMIN') {
      notification.error({
        message: 'Access Denied',
        description: 'You do not have permission to delete products.',
      });
      return;
    }

    try {
      await axios.delete(`http://localhost:8070/product/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      notification.success({
        message: 'Success',
        description: 'Product deleted successfully',
      });
      setProducts(products.filter(product => product.id !== id));
    } catch (error) {
      const axiosError = error as AxiosError;
      console.error('Error deleting product:', axiosError);
      notification.error({
        message: 'Error',
        description: 'Failed to delete product.',
      });
    }
  };

  const showDeleteConfirm = (id: string) => {
    confirm({
      title: 'Are you sure you want to delete this product?',
      icon: <ExclamationCircleOutlined />,
      content: 'This action cannot be undone',
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk() {
        deleteProduct(id);
      },
    });
  };

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Picture',
      dataIndex: 'picture',
      key: 'picture',
      render: (text: string, record: Product) => (
        <img
          src={record.picture ? 
            `http://${record.picture}` : 'https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png'}
          alt={record.name}
          style={{ width: 50, height: 50 }}
        />
      ),
    },
    {
      title: 'Base Price',
      dataIndex: 'basePrice',
      key: 'basePrice',
    },
    {
      title: 'Stock',
      dataIndex: 'stock',
      key: 'stock',
    },
    {
      title: 'Discount',
      dataIndex: 'discountPercentage',
      key: 'discountPercentage',
    },
    {
      title: 'Action',
      key: 'action',
      render: (text: string, record: Product) => (
        <span>
          <Button type="link" onClick={() => navigate('/edit', { state: { id: record.id } })}>Edit</Button>
          <Button type="link" danger onClick={() => showDeleteConfirm(record.id)}>Delete</Button>
        </span>
      ),
    },
  ];

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider collapsible collapsed={collapsed} onCollapse={setCollapsed}>
        <div className="logo" />
        <Menu theme="dark" mode="inline" defaultSelectedKeys={['2']}>
          <Menu.Item key="1" icon={<DashboardOutlined />} >
            Dashboard
          </Menu.Item>
          <Menu.Item key="2" icon={<AppstoreOutlined />} onClick={() => navigate('/list')}>
            Product
          </Menu.Item>
          <Menu.Item key="3" icon={<TagsOutlined />} >
            Category
          </Menu.Item>
          <Menu.Item key="4" icon={<TeamOutlined />} >
            User
          </Menu.Item>
          <Menu.Item key="5" icon={<AppstoreOutlined />} onClick={() => navigate('/user-list')}>
            User List
          </Menu.Item>
        </Menu>
      </Sider>
      <Layout className="site-layout">
        <Header />
        <Content style={{ margin: '0 16px' }}>
          <div style={{ margin: '16px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Button type="primary" icon={<PlusOutlined />} onClick={() => navigate('/add-product')}>
              ADD
            </Button>
          </div>
          <Table
            columns={columns}
            dataSource={products}
            rowKey="id"
            loading={loading}
            pagination={{ pageSize: 5 }}
          />
        </Content>
      </Layout>
    </Layout>
  );
};

export default ProductList;

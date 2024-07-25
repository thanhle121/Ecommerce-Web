import React, { useState, useEffect } from 'react';
import { Layout, Card, notification, Button, Select, Input, Menu } from 'antd';
import { SearchOutlined, DashboardOutlined, AppstoreOutlined, TagsOutlined, TeamOutlined } from '@ant-design/icons';
import axios, { AxiosResponse, AxiosError } from 'axios';
import { useNavigate } from 'react-router-dom';
import Header from './Header'; 
import '../style/UserList.css'

const { Sider, Content } = Layout;
const { Option } = Select;

interface Product {
  id: string;
  name: string;
  picture: string;
  basePrice: number;
  stock: number;
  discountPercentage: number;
  urlName: string; 
}

const UserList: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [displayCount, setDisplayCount] = useState(6);
  const [collapsed, setCollapsed] = useState(false);
  const [searchText, setSearchText] = useState<string>('');
  const [userRole, setUserRole] = useState<string>('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
    fetchUserRole();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response: AxiosResponse = await axios.get('http://localhost:8070/product', {
        params: {
          productName: '',
          page: 1,
          offset: 12,
        }
      });
      console.log('API response:', response.data);
      setProducts(response.data);
    } catch (error) {
      const axiosError = error as AxiosError;
      console.error('Error fetching products:', axiosError);
      notification.error({
        message: 'Error',
        description: 'Failed to fetch products.',
      });
    }
    setLoading(false);
  };

  const fetchUserRole = () => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (user && user.role) {
      setUserRole(user.role);
    }
  };

  const handleShowMore = () => {
    setDisplayCount(prevCount => prevCount + 4);
  };

  const handleShowLess = () => {
    setDisplayCount(prevCount => Math.max(prevCount - 4, 4));
  };

  const handleCardClick = (urlName: string) => {
    navigate(`/product/${urlName}`);
  };

  const handleChangeDisplayCount = (value: number) => {
    setDisplayCount(value);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.target.value);
  };

  const filterProducts = products.filter(product => 
    product.name.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <Layout style={{ minHeight: '100vh' }}>
      {userRole === 'ADMIN' && (
        <Sider collapsible collapsed={collapsed} onCollapse={setCollapsed}>
          <div className="logo" />
          <Menu theme="dark" mode="inline" defaultSelectedKeys={['5']}>
            <Menu.Item key="1" icon={<DashboardOutlined />}>
              Dashboard
            </Menu.Item>
            <Menu.Item key="2" icon={<AppstoreOutlined />} onClick={() => navigate('/list')}>
              Product
            </Menu.Item>
            <Menu.Item key="3" icon={<TagsOutlined />} onClick={() => navigate('/category')}>
              Category
            </Menu.Item>
            <Menu.Item key="4" icon={<TeamOutlined />}>
              User
            </Menu.Item>
            <Menu.Item key="5" icon={<AppstoreOutlined />} onClick={() => navigate('/user-list')}>
              User List
            </Menu.Item>
          </Menu>
        </Sider>
      )}
      <Layout className="site-layout">
        <Header />
        <Content style={{ margin: '0 16px' }}>
          <div style={{ margin: '16px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }} className='product-list-top'>
            <h2>Product List</h2>
            <Input prefix={<SearchOutlined />} placeholder='Search something' style={{ maxWidth: 300 }} onChange={handleSearch} />
            <Select style={{ width: 120 }} onChange={handleChangeDisplayCount} defaultValue={6}>
              <Option value={6}>6</Option>
              <Option value={8}>8</Option>
              <Option value={12}>12</Option>
            </Select>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px' }} className='product-list-container'>
            {filterProducts.slice(0, displayCount).map((product) => (
              <div key={product.id} className='product-card'>
                <Card
                  hoverable
                  cover={<img alt={product.name} src={product.picture ? 
                    `http://${product.picture}` : 'https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png'} 
                    style={{ height: '160px', objectFit: 'contain' }} />}
                  onClick={() => handleCardClick(product.urlName)}
                >
                  <Card.Meta title={product.name} />
                  <p>Base Price: {product.basePrice}</p>
                  <p>Stock: {product.stock}</p>
                  <p>Discount: {product.discountPercentage}%</p>
                </Card>
              </div>
            ))}
          </div>
          <div style={{ textAlign: 'center', marginTop: '16px' }}>
            {displayCount < products.length && (
              <Button type="primary" onClick={handleShowMore}>Xem Tiếp</Button>
            )}
            {displayCount > 4 && (
              <Button type="default" onClick={handleShowLess} style={{ marginLeft: '8px' }}>Ẩn Bớt</Button>
            )}
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default UserList;

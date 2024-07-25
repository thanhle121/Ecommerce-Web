import React, { useState, useEffect } from 'react';
import axios, { AxiosResponse, AxiosError } from 'axios';
import { Button, Layout, notification, Popconfirm, Spin, Table, Typography } from 'antd';
import Header from './Header';
import { useNavigate } from 'react-router-dom';

const { Content } = Layout;
const { Title } = Typography;

interface Order {
  id: string;
  userId: string;
  productName: string;
  amount: number;
  totalPrice: number;
  createdAt: string;
}

const ListOrderAdmin: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('accessToken');
      const response: AxiosResponse = await axios.get('http://localhost:8070/purchase/admin?page=1&offset=10', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const ordersData = response.data.map((order: any) => ({
        ...order,
        productName: order.product.name, 
      }));

      setOrders(ordersData);
    } catch (error) {
      const axiosError = error as AxiosError;
      console.error('Error fetching orders:', axiosError);
      notification.error({
        message: 'Error',
        description: 'Failed to fetch orders.',
      });
    }
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    try {
      const token = localStorage.getItem('accessToken');
      await axios.delete(`http://localhost:8070/purchase/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      notification.success({
        message: 'Success',
        description: 'Order deleted successfully.',
      });
      fetchOrders();
    } catch (error) {
      const axiosError = error as AxiosError;
      console.error('Error deleting order:', axiosError);
      notification.error({
        message: 'Error',
        description: 'Failed to delete order.',
      });
    }
  };

  const columns = [
    {
      title: 'Order ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'Product Name',
      dataIndex: 'productName',
      key: 'productName',
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      key: 'amount',
    },
    {
      title: 'Total Price',
      dataIndex: 'totalPrice',
      key: 'totalPrice',
      render: (text: number) => `$${Number(text).toFixed(2)}`,
    },
    {
      title: 'Created At',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (text: string) => new Date(text).toLocaleString(),
    },
    {
      title: 'Action',
      key: 'action',
      render: (text: string, record: Order) => (
        <Popconfirm
          title="Are you sure to delete this order?"
          onConfirm={() => handleDelete(record.id)}
          okText="Yes"
          cancelText="No"
        >
          <Button type="link" danger>
            Delete
          </Button>
        </Popconfirm>
      ),
    },
  ];

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header />
      <Content style={{ padding: '24px', background: '#fff' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Title level={2}>List of Orders (Admin)</Title>
          <Button onClick={() => navigate('/user-list')}>Go back</Button>
        </div>
        {loading ? (
          <Spin size="large" />
        ) : (
          <Table columns={columns} dataSource={orders} rowKey="id" />
        )}
      </Content>
    </Layout>
  );
};

export default ListOrderAdmin;

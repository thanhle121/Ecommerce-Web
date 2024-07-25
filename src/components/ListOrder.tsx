// import React, { useState, useEffect } from 'react';
// import axios, { AxiosResponse, AxiosError } from 'axios';
// import { Button, Input, Layout, Modal, notification, Rate, Spin, Table, Typography } from 'antd';
// import Header from './Header';
// import { useNavigate } from 'react-router-dom';

// const { Content } = Layout;
// const { Title } = Typography;

// interface Order {
//   id: string;
//   userId: string;
//   productName: string;
//   amount: number;
//   totalPrice: number;
//   createdAt: string;
// }

// const ListOrder: React.FC = () => {
//   const [orders, setOrders] = useState<Order[]>([]);
//   const [loading, setLoading] = useState(false);
//   const [modalVisible, setModalVisible] = useState(false);
//   const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
//   const [reviewNote, setReviewNote] = useState(0);
//   const [reviewComment, setReviewComment] = useState('');
//   const navigate = useNavigate();

//   useEffect(() => {
//     fetchOrders();
//   }, []);

//   const fetchOrders = async () => {
//     setLoading(true);
//     try {
//       const token = localStorage.getItem('accessToken');
//       const user = JSON.parse(localStorage.getItem('user') || '{}');
//       const userId = user.id;
//       const response: AxiosResponse = await axios.get(`http://localhost:8070/purchase?userId=${userId}&page=1&offset=10`, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });

//       const formattedOrders: Order[] = response.data.map((order: any) => ({
//         id: order.id,
//         userId: order.userId,
//         productName: order.product.name,
//         amount: order.amount,
//         totalPrice: Number(order.totalPrice),
//         createdAt: order.createdAt,
//       }));

//       setOrders(formattedOrders);
//     } catch (error) {
//       const axiosError = error as AxiosError;
//       console.error('Error fetching orders:', axiosError);
//       notification.error({
//         message: 'Error',
//         description: 'Failed to fetch orders.',
//       });
//     }
//     setLoading(false);
//   };

//   const handleReview = (orderId: string) => {
//     setSelectedOrderId(orderId);
//     setModalVisible(true);
//   };

//   const handleModalSubmit = async () => {
//     try {
//       const token = localStorage.getItem('accessToken');
//       const response = await axios.patch(`http://localhost:8070/purchase/review/${selectedOrderId}`, {
//         reviewNote,
//         reviewComment,
//       }, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });
//     console.log(response)
//       notification.success({
//         message: 'Success',
//         description: 'Review submitted successfully.',
//       });
//       setModalVisible(false);
//       setReviewNote(0);
//       setReviewComment('');
//     } catch (error) {
//       const axiosError = error as AxiosError;
//       console.error('Error submitting review:', axiosError);
//       notification.error({
//         message: 'Error',
//         description: 'Failed to submit review.',
//       });
//     }
//   };

//   const columns = [
//     {
//       title: 'Order ID',
//       dataIndex: 'id',
//       key: 'id',
//     },
//     {
//       title: 'Product Name',
//       dataIndex: 'productName',
//       key: 'productName',
//     },
//     {
//       title: 'Amount',
//       dataIndex: 'amount',
//       key: 'amount',
//     },
//     {
//       title: 'Total Price',
//       dataIndex: 'totalPrice',
//       key: 'totalPrice',
//       render: (text: number) => `$${Number(text).toFixed(2)}`,
//     },
//     {
//       title: 'Created At',
//       dataIndex: 'createdAt',
//       key: 'createdAt',
//       render: (text: string) => new Date(text).toLocaleString(),
//     },
//     {
//       title: 'Action',
//       key: 'action',
//       render: (_: any, record: Order) => (
//         <Button onClick={() => handleReview(record.id)}>Review</Button>
//       ),
//     },
//   ];

//   return (
//     <Layout style={{ minHeight: '100vh' }}>
//       <Header />
//       <Content style={{ padding: '24px', background: '#fff' }}>
//         <Title level={2}>List of Orders</Title>
//         <Button onClick={() => navigate('/user-list')} style={{ position: 'absolute', top: 120, right: 24 }}>Go back</Button>
//         {loading ? (
//           <Spin size="large" />
//         ) : (
//           <Table columns={columns} dataSource={orders} rowKey="id" />
//         )}
//       </Content>
//       <Modal
//         title="Submit Review"
//         visible={modalVisible}
//         onCancel={() => setModalVisible(false)}
//         onOk={handleModalSubmit}
//       >
//         <Rate onChange={(value) => setReviewNote(value)} value={reviewNote} />
//         <Input.TextArea
//           rows={4}
//           onChange={(e) => setReviewComment(e.target.value)}
//           value={reviewComment}
//           placeholder="Write your review here"
//         />
//       </Modal>
//     </Layout>
//   );
// };

// export default ListOrder;
import React, { useState, useEffect } from 'react';
import axios, { AxiosResponse, AxiosError } from 'axios';
import { Button, Input, Layout, Modal, notification, Rate, Spin, Table, Typography } from 'antd';
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
  reviewNote?: number;
  reviewComment?: string;
}

const ListOrder: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [reviewNote, setReviewNote] = useState(0);
  const [reviewComment, setReviewComment] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('accessToken');
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const userId = user.id;
      const response: AxiosResponse = await axios.get(`http://localhost:8070/purchase?userId=${userId}&page=1&offset=10`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const formattedOrders: Order[] = response.data.map((order: any) => ({
        id: order.id,
        userId: order.userId,
        productName: order.product.name,
        amount: order.amount,
        totalPrice: Number(order.totalPrice),
        createdAt: order.createdAt,
        reviewNote: order.reviewNote || 0,
        reviewComment: order.reviewComment || '',
      }));

      setOrders(formattedOrders);
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

  const handleReview = (orderId: string) => {
    setSelectedOrderId(orderId);
    setModalVisible(true);
  };

  const handleModalSubmit = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      await axios.patch(`http://localhost:8070/purchase/review/${selectedOrderId}`, {
        reviewNote,
        reviewComment,
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.id === selectedOrderId
            ? { ...order, reviewNote, reviewComment }
            : order
        )
      );

      notification.success({
        message: 'Success',
        description: 'Review submitted successfully.',
      });
      setModalVisible(false);
      setReviewNote(0);
      setReviewComment('');
    } catch (error) {
      const axiosError = error as AxiosError;
      console.error('Error submitting review:', axiosError);
      notification.error({
        message: 'Error',
        description: 'Failed to submit review.',
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
      title: 'Review Note',
      dataIndex: 'reviewNote',
      key: 'reviewNote',
      render: (note: number) => note ? `${note}/5` : 'Null',
    },
    {
      title: 'Review Comment',
      dataIndex: 'reviewComment',
      key: 'reviewComment',
      render: (comment: string) => comment || 'Null',
    },
    {
      title: 'Action',
      key: 'action',
      render: (_: any, record: Order) => (
        <Button onClick={() => handleReview(record.id)}>Review</Button>
      ),
    },
  ];

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header />
      <Content style={{ padding: '24px', background: '#fff' }}>
        <Title level={2}>List of Orders</Title>
        <Button onClick={() => navigate('/user-list')} style={{ position: 'absolute', top: 120, right: 24 }}>Go back</Button>
        {loading ? (
          <Spin size="large" />
        ) : (
          <Table columns={columns} dataSource={orders} rowKey="id" />
        )}
      </Content>
      <Modal
        title="Submit Review"
        visible={modalVisible}
        onCancel={() => setModalVisible(false)}
        onOk={handleModalSubmit}
      >
        <Rate onChange={(value) => setReviewNote(value)} value={reviewNote} />
        <Input.TextArea
          rows={4}
          onChange={(e) => setReviewComment(e.target.value)}
          value={reviewComment}
          placeholder="Write your review here"
        />
      </Modal>
    </Layout>
  );
};

export default ListOrder;

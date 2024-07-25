// import React, { useState, useEffect } from 'react';
// import { useNavigate, useParams } from 'react-router-dom';
// import axios, { AxiosResponse, AxiosError } from 'axios';
// import { Layout, notification, Spin, Image, Typography, Card, Button, InputNumber, Row, Col, Modal } from 'antd';
// import Header from './Header';
// import '../style/ProductDetail.css';

// const { Content } = Layout;
// const { Title, Paragraph } = Typography;

// interface Product {
//   id: string;
//   name: string;
//   picture: string;
//   basePrice: number;
//   stock: number;
//   discountPercentage: number;
//   description: string;
// }

// const ProductDetail: React.FC = () => {
//   const { urlName } = useParams<{ urlName: string }>();
//   const [product, setProduct] = useState<Product | null>(null);
//   const [loading, setLoading] = useState(false);
//   const [quantity, setQuantity] = useState(1);
//   const navigate = useNavigate();

//   useEffect(() => {
//     fetchProductDetail();
//   }, [urlName]);

//   const fetchProductDetail = async () => {
//     setLoading(true);
//     try {
//       const response: AxiosResponse = await axios.get(`http://localhost:8070/product/${urlName}`);
//       setProduct(response.data);
//       console.log(response.data);
//     } catch (error) {
//       const axiosError = error as AxiosError;
//       console.error('Error fetching product detail:', axiosError);
//       notification.error({
//         message: 'Error',
//         description: 'Failed to fetch product detail.',
//       });
//     }
//     setLoading(false);
//   };

//   const showConfirmation = () => {
//     Modal.confirm({
//       title: 'Confirm Purchase',
//       content: 'Are you sure you want to purchase this item?',
//       onOk() {
//         handlePurchase();
//       },
//       onCancel() {},
//     });
//   };

//   const handlePurchase = async () => {
//     const token = localStorage.getItem('accessToken');

//     if (!token) {
//       Modal.warning({
//         title: 'Login Required',
//         content: 'Please login to purchase',
//         onOk() {
//           navigate('/login');
//         },
//         closable: true,
//       });
//     } else {
//       try {
//         const response = await axios.post(
//           'http://localhost:8070/purchase',
//           {
//             productId: product?.id,
//             amount: quantity,
//           },
//           {
//             headers: {
//               Authorization: `Bearer ${token}`,
//             },
//           }
//         );

//         notification.success({
//           message: 'Purchase Success',
//           description: 'Purchase completed successfully.',
//           btn: (
//             <Button type="primary" onClick={() => navigate('/list-order')}>
//               ListOrder
//             </Button>
//           ),
//         });
//       } catch (error) {
//         notification.error({
//           message: 'Purchase Failed',
//           description: 'Failed to complete purchase.',
//         });
//       }
//     }
//   };

//   return (
//     <Layout style={{ minHeight: '100vh' }}>
//       <Layout>
//         <Header />
//         <Content className="product-detail-content">
//           {loading ? (
//             <Spin size="large" />
//           ) : product ? (
//             <div className="product-detail-container">
//               <Image
//                 width={300}
//                 src={product.picture ? `http://${product.picture}` : 'https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png'}
//                 alt={product.name}
//                 style={{ margin: 'auto', width: 500, height: 'auto', maxHeight: '600px' }}
//                 preview={false}
//               />
//               <div className="product-detail-info">
//                 <Card className="product-detail-card" hoverable>
//                   <Title level={3} style={{ marginTop: '-30px' }}>{product.name}</Title>
//                   <Paragraph style={{ marginTop: 40 }}>
//                     <strong>Base Price:</strong> ${product.basePrice}
//                   </Paragraph>
//                   <Paragraph>
//                     <strong>Stock:</strong> {product.stock}
//                   </Paragraph>
//                   <Paragraph>
//                     <strong>Discount:</strong> {product.discountPercentage}%
//                   </Paragraph>
//                   <Paragraph>
//                     <strong>Description:</strong> {product.description}
//                   </Paragraph>
//                 </Card>
//                 <Row className='row-button' gutter={[16, 16]} style={{ marginTop: 40 }}>
//                   <Col>
//                     <InputNumber min={1} max={product.stock} value={quantity} onChange={(value) => setQuantity(value ?? 1)} />
//                   </Col>
//                   <Col>
//                     <Button type="primary" onClick={showConfirmation}>Purchase</Button>
//                   </Col>
//                 </Row>
//               </div>
//             </div>
//           ) : (
//             <p>Product not found</p>
//           )}
//         </Content>
//       </Layout>
//     </Layout>
//   );
// };

// export default ProductDetail;
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios, { AxiosResponse, AxiosError } from 'axios';
import { Layout, notification, Spin, Image, Typography, Card, Button, InputNumber, Modal } from 'antd';
import Header from './Header';
import '../style/ProductDetail.css';

const { Content } = Layout;
const { Title, Paragraph } = Typography;

interface Product {
  id: string;
  name: string;
  picture: string;
  basePrice: number;
  stock: number;
  discountPercentage: number;
  description: string;
}

const ProductDetail: React.FC = () => {
  const { urlName } = useParams<{ urlName: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProductDetail();
  }, [urlName]);

  const fetchProductDetail = async () => {
    setLoading(true);
    try {
      const response: AxiosResponse = await axios.get(`http://localhost:8070/product/${urlName}`);
      setProduct(response.data);
    } catch (error) {
      const axiosError = error as AxiosError;
      console.error('Error fetching product detail:', axiosError);
      notification.error({
        message: 'Error',
        description: 'Failed to fetch product detail.',
      });
    }
    setLoading(false);
  };

  const showConfirmation = () => {
    Modal.confirm({
      title: 'Confirm Purchase',
      content: 'Are you sure you want to purchase this item?',
      onOk() {
        handlePurchase();
      },
      onCancel() {},
    });
  };

  const handlePurchase = async () => {
    const token = localStorage.getItem('accessToken');

    if (!token) {
      Modal.warning({
        title: 'Login Required',
        content: 'Please login to purchase',
        onOk() {
          navigate('/login');
        },
        closable: true,
      })
    } else {
      try {
        await axios.post(
          'http://localhost:8070/purchase',
          {
            productId: product?.id,
            amount: quantity,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        notification.success({
          message: 'Purchase Success',
          description: 'Purchase completed successfully.',
          btn: (
            <Button type="primary" onClick={() => navigate('/list-order')}>
              ListOrder
            </Button>
          ),
        });
      } catch (error) {
        notification.error({
          message: 'Purchase Failed',
          description: 'Failed to complete purchase.',
        });
      }
    }
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Layout>
        <Header />
        <Content className="product-detail-container">
          {loading ? (
            <Spin size="large" />
          ) : product ? (
            <>
              <Image
                className="product-detail-image"
                src={product.picture ? `http://${product.picture}` : 'https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png'}
                alt={product.name}
                preview={false}
              />
              <div className="product-detail-content">
                <Card className="product-detail-card" hoverable>
                  <Title level={3}>{product.name}</Title>
                  <Paragraph>
                    <strong>Base Price:</strong> ${product.basePrice}
                  </Paragraph>
                  <Paragraph>
                    <strong>Stock:</strong> {product.stock}
                  </Paragraph>
                  <Paragraph>
                    <strong>Discount:</strong> {product.discountPercentage}%
                  </Paragraph>
                  <Paragraph>
                    <strong>Description:</strong> {product.description}
                  </Paragraph>
                </Card>
                <div className="product-detail-actions">
                  <InputNumber min={1} max={product.stock} value={quantity} onChange={(value) => setQuantity(value ?? 1)} />
                  <Button type="primary" onClick={showConfirmation}>Purchase</Button>
                </div>
              </div>
            </>
          ) : (
            <p>Product not found</p>
          )}
        </Content>
      </Layout>
    </Layout>
  );
};

export default ProductDetail;


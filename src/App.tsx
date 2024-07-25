import React from 'react';
import './style/login.css'
import LoginForm from './components/LoginForm';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import SignUpForm from './components/SignUpForm';
import ProductList from './components/ProductList';
import AddProductForm from './components/AddProductForm';
import Category from './components/Category';
import EditProduct from './components/EditProduct';
import UserList from './components/UserList';
import ProductDetail from './components/ProductDetail';
import ListOrder from './components/ListOrder';
import ListOrderAdmin from './components/ListOrderAdmin';

const App: React.FC = () => {
  return (
    <Router>
      <div className="login">
          <Routes>
            <Route path="/login" element={<LoginForm />} />
            <Route path="/category" element={<Category />} />
            <Route path="/signup" element={<SignUpForm />} />
            <Route path="/user-list" element={<UserList />} />
            <Route path="/edit" element={<EditProduct />} />
            <Route path="/list-order-admin" element={<ListOrderAdmin />} />
            <Route path="/list-order" element={<ListOrder />} />
            <Route path="/list" element={<ProductList />} />
            <Route path="/add-product" element={<AddProductForm />} />
            <Route path="/" element={<UserList />} />
            <Route path="/product/:urlName" element={<ProductDetail />} />
          </Routes>
      </div>
    </Router>
  );
};

export default App;

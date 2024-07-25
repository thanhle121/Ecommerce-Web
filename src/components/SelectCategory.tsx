import React, { useEffect, useState } from 'react';
import { Form, Select, message } from 'antd';
import axiosInstance from '../api/axios';
import { getAllCategory } from '../api/category/getAllCategory';
import Category from './Category';

const { Option } = Select;

interface CategoryType {
  id: string;
  name: string
}


const SelectCategory: React.FC = () => {
    const [categories, setCategories] = useState<CategoryType[]>([]);

    const fetchCategories = async () => {
        try {
          const response = await axiosInstance.get('http://localhost:8070/category');
          console.log('response', response)
          setCategories(response.data)
        } catch (error) {
          console.error(error);
          message.error('Failed to fetch categories');
        }
      };
    
      useEffect(() => {
        fetchCategories();
      }, []);

    return (
        <Form.Item
            name="categories"
            label="Categories"
            rules={[{ required: true, message: 'Please select the categories' }]}
            style={{ maxWidth: '700px' }}
        >
            <Select mode="multiple" placeholder="Select categories">
                {categories.map((item,index) => (
                    <Option key={index} value={item.id}>{item.name}</Option>
                ))}
            </Select>
        </Form.Item>
    );
};

export default SelectCategory;

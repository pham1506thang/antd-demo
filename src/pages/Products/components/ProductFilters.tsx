import React from 'react';
import {
  Form,
  Row,
  Col,
  Input,
  Select,
  Button,
  Space,
  InputNumber,
} from 'antd';
import { SearchOutlined, UndoOutlined } from '@ant-design/icons';

const { Option } = Select;

const ProductFilters: React.FC = () => {
  const [form] = Form.useForm();

  const handleReset = () => {
    form.resetFields();
  };

  return (
    <Form form={form} layout="vertical">
      <Row gutter={16}>
        <Col span={6}>
          <Form.Item name="search" label="Tìm kiếm">
            <Input
              placeholder="Search by name, SKU..."
              prefix={<SearchOutlined />}
            />
          </Form.Item>
        </Col>
        <Col span={4}>
          <Form.Item name="category" label="Danh mục">
            <Select placeholder="Select category">
              <Option value="electronics">Electronics</Option>
              <Option value="clothing">Clothing</Option>
              <Option value="books">Books</Option>
              <Option value="home">Home & Garden</Option>
            </Select>
          </Form.Item>
        </Col>
        <Col span={4}>
          <Form.Item name="status" label="Trạng thái">
            <Select placeholder="Select status">
              <Option value="in_stock">In Stock</Option>
              <Option value="low_stock">Low Stock</Option>
              <Option value="out_of_stock">Out of Stock</Option>
            </Select>
          </Form.Item>
        </Col>
        <Col span={4}>
          <Form.Item name="minPrice" label="Giá tối thiểu">
            <InputNumber
              style={{ width: '100%' }}
              placeholder="Min price"
              prefix="$"
            />
          </Form.Item>
        </Col>
        <Col span={4}>
          <Form.Item name="maxPrice" label="Giá tối đa">
            <InputNumber
              style={{ width: '100%' }}
              placeholder="Max price"
              prefix="$"
            />
          </Form.Item>
        </Col>
        <Col span={2}>
          <Form.Item label=" " style={{ marginTop: '29px' }}>
            <Space>
              <Button type="primary" icon={<SearchOutlined />}>
                Search
              </Button>
              <Button icon={<UndoOutlined />} onClick={handleReset}>
                Reset
              </Button>
            </Space>
          </Form.Item>
        </Col>
      </Row>
    </Form>
  );
};

export default ProductFilters;

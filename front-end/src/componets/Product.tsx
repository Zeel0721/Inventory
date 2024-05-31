import { useState } from "react";
import {
  Table,
  Button,
  Space,
  Modal,
  Form,
  Input,
  InputNumber,
  message,
  Spin,
} from "antd";
import {
  PlusOutlined,
  DeleteOutlined,
  ExclamationCircleOutlined,
  LoadingOutlined,
} from "@ant-design/icons";
import {
  useGetAllProductsQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
} from "../services/Productlist";
import { useMediaQuery } from "react-responsive";

const { confirm } = Modal;

const Product = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [formData, setFormData] = useState<any>({});
  const [isEditing, setIsEditing] = useState(false);
  const [form] = Form.useForm();
  const { data, error, isLoading, refetch } = useGetAllProductsQuery({});
  const [createProduct] = useCreateProductMutation();
  const [updateProduct] = useUpdateProductMutation();
  const [deleteProduct] = useDeleteProductMutation();

  const isMobile = useMediaQuery({ maxWidth: 1050 });

  const handleCreate = async () => {
    try {
      const values = await form.validateFields();
      await createProduct(values);
      message.success("Product created successfully!");
      setIsModalVisible(false);
      refetch();
      form.resetFields();
    } catch (error) {
      message.error("Failed to create product!");
    }
  };

  const handleUpdate = async () => {
    try {
      const values = await form.validateFields();
      if (!formData) throw new Error("Product ID is missing!");
      await updateProduct({ id: formData._id, updatedProduct: values });
      message.success("Product updated successfully!");
      setIsModalVisible(false);
      form.resetFields();
      refetch();
    } catch (error) {
      message.error("Failed to update product!");
    }
  };

  const handleDelete = (id: string) => {
    confirm({
      title: "Are you sure you want to delete this product?",
      icon: <ExclamationCircleOutlined />,
      content: "This action cannot be undone.",
      onOk: async () => {
        try {
          await deleteProduct(id);
          message.success("Product deleted successfully!");
          refetch();
        } catch (error) {
          message.error("Failed to delete product!");
        }
      },
      onCancel() {},
    });
  };

  const columns = [
    {
      title: "ID",
      dataIndex: "_id",
      key: "_id",
      render: (_: any, __: any, index: number) => index + 1,
      width: 310,
    },
    {
      title: "Product Name",
      dataIndex: "productsname",
      key: "productsname",
      width: 200,
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Quantity",
      dataIndex: "quantity",
      key: "quantity",
      width: 150,
    },
    {
      title: "Action",
      key: "action",
      width: 200,
      render: (_: any, record: any) => (
        <Space size="middle">
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => handleEdit(record)}
          >
            Edit
          </Button>
          <Button
            type="primary"
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record._id)}
          >
            Delete
          </Button>
        </Space>
      ),
    },
  ];

  const handleEdit = (record: any) => {
    form.setFieldsValue(record);
    setFormData(record);
    setIsEditing(true);
    setIsModalVisible(true);
  };

  const handleAdd = () => {
    form.resetFields();
    setFormData({});
    setIsEditing(false);
    setIsModalVisible(true);
  };

  if (isLoading)
    return (
      <Spin
        className="h-full flex justify-center items-center"
        indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />}
      />
    );
  if (error) return <p>Error: {"data" in error}</p>;

  return (
    <div className="w-full h-full p-4 overflow-hidden">
      <div className="flex justify-between items-center mb-4">
        <h2>Product</h2>
        <Button type="primary" onClick={handleAdd}>
          Add Product
        </Button>
      </div>
      {isLoading ? (
        <div>Loading...</div>
      ) : error ? (
        <div>Error: {"data" in error}</div>
      ) : isMobile ? (
        <div
          className="space-y-4 overflow-y-auto"
          style={{ maxHeight: "calc(100vh - 200px)" }}
        >
          {data.map((product: any) => (
            <div key={product._id} className="p-4 border rounded-lg shadow-md">
              <div>
                <strong>ID:</strong> {product._id}
              </div>
              <div>
                <strong>Product Name:</strong> {product.productsname}
              </div>
              <div>
                <strong>Description:</strong> {product.description}
              </div>
              <div>
                <strong>Quantity:</strong> {product.quantity}
              </div>
              <div className="mt-2">
                <Button
                  type="primary"
                  icon={<PlusOutlined />}
                  onClick={() => handleEdit(product)}
                  className="mr-2 mt-2"
                >
                  Edit
                </Button>
                <Button
                  type="primary"
                  danger
                  icon={<DeleteOutlined />}
                  onClick={() => handleDelete(product._id)}
                  className="mr-2 mt-2"
                >
                  Delete
                </Button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <Table
          columns={columns}
          dataSource={data}
          pagination={{ pageSize: 4 }}
          rowKey="_id"
        />
      )}
      <Modal
        title={isEditing ? "Edit Product" : "Create Product"}
        open={isModalVisible}
        onOk={isEditing ? handleUpdate : handleCreate}
        onCancel={() => setIsModalVisible(false)}
        className="max-w-full md:max-w-lg lg:max-w-xl h-auto md:h-96 lg:h-auto"
      >
        <Form
          form={form}
          initialValues={isEditing ? formData : null}
          onValuesChange={(_, allValues) => {
            setFormData((prev: any) => ({ ...prev, ...allValues }));
          }}
          className="space-y-4 p-4 bg-white shadow-md rounded-md"
        >
          <div className="flex flex-col space-y-4">
            <div className="flex flex-col md:flex-row items-center md:space-x-4">
              <label className="md:w-1/4 text-right font-semibold md:text-left">
                Product Name
              </label>
              <Form.Item
                name="productsname"
                rules={[
                  { required: true, message: "Please input product name!" },
                ]}
                className="flex-1"
              >
                <Input className="w-full border border-gray-300 rounded-md shadow-sm" />
              </Form.Item>
            </div>

            <div className="flex flex-col md:flex-row items-center md:space-x-4">
              <label className="md:w-1/4 text-right font-semibold md:text-left">
                Description
              </label>
              <Form.Item name="description" className="flex-1">
                <Input className="w-full border border-gray-300 rounded-md shadow-sm" />
              </Form.Item>
            </div>

            <div className="flex flex-col md:flex-row items-center md:space-x-4">
              <label className="md:w-1/4 text-right font-semibold md:text-left">
                Quantity
              </label>
              <Form.Item
                name="quantity"
                rules={[
                  {
                    required: true,
                    type: "number",
                    message: "Please input quantity!",
                  },
                ]}
                className="flex-1"
              >
                <InputNumber
                  min={1}
                  className="w-full border border-gray-300 rounded-md shadow-sm"
                />
              </Form.Item>
            </div>
          </div>
        </Form>
      </Modal>
    </div>
  );
};

export default Product;

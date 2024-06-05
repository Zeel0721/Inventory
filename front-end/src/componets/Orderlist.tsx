import { useState } from "react";
import {
  Table,
  Space,
  Button,
  Tooltip,
  Upload,
  message,
  Modal,
  Form,
  Input,
  Select,
  InputNumber,
  Image,
  Card,
  Grid,
  Spin,
} from "antd";
import type { TableColumnsType } from "antd";
import {
  EyeOutlined,
  UploadOutlined,
  PlusOutlined,
  LoadingOutlined,
} from "@ant-design/icons";
import {
  useGetAllOrderlistQuery,
  useCreateOrderlistMutation,
} from "../services/Orderlist";
import { useGetAllProductsQuery } from "../services/Productlist";
import { order } from "../types";
import axios from "axios";

const { Option } = Select;
const { useBreakpoint } = Grid;

const Orderlist = () => {
  const { data, isLoading, error, refetch } = useGetAllOrderlistQuery({});
  const {
    data: products,
    isLoading: productLoading,
    refetch: productRefetch,
  } = useGetAllProductsQuery({});
  const [createOrderlist] = useCreateOrderlistMutation();
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [createOrderModalVisible, setCreateOrderModalVisible] =
    useState<boolean>(false);
  const [selectedOrder, setSelectedOrder] = useState<any>();
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [maxOrder, setMaxOrder] = useState<any>({});
  const screens = useBreakpoint();
  const [form] = Form.useForm();

  const handleView = (record: any) => {
    setSelectedOrder(record);
    setModalVisible(true);
  };

  const handleCancel = () => {
    setModalVisible(false);
  };

  const handleCreateOrder = () => {
    setCreateOrderModalVisible(true);
  };

  const handleRepeatOrder = (record: any) => {
    record.orderdetail.forEach((order: any, index: number) => {
      setMaxOrder((prev: any) => ({
        ...prev,
        [index]: products.find(
          (product: any) => product.productsname === order.productname
        )["quantity"],
      }));
      setSelectedProducts((prev: any) => [...prev, order.productname]);
    });
    form.setFieldsValue(record);
    setCreateOrderModalVisible(true);
  };

  const handleCreateOrderCancel = () => {
    setSelectedProducts([]);
    setMaxOrder({});
    form.resetFields();
    setCreateOrderModalVisible(false);
  };

  const handleCreateOrderlist = async () => {
    try {
      const values = await form.validateFields();
      const { companyname, orderdetail: selectedProducts } = values;

      for (let product of selectedProducts) {
        const availableProduct = products.find(
          (p: any) => p.productsname === product.productname
        );
        if (!availableProduct)
          throw new Error(`No product by ${product.productname} name found`);
        if (availableProduct.quantity < product.quantity) {
          throw new Error(
            `Insufficient quantity for product: ${product.productname}`
          );
        }
      }

      const orderdetail = selectedProducts.map((product: any) => ({
        productname: product.productname,
        quantity: product.quantity,
      }));
      const currentDate = new Date();

      const newOrderlistData = {
        companyname,
        orderdetail,
        date: `${currentDate.getFullYear()}-${String(
          currentDate.getMonth() + 1
        ).padStart(2, "0")}-${String(currentDate.getDate()).padStart(2, "0")}`,
      };
      await createOrderlist(newOrderlistData).unwrap();
      message.success("Order list created successfully.");
      setCreateOrderModalVisible(false);
      setSelectedProducts([]);
      setMaxOrder({});
      form.resetFields();
      refetch();
      productRefetch();
    } catch (error: any) {
      message.error(
        `Failed to create order list: ${error.data?.message || error.message}`
      );
    }
  };

  const columns: TableColumnsType = [
    {
      title: "ID",
      dataIndex: "_id",
      key: "_id",
      render: (_: any, __: order, index: number) => index + 1,
      width: 310,
    },
    {
      title: "Company Name",
      dataIndex: "companyname",
      key: "companyname",
      width: 500,
    },
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
      render: (createdAt: any) => new Date(createdAt).toLocaleDateString(),
      width: 250,
    },
    {
      title: "Action",
      key: "action",
      render: (_: any, record: any) => (
        <Space size="middle" align="center">
          <Tooltip title="View">
            <Button
              type="link"
              icon={<EyeOutlined />}
              onClick={() => handleView(record)}
            />
          </Tooltip>
          <Tooltip title="Upload Image">
            {!record.invoice ? (
              <Upload beforeUpload={(file) => handleUpload(record, file)}>
                <Button icon={<UploadOutlined />} />
              </Upload>
            ) : (
              <Image
                width={50}
                src={`data:image/png;base64,${record.invoice}`}
              />
            )}
          </Tooltip>
          <Tooltip>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => handleRepeatOrder(record)}
            >
              Repeat Order
            </Button>
          </Tooltip>
        </Space>
      ),
    },
  ];

  const handleUpload = async (record: any, file: File) => {
    const formData = new FormData();
    formData.append("image", file);
    await axios.post(
      `http://localhost:3000/order/invoice/${record._id}`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("accessToken")}`,
        },
      }
    );
    message.success(`${file.name} file uploaded successfully.`);
    await refetch();
    return false;
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
    <div>
      <h2 className=" dark:text-white">Order List</h2>
      <Button
        type="primary"
        icon={<PlusOutlined />}
        onClick={handleCreateOrder}
        className="mb-6"
      >
        Create Order
      </Button>
      {screens.md ? (
        <Table columns={columns} dataSource={data} />
      ) : (
        data.map((item: any) => (
          <Card key={item._id}>
            <div className="space-y-4">
              <div>
                <b>Company Name:</b> {item.companyname}
              </div>
              <div>
                <b>Date:</b> {new Date(item.date).toLocaleDateString()}
              </div>
              <div>
                <b>Action:</b>
                <Space size="middle" align="center">
                  <Tooltip title="View">
                    <Button
                      type="link"
                      icon={<EyeOutlined />}
                      onClick={() => handleView(item)}
                    />
                  </Tooltip>
                  <Tooltip
                    title="Upload Image"
                    style={{ height: 32, width: 32 }}
                  >
                    {!item.invoice ? (
                      <Upload beforeUpload={(file) => handleUpload(item, file)}>
                        <Button icon={<UploadOutlined />} />
                      </Upload>
                    ) : (
                      <Image
                        width={50}
                        src={`data:image/png;base64,${item.invoice}`}
                      />
                    )}
                  </Tooltip>
                  <Tooltip>
                    <Button
                      type="primary"
                      icon={<PlusOutlined />}
                      onClick={handleCreateOrder}
                    >
                      Repeat Order
                    </Button>
                  </Tooltip>
                </Space>
              </div>
            </div>
          </Card>
        ))
      )}
      <Modal
        title="Order Details"
        open={modalVisible}
        onCancel={handleCancel}
        footer={null}
      >
        {selectedOrder && (
          <div className="m-0   shadow-lg text-black ">
            <p>Company Name: {selectedOrder.companyname}</p>
            <p>Date: {new Date(selectedOrder.date).toLocaleDateString()}</p>
            <p className="text-black text-2xl">Order Details:</p>
            <ul>
              {selectedOrder.orderdetail.map((detail: any, index: number) => (
                <li key={index}>
                  Product Name: {detail.productname},<br /> Quantity:{" "}
                  {detail.quantity}
                </li>
              ))}
            </ul>
          </div>
        )}
      </Modal>
      <Modal
        title="Create Order"
        open={createOrderModalVisible}
        onCancel={handleCreateOrderCancel}
        onOk={handleCreateOrderlist}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            label="Company Name"
            name="companyname"
            rules={[
              { required: true, message: "Please input the company name!" },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.List name="orderdetail">
            {(fields, { add, remove }) => (
              <>
                {fields.map(({ key, name, ...restField }) => (
                  <Space key={key} align="baseline">
                    <Form.Item
                      {...restField}
                      name={[name, "productname"]}
                      rules={[{ required: true, message: "Select a product" }]}
                    >
                      <Select
                        placeholder="Select product"
                        loading={productLoading}
                        onChange={(value) => {
                          setMaxOrder((prev: any) => ({
                            ...prev,
                            [name]: products.find(
                              (product: any) => product.productsname === value
                            )["quantity"],
                          }));
                          setSelectedProducts((prev: any) => [...prev, value]);
                        }}
                      >
                        {products?.map(
                          (product: any) =>
                            !selectedProducts.includes(
                              product.productsname
                            ) && (
                              <Option
                                key={product.productsname}
                                value={product.productsname}
                              >
                                {product.productsname}
                              </Option>
                            )
                        )}
                      </Select>
                    </Form.Item>
                    <Form.Item
                      {...restField}
                      name={[name, "quantity"]}
                      rules={[{ required: true, message: "Enter quantity" }]}
                    >
                      <InputNumber
                        placeholder="Quantity"
                        min={1}
                        max={maxOrder[name] || undefined}
                      />
                    </Form.Item>
                    <Button type="link" onClick={() => remove(name)}>
                      Remove
                    </Button>
                  </Space>
                ))}
                <Form.Item>
                  <Button type="dashed" onClick={() => add()} block>
                    Add Product
                  </Button>
                </Form.Item>
              </>
            )}
          </Form.List>
        </Form>
      </Modal>
    </div>
  );
};

export default Orderlist;

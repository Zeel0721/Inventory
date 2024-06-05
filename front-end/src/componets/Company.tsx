import { useState } from "react";
import {
  Table,
  Space,
  Button,
  message,
  Modal,
  Form,
  Input,
  Select,
  InputNumber,
  Card,
  Grid,
  Tag,
  Spin,
} from "antd";
import type { TableColumnsType } from "antd";
import {
  DeleteOutlined,
  PlusOutlined,
  LoadingOutlined,
} from "@ant-design/icons";
import { useGetAllProductsQuery } from "../services/Productlist";
import {
  useCreateCompanyMutation,
  useDeleteCompanyMutation,
  useGetAllCompanyQuery,
  useUpdateCompanyMutation,
} from "../services/Company";
import {
  useCreateOrderlistMutation,
  useGetAllOrderlistQuery,
} from "../services/Orderlist";

const { Option } = Select;
const { useBreakpoint } = Grid;

const Company = () => {
  const { data, isLoading, error, refetch } = useGetAllCompanyQuery({});
  const [createCompany] = useCreateCompanyMutation();
  const [editCompany] = useUpdateCompanyMutation();
  const [deleteCompany] = useDeleteCompanyMutation();
  const {
    data: products,
    isLoading: productLoading,
    refetch: productRefetch,
  } = useGetAllProductsQuery({});
  const [createOrderlist] = useCreateOrderlistMutation();
  const { refetch: orderRefetch } = useGetAllOrderlistQuery({});
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [selected, setSelected] = useState<string>();
  const [selectedCompany, setSelectedCompany] = useState<any>();
  const [maxOrder, setMaxOrder] = useState<any>({});
  const [createCompanyModalVisible, setCreateCompanyModalVisible] =
    useState<boolean>(false);
  const [createOrderModalVisible, setCreateOrderModalVisible] =
    useState<boolean>(false);
  const screens = useBreakpoint();
  const [form] = Form.useForm();

  const handleCreateOrderModal = (record: any) => {
    const orderdetail: any[] = [];
    record.products.forEach((productName: any, index: number) => {
      setMaxOrder((prev: any) => ({
        ...prev,
        [index]: products.find(
          (product: any) => product.productsname === productName
        )["quantity"],
      }));
      orderdetail.push({ productname: productName });
    });
    const newOrder = { companyname: record.company, orderdetail };
    setSelectedCompany(record);
    form.setFieldsValue(newOrder);
    setCreateOrderModalVisible(true);
  };

  const handleCreateOrderCancel = () => {
    setCreateOrderModalVisible(false);
    form.resetFields();
  };

  const handleCreateCompanyModal = () => {
    setCreateCompanyModalVisible(true);
  };

  const handleCreateCompanyCancel = () => {
    form.resetFields();
    setCreateCompanyModalVisible(false);
  };

  const handleEditModal = (record: any) => {
    setSelected(record._id);
    form.setFieldsValue(record);
    setIsEdit(true);
    setCreateCompanyModalVisible(true);
  };

  const handleDelete = async (id: string) => {
    await deleteCompany(id);
    await refetch();
  };

  const handleCreateCompany = async () => {
    try {
      const values = await form.validateFields();
      await createCompany(values).unwrap();
      message.success("Company details added");
      setCreateCompanyModalVisible(false);
      form.resetFields();
      await refetch();
    } catch (error: any) {
      message.error(
        `Failed to add company: ${error.data?.message || error.message}`
      );
    }
  };

  const handleEdit = async () => {
    try {
      const values = await form.validateFields();
      await editCompany({ id: selected, updatedCompany: values });
      setCreateCompanyModalVisible(false);
      form.resetFields();
      setIsEdit(false);
      await refetch();
    } catch (error: any) {
      message.error(
        `Failed to add company: ${error.data?.message || error.message}`
      );
    }
  };

  const handleCreateOrder = async () => {
    try {
      const values = await form.validateFields();
      const currentDate = new Date();
      const newOrderlistData = {
        companyname: values.companyname,
        orderdetail: values.orderdetail,
        date: `${currentDate.getFullYear()}-${String(
          currentDate.getMonth() + 1
        ).padStart(2, "0")}-${String(currentDate.getDate()).padStart(2, "0")}`,
      };
      await createOrderlist(newOrderlistData).unwrap();
      message.success("Order list created successfully.");
      setCreateOrderModalVisible(false);
      setMaxOrder({});
      form.resetFields();
      orderRefetch();
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
      render: (_: any, __: any, index: number) => index + 1,
      width: 310,
    },
    {
      title: "Company Name",
      dataIndex: "company",
      key: "company",
    },
    {
      title: "Products",
      dataIndex: "products",
      key: "products",
      render: (_, { products }) =>
        products.map((product: any) => <Tag key={product}>{product}</Tag>),
    },
    {
      title: "Action",
      key: "action",
      render: (_: any, record: any) => (
        <Space size="middle">
          <Button
            icon={<PlusOutlined />}
            onClick={() => handleEditModal(record)}
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
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => handleCreateOrderModal(record)}
          >
            Create Order
          </Button>
        </Space>
      ),
    },
  ];

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
      <h2 className=" dark:text-white">Company</h2>
      <Button
        type="primary"
        icon={<PlusOutlined />}
        onClick={handleCreateCompanyModal}
        className="mb-6"
      >
        Add company
      </Button>
      {screens.md ? (
        <Table columns={columns} dataSource={data} />
      ) : (
        data.map((item: any) => (
          <Card key={item._id}>
            <div>
              <b>Company Name:</b> {item.companyname}
            </div>
            <div>
              <b>Date:</b> {item.createdAt}
            </div>
            <div>
              <b>Action:</b>
              <Space size="middle">
                <Button
                  type="primary"
                  icon={<PlusOutlined />}
                  onClick={() => handleEditModal(item)}
                >
                  Edit
                </Button>
                <Button
                  type="primary"
                  danger
                  icon={<DeleteOutlined />}
                  onClick={() => handleDelete(item._id)}
                >
                  Delete
                </Button>
              </Space>
            </div>
          </Card>
        ))
      )}
      <Modal
        title="Create Company"
        open={createCompanyModalVisible}
        onCancel={handleCreateCompanyCancel}
        onOk={isEdit ? handleEdit : handleCreateCompany}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            label="Company Name"
            name="company"
            rules={[
              { required: true, message: "Please input the company name!" },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name={"products"}
            rules={[
              { required: true, message: "Select a product", type: "array" },
            ]}
          >
            <Select
              mode="multiple"
              placeholder="Select product"
              loading={productLoading}
            >
              {products?.map((product: any) => (
                <Option key={product.productsname} value={product.productsname}>
                  {product.productsname}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </Modal>
      {selectedCompany && (
        <Modal
          title="Create Order"
          open={createOrderModalVisible}
          onCancel={handleCreateOrderCancel}
          onOk={handleCreateOrder}
        >
          <Form form={form}>
            <Form.Item label="Company Name" name="companyname">
              <span className="font-semibold">
                {selectedCompany.company.toUpperCase()}
              </span>
            </Form.Item>
            <Form.List name="orderdetail">
              {(fields) => (
                <>
                  {fields.map(({ key, name, ...restField }) => (
                    <Space className="flex" key={key} align="baseline">
                      <Form.Item
                        className="flex justify-end w-24"
                        {...restField}
                        name={[name, "productname"]}
                      >
                        <span>{selectedCompany.products[name]}</span>
                      </Form.Item>
                      <span>:</span>
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
                    </Space>
                  ))}
                </>
              )}
            </Form.List>
          </Form>
        </Modal>
      )}
    </div>
  );
};

export default Company;

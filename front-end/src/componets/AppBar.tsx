import { useState } from "react";
import {
  Layout,
  Menu,
  Button,
  Typography,
  Avatar,
  Dropdown,
  Modal,
  MenuProps,
} from "antd";
import {
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  AppstoreOutlined,
  ShoppingCartOutlined,
  DownOutlined,
  UnorderedListOutlined,
  BankOutlined,
} from "@ant-design/icons";
import Dashboard from "./Dashboard";
import Product from "./Product";
import OrderList from "./Orderlist";
import "tailwindcss/tailwind.css";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import logo from "./Logo/logo2.png";
import axios from "axios";
import Company from "./Company";
import Token from "./Token";

const { Header, Sider, Content } = Layout;
const { Text, Paragraph } = Typography;
const { confirm } = Modal;

const AppBar = () => {
  const [collapsed, setCollapsed] = useState(true);
  const [selectedMenu, setSelectedMenu] = useState("dashboard");
  const accessToken = sessionStorage.getItem("accessToken");
  const { username }: any = accessToken ? jwtDecode(accessToken) : "";
  const navigate = useNavigate();

  const logout = () => {
    confirm({
      title: "Do you want to log out?",
      onOk() {
        axios
          .get("http://localhost:3000/auth/logout", {
            headers: {
              Authorization: `Bearer ${sessionStorage.getItem("accessToken")}`,
            },
          })
          .then(() => {
            sessionStorage.clear();
            localStorage.clear();
            navigate("/");
          })
          .catch(() => {
            console.log("Logout failed");
          });
      },
      onCancel() {
        console.log("Logout cancelled");
      },
    });
  };

  const items: MenuProps["items"] = [
    {
      key: "1",
      label: <a onClick={logout}>Logout</a>,
    },
  ];

  const toggle = () => {
    setCollapsed(!collapsed);
  };

  const handleMenuClick = (e: any) => {
    setSelectedMenu(e.key);
  };

  const renderContent = () => {
    switch (selectedMenu) {
      case "dashboard":
        return <DashboardContent />;
      case "product":
        return <ProductContent />;
      case "orderlist":
        return <OrderListContent />;
      case "company":
        return <CompanyContent />;
      default:
        return null;
    }
  };

  const DashboardContent = () => (
    <Paragraph className="h-full">
      <Dashboard />
    </Paragraph>
  );

  const ProductContent = () => (
    <Paragraph className="h-full">
      <Product />
    </Paragraph>
  );

  const OrderListContent = () => (
    <Paragraph className="h-full">
      <OrderList />
    </Paragraph>
  );

  const CompanyContent = () => (
    <Paragraph className="h-full">
      <Company />
    </Paragraph>
  );

  return (
    <>
      <Token />
      <Layout className="h-screen flex flex-col md:flex-row">
        <Sider
          trigger={null}
          collapsible
          collapsed={collapsed}
          width={collapsed ? 100 : 140}
          className={`bg-gray-800 ${collapsed ? "w-24 md:w-60" : "w-60"}`}
        >
          <div className="p-4 text-center">
            <img
              src={logo}
              alt="Logo"
              className="max-w-full h-auto rounded-lg"
            />
          </div>
          <Menu
            theme="dark"
            mode="inline"
            defaultSelectedKeys={["dashboard"]}
            selectedKeys={[selectedMenu]}
            onClick={handleMenuClick}
          >
            <Menu.Item key="dashboard" icon={<AppstoreOutlined />}>
              Dashboard
            </Menu.Item>
            <Menu.Item key="product" icon={<ShoppingCartOutlined />}>
              Product
            </Menu.Item>
            <Menu.Item key="orderlist" icon={<UnorderedListOutlined />}>
              Orderlist
            </Menu.Item>
            <Menu.Item key="company" icon={<BankOutlined />}>
              Company
            </Menu.Item>
          </Menu>
        </Sider>
        <Layout className="site-layout">
          <Header className="flex justify-between items-center bg-white shadow px-4">
            <Button type="primary" onClick={toggle}>
              {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            </Button>
            <div className="flex items-center space-x-4">
              <Text className="text-lg font-semibold">{username}</Text>
              <Dropdown menu={{ items }} trigger={["click"]}>
                <div className="flex items-center cursor-pointer">
                  <Avatar className="bg-lime-600">{username[0]}</Avatar>
                  <DownOutlined className="ml-2" />
                </div>
              </Dropdown>
            </div>
          </Header>
          <Content className="m-4 p-4 bg-white shadow rounded">
            {renderContent()}
          </Content>
        </Layout>
      </Layout>
    </>
  );
};

export default AppBar;

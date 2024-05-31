import { useState } from "react";
import {
  Typography,
  Button,
  Input,
  Form,
  Row,
  Col,
  ConfigProvider,
  Switch,
  message,
} from "antd";
import { UserOutlined, LockOutlined, MailOutlined } from "@ant-design/icons";
import { Link as RouterLink } from "react-router-dom";
import { useSignupMutation } from "../services/Singup";

const { Title } = Typography;

const SignUp = () => {
  const [theme, setTheme] = useState("light");
  const [signup, { isLoading }] = useSignupMutation();
  const [form] = Form.useForm(); // Create a form instance

  const onFinish = async (values: any) => {
    try {
      const result = await signup(values).unwrap();

      console.log("User signed up successfully:", result);
      message.success("Signup successful!");
      form.resetFields(); 
    } catch (err: any) {
      console.error("Failed to sign up:", err);
      message.error("Signup failed: " + err.data.message);
    }
  };

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  return (
    <ConfigProvider prefixCls={theme}>
      <Row
        justify="center"
        align="middle"
        style={{
          minHeight: "100vh",
          background: theme === "light" ? "#f0f2f5" : "#001529",
        }}
      >
        <Col xs={24} sm={16} md={12} lg={8} xl={6}>
          <div
            style={{
              padding: "2rem",
              background: "#fff",
              borderRadius: "8px",
              boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.1)",
            }}
          >
            <Row justify="end" style={{ marginBottom: "1rem" }}>
              <Col>
                <Switch checked={theme === "dark"} onChange={toggleTheme} />
              </Col>
            </Row>
            <Title level={2} style={{ textAlign: "center" }}>
              Sign up
            </Title>
            <Form
              form={form} 
              name="normal_signup"
              initialValues={{ remember: true }}
              onFinish={onFinish}
            >
              <Form.Item
                name="username"
                rules={[
                  { required: true, message: "Please input your username!" },
                  { type: "string", message: "Username must be a string!" },
                ]}
              >
                <Input
                  prefix={<UserOutlined className="site-form-item-icon" />}
                  placeholder="Username"
                />
              </Form.Item>
              <Form.Item
                name="email"
                rules={[
                  { required: true, message: "Please input your email!" },
                  { type: "email", message: "Please enter a valid email!" },
                ]}
              >
                <Input
                  prefix={<MailOutlined className="site-form-item-icon" />}
                  placeholder="Email"
                />
              </Form.Item>
              <Form.Item
                name="password"
                rules={[
                  { required: true, message: "Please input your Password!" },
                  {
                    min: 6,
                    message: "Password must be at least 6 characters!",
                  },
                ]}
              >
                <Input
                  prefix={<LockOutlined className="site-form-item-icon" />}
                  type="password"
                  placeholder="Password"
                />
              </Form.Item>

              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  style={{ width: "100%" }}
                  loading={isLoading}
                >
                  Sign up
                </Button>

                <RouterLink to="/">Login</RouterLink>
              </Form.Item>
            </Form>
          </div>
        </Col>
      </Row>
    </ConfigProvider>
  );
};

export default SignUp;

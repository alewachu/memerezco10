import React, { useEffect } from "react";
import { Form, Input, Button, Checkbox, Row, Col, Layout } from "antd";
import { Link } from "react-router-dom";
import { getToken, deleteToken } from "../helpers/authentication";

export default function Login({ login, history }) {
  const { Content, Footer } = Layout;

  useEffect(() => {
    if (getToken()) {
      deleteToken();
    }
  }, []);

  const onFinish = async (values) => {
    const { email, password } = values;
    try {
      const response = await login(email, password);
      if (response) {
        history.push("/");
      }
    } catch (e) {}
  };

  return (
    <>
      <Layout>
        <Layout>
          <Content style={{ margin: "24px 16px 0" }}>
            <div
              className="site-layout-background"
              style={{ padding: 24, minHeight: 360 }}
            >
              <Row>
                <Col span={12} offset={6}>
                  <Form
                    name="basic"
                    initialValues={{ remember: true }}
                    onFinish={onFinish}
                  >
                    <Form.Item
                      label="Email"
                      name="email"
                      rules={[
                        {
                          required: true,
                          message: "Please input your email!",
                        },
                      ]}
                    >
                      <Input className="input-login" />
                    </Form.Item>

                    <Form.Item
                      label="Password"
                      name="password"
                      rules={[
                        {
                          required: true,
                          message: "Please input your password!",
                        },
                      ]}
                    >
                      <Input.Password />
                    </Form.Item>

                    <Form.Item name="remember" valuePropName="checked">
                      <Checkbox>Remember me</Checkbox>
                    </Form.Item>

                    <Row>
                      <Col span={12}>
                        <Form.Item>
                          <Button type="primary" htmlType="submit">
                            Login
                          </Button>
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item>
                          <Button type="ghost">
                            <Link to="/register">Sign Up</Link>
                          </Button>
                        </Form.Item>
                      </Col>
                    </Row>
                  </Form>
                </Col>
              </Row>
            </div>
          </Content>
          <Footer style={{ textAlign: "center" }}>MEMEREZCO</Footer>
        </Layout>
      </Layout>
    </>
  );
}

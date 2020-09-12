import React, { useState } from "react";
import {
  Form,
  Input,
  Button,
  DatePicker,
  Avatar,
  Row,
  Col,
  Layout,
  Modal,
} from "antd";
import { useHistory } from "react-router-dom";
import { ExclamationCircleOutlined } from "@ant-design/icons";

export default function Register(props) {
  const { Content, Footer } = Layout;
  let history = useHistory();

  const destination = props.envs["REACT_APP_CLOUDINARY_DESTINATION"];
  const cloudN = props.envs["REACT_APP_CLOUDINARY_KEY"];
  const [image, setImage] = useState("");
  const [complete, setComplete] = useState(false);

  const [dob, setDob] = useState("");
  const onFinish = async ({ mail, name, password }) => {
    const user = {
      mail,
      name,
      password,
      image,
      dob,
    };
    if (complete) {
      const responseRegister = await props.register(user);
      if (responseRegister) {
        confirm(1);
      } else {
        confirm(2);
      }
    }
  };

  const confirm = (type) => {
    switch (type) {
      case 1: // Confirm register
        Modal.info({
          title: "Congrulations!",
          content: (
            <div>
              <p>You have been successfully registered. Please login.</p>
            </div>
          ),
          onOk: login,
        });
        break;
      case 2: // Error sv
        Modal.confirm({
          title: "Alert",
          icon: <ExclamationCircleOutlined />,
          content: "Error in register ",
          okText: "Retry",
          onCancel: home,
          cancelText: "Cancel",
        });
        break;
      default:
        break;
    }
  };
  const home = () => {
    history.push("/");
  };
  const login = () => {
    history.push("/login");
  };
  const onChange = (date, dateString) => {
    setDob(dateString);
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  const showWidget = async () => {
    let widget = window.cloudinary.openUploadWidget(
      {
        cloudName: cloudN,
        uploadPreset: destination,
        sources: ["local"],
        showUploadMoreButton: false,
      },
      (error, result) => {
        if (result.event === "success") {
          setImage(result.info.secure_url);
          setComplete(true);
        }
      }
    );
    widget.open();
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
                      label="Mail"
                      name="mail"
                      rules={[
                        {
                          required: true,
                          message: "Please input your mail!",
                        },
                      ]}
                    >
                      <Input className="input-login" />
                    </Form.Item>
                    <Form.Item
                      label="Name"
                      name="name"
                      rules={[
                        {
                          required: true,
                          message: "Please input your name!",
                        },
                      ]}
                    >
                      <Input className="input-login" />
                    </Form.Item>
                    <Form.Item
                      className="input-login"
                      label="Date of birth"
                      name="dob"
                      rules={[
                        {
                          required: false,
                          message: "Please input your dob!",
                        },
                      ]}
                    >
                      <DatePicker onChange={onChange} />
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
                    <Form.Item
                      label="Repeat password"
                      name="repeat-password"
                      hasFeedback
                      rules={[
                        {
                          required: true,
                          message: "Please confirm your password!",
                        },
                        ({ getFieldValue }) => ({
                          validator(rule, value) {
                            if (!value || getFieldValue("password") === value) {
                              return Promise.resolve();
                            }

                            return Promise.reject(
                              "passwords must be the same!"
                            );
                          },
                        }),
                      ]}
                    >
                      <Input.Password />
                    </Form.Item>
                    <Form.Item
                      label="Image"
                      name="image"
                      hasFeedback
                      style={{ textAlign: "center" }}
                      rules={[
                        {
                          required: false,
                          message: "Please input your image!",
                        },
                      ]}
                    >
                      <Button onClick={showWidget}> Upload image</Button>
                    </Form.Item>
                    <Form.Item style={{ textAlign: "center" }}>
                      <Avatar shape="square" size={250} src={image} />
                    </Form.Item>
                    <Form.Item>
                      <Button type="primary" htmlType="submit">
                        Sign up
                      </Button>
                    </Form.Item>
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

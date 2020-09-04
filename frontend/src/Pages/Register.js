import React, { useState } from "react";
import { Form, Input, Button } from "antd";

export default function Register({ register }) {
  const [user, setUser] = useState({
    email: "",
    username: "",
    password: "",
  });
  const onFinish = ({ email, username, password }) => {
    setUser({
      email: email,
      username: username,
      password: password,
    });

    register(email, username, password);
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <Form
      name="basic"
      initialValues={{ remember: true }}
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
    >
      <Form.Item
        label="Nombre"
        name="username"
        rules={[{ required: true, message: "Ingresa el nombre!" }]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        name="email"
        label="Email"
        rules={[{ required: true, message: "Ingresa tu email de nacimiento!" }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="password"
        label="Password"
        rules={[
          {
            required: true,
            message: "Ingresa tu contraseña",
          },
        ]}
        hasFeedback
      >
        <Input.Password />
      </Form.Item>

      <Form.Item
        name="confirm"
        label="Confirm Password"
        dependencies={["password"]}
        hasFeedback
        rules={[
          {
            required: true,
            message: "Confirma tu contraseña",
          },
          ({ getFieldValue }) => ({
            validator(rule, value) {
              if (!value || getFieldValue("password") === value) {
                return Promise.resolve();
              }

              return Promise.reject("Las contraseñas deben ser iguales!");
            },
          }),
        ]}
      >
        <Input.Password />
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit">
          Registrarme
        </Button>
      </Form.Item>
    </Form>
  );
}

import React, { useState } from "react";
import { post, get } from "../helpers/service";
import { Form, Select, Input, Button, Layout, Row, Col, Avatar } from "antd";

export default function UploadMeme() {
  const destination = "";
  const cloudN = "";

  const { Content, Footer } = Layout;
  const { Option } = Select;

  const [urlimage, setUrl] = useState("");
  const [complete, setComplete] = useState(false);
  const [cat, setCat] = useState([]);

  const getCategory = async () => {
    const response = await get(`/api/v1/categories`);
    setCat(response.data);
    return response.data
  };
 const categories = Array.from(cat);

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
          setUrl(result.info.secure_url);
          setComplete(true);
        }
      }
    );
    widget.open();
  };

  const onFinish = async (values) => {
    const { title, select } = values; 
    const catSelected = categories.find((category) => category.id === select);
    const category = {
      _id: catSelected.id,
      name: catSelected.name,
      slug: catSelected.Slug,
    };
    const url = urlimage;
    if (complete) {
      try {
        post("/api/v1/memes", {
          category: category,
          title: title,
          image: url,
        });
      } catch (err) {
        console.error(err);
      }
    }
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
                  <Form name="validate_other" onFinish={onFinish}>
                    <Form.Item>
                      <span className="ant-form-text ">Upload Meme</span>
                    </Form.Item>
                    <Form.Item
                      label="Title"
                      name="title"
                      rules={[
                        { required: true, message: "Please input title!" },
                      ]}
                    >
                      <Input />
                    </Form.Item>
                    <Form.Item
                      onClick={getCategory}
                      name="select"
                      label="Select Category"
                      hasFeedback
                      rules={[
                        {
                          required: true,
                          message: "Please select category!",
                        },
                      ]}
                    >
                      <Select placeholder="Please select a category">
                        {categories.map((item, i) => (
                          <Option key={"categories" + i} value={item.id}>
                            {item.name}
                          </Option>
                        ))}
                      </Select>
                    </Form.Item>

                    <Form.Item
                    style={{ textAlign: "center" }}
                      rules={[
                        {
                          required: true,
                          message: "Please select image!",
                        },
                      ]}
                    >
                      <Button onClick={showWidget}> Upload image</Button>
                    </Form.Item>
                    <Form.Item style={{ textAlign: "center" }}>
                      <Avatar shape="square" size={250} src={urlimage} />
                    </Form.Item>
                    <Form.Item
                      wrapperCol={{
                        span: 12,
                        offset: 6,
                      }}
                    >
                      <Button type="primary" htmlType="submit">
                        Upload Meme
                      </Button>
                    </Form.Item>
                  </Form>
                </Col>
              </Row>
            </div>
          </Content>
          <Footer style={{ textAlign: "center" }}>MEMEREZCO10</Footer>
        </Layout>
      </Layout>
    </>
  );
}

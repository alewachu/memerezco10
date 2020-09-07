import React, { useState } from "react";
import Axios from "axios";
import { getToken } from "../helpers/authentication";
import { Form, Select, Input, Button ,Layout,Row,Col, Avatar} from "antd";

export default function UploadMeme() {
  const destination = "memestest"; 
  const cloudN = 'grupo10';

  const { Content, Footer } = Layout;
  const [urlimage ,setUrl] = useState('');
  const [complete, setComplete] = useState(false);
  
const { Option } = Select;
const formItemLayout = {
  labelCol: {
    span: 6,
  },
  wrapperCol: {
    span: 14,
  },
};

const showWidget = async() => {
  let widget = window.cloudinary.openUploadWidget({
    cloudName: cloudN,
    uploadPreset: destination,
    sources: ['local']
  },
    (error, result) => {
      if(result.event === 'success'){
      setUrl (result.info.secure_url);
      setComplete(true);
      }
    });
  widget.open();
}


const onFinish =  async(values) => {
  const {title,select} = values;
  const category = select;
  const url = urlimage;
  if(complete){
  try {
    //para subir local
    Axios({
      method: "POST",
      url: `http://localhost:3001/api/v1/memes`,
      data: {
        category: {
          id: "5f4aafc7b168d861769a24bb",
          name: category,
          slug: `/${category}`,
        },
        title: title,
        image: url,
      },
      headers: {
        "Content-Type": "application/json",
        authorization:
          `Bearer ${getToken()}`
      },
    });

  } catch (err) {
    console.error(err);
  }
}
}


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
                        <Option value="Soccer">Soccer</Option>
                        <Option value="Random">Random</Option>
                        <Option value="Programation">Programation</Option>
                      </Select>
                    </Form.Item>
                    <Form.Item
                      rules={[
                        {
                          required: true,
                          message: "Please select image!",
                        },
                      ]}
                    >
                      <Button onClick={showWidget}> Upload file</Button>
                    </Form.Item>
                    <Form.Item>
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
          <Footer style={{ textAlign: "center" }}>MEMEREZCO</Footer>
        </Layout>
      </Layout>
    </>
  );
}

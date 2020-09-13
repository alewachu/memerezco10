import React, { useState } from "react";
import {
  Form,
  Select,
  Input,
  Button,
  Layout,
  Row,
  Col,
  Image,
  Modal,
} from "antd";
import { ExclamationCircleOutlined } from "@ant-design/icons";

import { post, get } from "../helpers/service";
import { useHistory } from "react-router-dom";

export default function UploadMeme(props) {
  const destination = props.envs["REACT_APP_CLOUDINARY_DESTINATION"];
  const cloudN = props.envs["REACT_APP_CLOUDINARY_KEY"];

  const { Content, Footer } = Layout;
  const { Option } = Select;
  let history = useHistory();

  const [urlimage, setUrl] = useState("");
  const [complete, setComplete] = useState(false);
  const [cat, setCat] = useState([]);

  /**
   * Obtenemos el listado de las categorias
   */
  const getCategory = async () => {
    const response = await get(`/api/v1/categories`);
    setCat(response.data);
    return response.data;
  };
  const categories = Array.from(cat);


  /**
   * creamos y abrimos el widget de cloudinary
   */
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

  /**
   * se confirma si los datos se subieron correctamente
   * o informa un error
   */
  const confirm = (type) => {
    switch (type) {
      case 1: // Confirm upload
        Modal.info({
          title: "Congrulations meme upload!",
          content: <div></div>,
          onOk: home,
        });
        break;
      case 2: // Error
        Modal.confirm({
          title: "Alert",
          icon: <ExclamationCircleOutlined />,
          content: "Error in upload ",
          okText: "Retry",
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

/**
 * una vez cargados los datos
 * se envian al servidor
 */
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
        confirm(1);
      } catch (err) {
        confirm(2);
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
                       <Image  src={urlimage} />
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

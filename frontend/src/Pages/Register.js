import React,{useState} from "react";
import { Form, Input, Button, Checkbox,DatePicker, Space } from "antd";
import FormItem from "antd/lib/form/FormItem";

export default function Register({register}) {
  const [user, setUser] = useState({
    email: "",
    username: "",
    password: "",
  });
  const onFinish = ({email,username,password,dob}) => {
    /*setUser({
        email:"ss",
        username:"ss",
        password:"aa"
    });
    console.log(user);*/

    //console.log(values.dob.dateString);
    register();
    
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <h4>Registro</h4>
  );
}

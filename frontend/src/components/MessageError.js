import React from "react";
import { Alert } from 'antd';


export default function MessageError({message}){

    if(!message){
        return null;
    }
    return (
      <>
        <Alert message={message} type="error" />
      </>
    );

}
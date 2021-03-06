import Axios from "axios";
import { getToken } from "./authentication";
const API_ENDPOINT = process.env["REACT_APP_API_ENDPOINT"];
const token = getToken();

const config = token
  ? {
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${token}`,
      },
    }
  : null;
export const get = async (url) => {
  const response = await Axios.get(API_ENDPOINT + url, config);
  return response.data;
};

export const post = async (url, data) => {
  const response = await Axios.post(API_ENDPOINT + url, data, config);
  return response.data;
};

export const put = async (url, id, data) => {
  const response = await Axios.put(`${API_ENDPOINT}${url}/${id}`, data, config);
  return response.data;
};

export const eliminate = async (url, id) => {
  const response = await Axios.delete(`${API_ENDPOINT}${url}/${id}`, config);
  return response.data;
};

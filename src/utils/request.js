import axios from "axios";
import { Message } from "element-ui";

const BASEURL = process.env.NODE_ENV === "production" ? "" : "/devApi";
const service = axios.create({
  baseURL: BASEURL,
  timeout: 15000 //网络超时
});

//请求拦截器
service.interceptors.request.use(
  function(config) {
    console.log(config);
    return config;
  },
  function(error) {
    return Promise.reject(error);
  }
);

service.interceptors.response.use(
  function(response) {
    console.log(response);
    console.log("response");

    return response;
  },
  function(error) {
    return Promise.reject(error);
  }
);

//响应拦截器
service.interceptors.response.use(
  function(response) {
    //响应数据
    let data = response.data;

    if (data.resCode !== 0) {
      Message.error(data.message);
      return Promise.reject(data);
    } else {
      return response;
    }
  },
  function(error) {
    //响应错误
    return Promise.reject(error);
  }
);

export default service;

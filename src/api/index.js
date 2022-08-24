import axios from 'axios';
import qs from 'qs';

// import router from '../router';

/**
 * 处理异常
 * @param {*} error
 */
function httpErrorStatusHandler(error) {
  let message = '';
  if (error && error.response) {
    switch (error.response.status) {
      case 302:
        message = '接口重定向了！';
        break;
      case 400:
        message = '参数不正确！';
        break;
      case 401: {
        const { data } = error.response;
        if (data?.message) {
          message = data?.message;
        } else {
          message = '您未登录，或者登录已经超时！';
        }
        // 登录过期（跳转至登录页）
        // router.push('/login');
        console.log(message);
        return;
      }
      case 403:
        message = '您没有权限操作！';
        break;
      case 404:
        message = `请求地址出错: ${error.response.config.url}`;
        break;
      case 408:
        message = '请求超时！';
        break;
      case 409:
        message = '系统已存在相同数据！';
        break;
      case 500:
        message = '服务器内部错误！';
        break;
      case 501:
        message = '服务未实现！';
        break;
      case 502:
        message = '网关错误！';
        break;
      case 503:
        message = '服务不可用！';
        break;
      case 504:
        message = '服务暂时无法访问，请稍后再试！';
        break;
      case 505:
        message = 'HTTP版本不受支持！';
        break;
      default:
        message = '异常问题，请联系管理员！';
        break;
    }
  }
  if (error.message.includes('timeout')) {
    message = '网络请求超时！';
    console.log(message);
  }
  if (error.message.includes('Network')) {
    message = window.navigator.onLine ? '服务端异常！' : '您断网了！';
    console.log(message);
  }
}

// 创建 axios 实例
const server = axios.create({
  baseURL: process.env.BASE_URL,
  timeout: 120000,
});

/** 请求拦截 */
server.interceptors.request.use(
  (request) => {
    // 在发送请求前做些处理
    // 加入授权token
    const token = localStorage.getItem('Authorization');
    request.headers.Authorization = token || '';
    return request;
  },
  (error) => {
    // 对请求错误做些什么
    return Promise.reject(error);
  },
);

/** 响应拦截 */
server.interceptors.response.use(
  (response) => {
    // 2xx 范围内的状态码都会触发该函数。
    // 对响应数据做点什么
    const res = response.data;
    if (res?.code === 200) {
      return res;
    }
    if (res?.code === 401) {
      localStorage.removeItem('Authorization');
      console.log('登录已失效，请重新登录');
      // 登录过期（跳转至登录页）
      // router.push('/login');
    }
    if ([-1, -2, -3, -10, 400, 403, 500, 501].includes(res?.code)) {
      console.log(res?.message || '系统异常');
    }
    return Promise.reject(res);
  },
  (error) => {
    // 超出 2xx 范围的状态码都会触发该函数。
    // 对响应错误做点什么
    httpErrorStatusHandler(error);
    return Promise.reject(error);
  },
);

// 封装请求调用方法
function doRequest(config) {
  const reqConfig = Object.assign(config);
  reqConfig.method = reqConfig.method || 'get';
  if (reqConfig.method.toLowerCase() === 'get') {
    reqConfig.params = reqConfig.data;
  }
  reqConfig.headers = reqConfig.headers || {};
  // 封装表单请求的处理
  if (!reqConfig.headers['Content-Type']) {
    reqConfig.headers['Content-Type'] =
      'application/x-www-form-urlencoded;charset=utf-8';
    reqConfig.data = qs.stringify(reqConfig.data);
  }
  // 封装表单上传文件请求的处理
  if (reqConfig.headers['Content-Type'].indexOf('multipart/form-data') !== -1) {
    const formData = new FormData();
    if (reqConfig.data) {
      Object.keys(reqConfig.data).forEach((item) => {
        formData.append(item, reqConfig.data[item]);
      });
      reqConfig.data = formData;
    }
  }
  return server(reqConfig);
}

// 封装不同类型的请求方法
['get', 'delete', 'head', 'options', 'post', 'put', 'patch'].forEach((type) => {
  doRequest[type] = (url, options) => {
    return doRequest({ url, method: type, ...options });
  };
});

export default doRequest;

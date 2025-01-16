import axiosInstance from "axios";
import axiosIntercepter from "./axiosIntercepter";
const language = "ko";
const env = process.env.NODE_ENV;
const useToken = true;
const get = async (
  authorization: any,
  url: any,
  params = {},
  config: { headers: object } = { headers: { "Accept-Language": language } }
) => {
  // 쿼리 파라미터 처리
  const queryString = Object.entries(params)
    .filter(([, value]) => value !== null && value !== undefined)
    .map(([key, value]) => `${key}=${value}`)
    .join("&");

  const newUrl = queryString ? `${url}?${queryString}` : url;

  // if (authorization && env === 'prod') {
  // 	const token = returnSsoToken();
  // 	config.headers = {
  // 		Authorization: `${token}`,
  // 	};
  // }
  try {
    const response = await axiosIntercepter.get(newUrl, config);
    return await errorCheck(response);
  } catch (error) {
    return errorHandler(error);
  }
};

const post = async (
  authorization: any,
  url: any,
  data = {},
  config: { headers: object; params: object } = {
    headers: { "Accept-Language": language },
    params: {},
  }
) => {
  // if (authorization && env === 'prod') {
  // 	const token = returnSsoToken();
  // 	config.headers = {
  // 		Authorization: `${token}`,
  // 	};
  // }

  try {
    const response = await axiosIntercepter.post(url, data, config);
    return await errorCheck(response);
  } catch (error) {
    return errorHandler(error);
  }
};

const postNoProgress = async (
  authorization: any,
  url: any,
  data = {},
  config: { headers: object; params: object } = {
    headers: { "Accept-Language": language },
    params: {},
  }
) => {
  // if (authorization && env === 'prod') {
  // 	const token = returnSsoToken();
  // 	config.headers = {
  // 		Authorization: `${token}`,
  // 	};
  // }

  try {
    const response = await axiosInstance.post(url, data, config);
    return await errorCheck(response);
  } catch (error) {
    return errorHandler(error);
  }
};

const put = async (
  authorization: any,
  url: any,
  data = {},
  config: { headers: object } = { headers: { "Accept-Language": language } }
) => {
  // if (authorization && env === 'prod') {
  // 	const token = returnSsoToken();
  // 	config.headers = {
  // 		Authorization: `${token}`,
  // 	};
  // }
  try {
    const response = await axiosIntercepter.put(url, data, config);
    return response.data;
  } catch (error) {
    errorHandler(error);
    throw error;
  }
};

const patch = async (
  authorization: any,
  url: any,
  data = {},
  config: { headers: object } = { headers: { "Accept-Language": language } }
) => {
  // if (authorization && env === 'prod') {
  // 	const token = returnSsoToken();
  // 	config.headers = {
  // 		Authorization: `${token}`,
  // 	};
  // }
  try {
    const response = await axiosIntercepter.patch(url, data, config);
    return response.data;
  } catch (error) {
    errorHandler(error);
    throw error;
  }
};

const deleteAxios = async (
  authorization: any,
  url: any,
  config: { headers: object } = { headers: { "Accept-Language": language } }
) => {
  // if (authorization && env === 'prod') {
  // 	const token = returnSsoToken();
  // 	config.headers = {
  // 		Authorization: `${token}`,
  // 	};
  // }
  try {
    const response = await axiosIntercepter.delete(url, config);
    return response.data;
  } catch (error) {
    errorHandler(error);
    throw error;
  }
};

const errorHandler = (error: any) => {
  let errorcode = null;
  let errormessage = "";
  if (error.error_code) {
    errorcode = error.error_code;
    errormessage = error.error_message;
  } else {
    errorcode = error.response.data.error_code;
    errormessage = error.response.data.error_message;
  }
  if (error.response) {
    const { data } = error.response;
    errormessage = `${data.error_message}\n${data.message}`;
  }
  console.debug("errorcode : ", errorcode);
  console.debug("errormessage : ", errormessage);
  switch (errorcode) {
    case 2001:
      console.debug("토큰 없음", errormessage);
      localStorage.removeItem("SSO_TOKEN");
      window.location.href = `${window.location.origin}/login`;
      break;
    case 2003:
      console.debug("토큰 만료", errormessage);
      localStorage.removeItem("SSO_TOKEN");
      window.location.href = `${window.location.origin}/login`;
      break;
    case 1000:
      console.debug("INVALID PARAMETER :", errormessage);
      break;
    case 1001:
      console.debug("INVALID_LOGIN_TYPE :", errormessage);
      break;
    default:
      console.debug("UNKNOWN ERROR");
      break;
  }

  const result = errormessage ? errormessage : error;
  return Promise.reject(result);
};

const errorCheck = async (response: any) => {
  if (response.status >= 400 && response.status <= 500) {
    console.log("error status : ", response.status);
  } else if (response.data.error) {
    return errorHandler(response.data);
  } else {
    return response;
  }
};

// const expiredToken = () => {
//   console.log("expiredToken");
//   const refresh_token = localStorage.getItem("refreshToken");
//   // 토큰 재발급
//   refreshmentToken(refresh_token)
//     .then((response) => {
//       if (response.data.result.token !== null) {
//         setLocalItem("token", response.data.result.token);
//         setLocalItem("refreshToken", response.data.result.refreshToken);
//         navigate("/home");
//       } else {
//         navigate("/login/sns");
//       }
//     })
//     .catch((error) => {
//       console.log("@@@@ [refreshmentToken] error = ", error.error_message);
//     });
// };

// const navigate = (url: any) => {
// 	window.location.href = url;
// };

export { useToken, get, post, postNoProgress, put, patch, deleteAxios };

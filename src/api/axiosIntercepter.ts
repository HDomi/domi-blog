import axios, { AxiosError } from "axios";
import { v4 as uuidv4 } from "uuid";
const instance = axios.create({
  // baseURL: process.env.VUE_APP_API_URL!
});
// const store = loadingStore(piniaInstance);

// 요청 인터셉터 추가하기
instance.interceptors.request.use(
  (config) => {
    const uuid = uuidv4();
    (config.headers as any).Uuid = uuid;
    // store.startLoading(uuid);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 응답 인터셉터 추가하기
instance.interceptors.response.use(
  (response) => {
    const uuid = (response.config?.headers as any)?.Uuid ?? "";
    // store.finishLoading(uuid);
    return response;
  },
  (error: AxiosError) => {
    const uuid = (error.config?.headers as any)?.Uuid ?? "";
    // store.finishLoading(uuid);
    return Promise.reject(error);
  }
);
export default instance;

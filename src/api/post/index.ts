import { get } from "../abstractService";
import { API } from "../config";
export const getPostsApi = async (category?: string, searchText?: string) => {
  const params = {
    category: category === "All" ? null : category,
    searchText: searchText ? searchText : null,
  };
  return await get(false, `${API.MAIN_SERVER_URL}/posts`, params);
};

export const getPostCategoryWithCountApi = async () => {
  return await get(false, `${API.MAIN_SERVER_URL}/posts/count`);
};

export const getPostDetailApi = async (id: string) => {
  return await get(false, `${API.MAIN_SERVER_URL}/posts/detail/${id}`);
};

import axios, { AxiosError } from "axios";
import isValid from "./isValid";
import Cookie from "js-cookie";

const fetcher = () => {
  let token = "";
  let unParsedToken: string | undefined | null;
  if (typeof window !== "undefined") {
    // Perform localStorage action
    unParsedToken = localStorage.getItem(
      `${process.env.NEXT_PUBLIC_TOKEN_PREFIX}_token`
    );
  }

  if (isValid(unParsedToken)) token = unParsedToken || "";

  const axiosClient = axios.create({
    baseURL: process.env.NEXT_PUBLIC_BASE_URL,
    timeout: 10000 * 15,
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  axiosClient.interceptors.response.use(
    (response) => response,
    (error: AxiosError) => {
      if (error.response?.status === 401) {
        Cookie.remove("user");
        localStorage.removeItem(
          `${process.env.NEXT_PUBLIC_TOKEN_PREFIX}_token`
        );

        const path = window.location.pathname;
        const query = window.location.search;

        const fullPath = path + query;

        if (fullPath.length > 3) {
          window.location.href = `/login?redirect_to=${encodeURIComponent(
            fullPath
          )}`;
        } else {
          window.location.href = `/login`;
        }
      }
      return Promise.reject(error);
    }
  );

  return axiosClient;
};

export default fetcher;

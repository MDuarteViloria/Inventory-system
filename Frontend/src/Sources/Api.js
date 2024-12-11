import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000",
  withCredentials: true,
  headers: {
    "Content-type": "application/json",
  },
});

api.interceptors.request.use((config) => {

  let lang = document.querySelector("meta[itemprop='language']").content
  const newUrl = new URL(config.baseURL + config.url);

  newUrl.searchParams.set("lang", lang);

  const newConfig = config;

  newConfig.url = newUrl.pathname + newUrl.search;

  return newConfig;

});

api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    switch (error.response.status) {
      case 403:
        if (window.location.pathname !== "/login") {
          window.location.href = "/login";
        }
        break;
      case 401:
        if (
          window.location.pathname !== "/login" &&
          window.location.pathname !== "/"
        ) {
          window.location.href = "/";
        }
    }

    return Promise.reject(error);
  }
);

export default api;

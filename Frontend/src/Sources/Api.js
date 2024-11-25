import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000",
  withCredentials: true,
  headers: {
    "Content-type": "application/json",
  },
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

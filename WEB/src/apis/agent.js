import axios from "axios";
import { API_ROOT } from "~/utils/constants";

const instance = axios.create({
  baseURL: API_ROOT,
  timeout: 60000,
});

// INTERCEPTORS CONFIG START
instance.interceptors.response.use(
  responseOnSuccessMiddleware,
  responseOnErrorMiddleware
);

function responseOnSuccessMiddleware(res) {
  return res;
}

function responseOnErrorMiddleware(error) {
  const { status } = error.response;
  if (status === 401) {
    localStorage.clear();
  }
  return error;
}

// INTERCEPTORS CONFIG END

const setLocalStorage = (key, value) => {
  localStorage.setItem(key, value);
};
const getLocalStorage = (key) => localStorage.getItem(key);

const removeTokenFromLocalStorage = (key) => localStorage.removeItem(key);

const clearLocalStorage = () => {
  localStorage.clear();
};

async function getApi(url, searchModel) {
  const token = getLocalStorage("accessToken");

  try {
    let fullUrl = url;
    const queryParams = [];

    Object.keys(searchModel).forEach((key) => {
      const value = searchModel[key];
      if (value !== undefined && value !== null) {
        queryParams.push(`${key}=${encodeURIComponent(value)}`);
      }
    });

    if (queryParams.length > 0) {
      fullUrl += `?${queryParams.join("&")}`;
    }

    const res = await instance.get(fullUrl, {
      headers: {
        Authorization: token ? `Bearer ${token}` : "no auth",
      },
    });

    return res;
  } catch (err) {
    return err;
  }
}

async function getApiV2(url, searchModel, type) {
  const token = getLocalStorage("accessToken");

  try {
    let fullUrl = url;
    const queryParams = [];

    Object.keys(searchModel).forEach((key) => {
      const value = searchModel[key];
      if (value !== undefined && value !== null) {
        queryParams.push(`${key}=${encodeURIComponent(value)}`);
      }
    });

    if (queryParams.length > 0) {
      fullUrl += `?${queryParams.join("&")}`;
    }

    const res = await instance.get(fullUrl, {
      responseType: type,
      headers: {
        Authorization: token ? `Bearer ${token}` : "no auth",
      },
    });

    return res;
  } catch (err) {
    return err;
  }
}

// POST API AREA ============================>
async function postApi(url, payload, file) {
  try {
    const res = await instance.post(url, payload, {
      headers: {
        Authorization: getLocalStorage("accessToken")
          ? `Bearer ${getLocalStorage("accessToken")}`
          : "no-author",
        "Content-Type": file
          ? "multipart/form-data"
          : "application/json; charset=utf-8",
        "Access-Control-Allow-Headers":
          "Content-Type, X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Date, X-Api-Version, X-File-Name",
        "Access-Control-Allow-Methods": "POST",
        "Access-Control-Allow-Origin": "*",
      },
    });
    return res;
  } catch (err) {
    return err;
  }
}

async function postApi2(url, payload, file) {
  try {
    const res = await instance.post(url, payload, {
      headers: {
        Authorization: getLocalStorage("accessToken")
          ? `Bearer ${getLocalStorage("accessToken")}`
          : "no-author",
        "Access-Control-Allow-Headers":
          "Content-Type, X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Date, X-Api-Version, X-File-Name",
        "Access-Control-Allow-Methods": "POST",
        "Access-Control-Allow-Origin": "*",
      },
    });
    return res;
  } catch (err) {
    return err;
  }
}

// Delete
async function deleteApi(url) {
  try {
    const res = await instance.delete(`/${url}`, {
      headers: {
        Authorization: getLocalStorage("accessToken")
          ? `Bearer ${getLocalStorage("accessToken")}`
          : "no-author",
      },
    });
    return res;
  } catch (err) {
    return err;
  }
}

// PUT API AREA ============================>
async function putApi(url, payload) {
  try {
    const res = await instance.put(`/${url}`, payload, {
      headers: {
        Authorization: getLocalStorage("accessToken")
          ? `Bearer ${getLocalStorage("accessToken")}`
          : "no-author",
        "Content-Type": "multipart/form-data",
      },
    });
    return res;
  } catch (err) {
    return err;
  }
}

async function putApi2(url, payload) {
  try {
    const res = await instance.put(`/${url}`, payload, {
      headers: {
        Authorization: getLocalStorage("accessToken")
          ? `Bearer ${getLocalStorage("accessToken")}`
          : "no-author",
        "Content-Type": "application/json",
      },
    });
    return res;
  } catch (err) {
    return err;
  }
}

export {
  getApi,
  putApi,
  putApi2,
  postApi,
  getApiV2,
  postApi2,
  deleteApi,
  setLocalStorage,
  getLocalStorage,
  clearLocalStorage,
  removeTokenFromLocalStorage,
};

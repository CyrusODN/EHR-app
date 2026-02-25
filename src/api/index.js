import axios from 'axios';
import { environmentUrls } from '../constants/env';

import { HttpStatusCode } from "axios";

import {ErrorMessages} from '../constants/CustomMessages';
import AsyncStorage from '@react-native-async-storage/async-storage';
const defaultTimeout = 10000;

const formDataRequestHeaders = {
  headers: {
    'Content-Type': 'multipart/form-data',
  },
};

const jsonRequestHeaders = {
  headers: {
    'Content-Type': 'application/json',
  },
};

axios.defaults.baseURL = environmentUrls.api_url;
axios.defaults.timeout = defaultTimeout;

axios.interceptors.request.use(
  async config => {
    // Import store dynamically to avoid circular dependencies if any
    const userStore = require('../store/user').default;
    const token = userStore.getState().token;
    
    if (token) config.headers.Authorization = `Bearer ${token}`;

    config.timeoutErrorMessage = ErrorMessages.timeoutMessage;
    return config;
  },
  error => {
    return Promise.reject(error);
  },
);

axios.interceptors.response.use(
  (response) => {
    if (response.status === HttpStatusCode.Ok) {
      return response?.data?.data || response?.data;
    }
    throw new Error(response?.data?.message || ErrorMessages.generalMessage);
  },
  (error) => {
    if (error.response?.status === 401) {
      const userStore = require('../store/user').default;
      userStore.getState().purgeAuth();
    }

    if (error.response?.data?.message) {
      return Promise.reject(new Error(error.response.data.message));
    }
    return Promise.reject(new Error(ErrorMessages.generalMessage));
  }
);


export const getRequest = (
  url,
  params = {},
  config = {
    ...jsonRequestHeaders,
  },
) => axios.get(url, {params, ...config});

export const postRequest = (
  url,
  data,
  config = {
    ...jsonRequestHeaders,
  },
) => axios.post(url, data, config);

export const putRequest = (
  url,
  data,
  config = {
    ...jsonRequestHeaders,
  },
) => axios.put(url, data, config);

export const deleteRequest = (
  url,
  config = {
    ...jsonRequestHeaders,
  },
) => axios.delete(url, config);

export const getFormDataRequest = (
  url,
  params = {},
  config = {
    ...formDataRequestHeaders,
  },
) => axios.get(url, {params, ...config});

export const postFormDataRequest = (
  url,
  data,
  config = {
    ...formDataRequestHeaders,
  },
) => axios.post(url, data, config);

export const putFormDataRequest = (
  url,
  data,
  config = {
    ...formDataRequestHeaders,
  },
) => axios.put(url, data, config);

export const deleteFormDataRequest = (
  url,
  config = {
    ...formDataRequestHeaders,
  },
) => axios.delete(url, config);
import axios from 'axios';

const API_URL = 'http://localhost:5000/api/documents';

const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

export const getUserDocuments = async () => {
  const response = await axios.get(API_URL, getAuthHeader());
  return response.data;
};

export const getDocument = async (id) => {
  const response = await axios.get(`${API_URL}/${id}`, getAuthHeader());
  return response.data;
};

export const createDocument = async () => {
  const response = await axios.post(API_URL, {}, getAuthHeader());
  return response.data;
};

export const saveDocument = async (id, data) => {
  const response = await axios.put(`${API_URL}/${id}`, data, getAuthHeader());
  return response.data;
};

export const deleteDocument = async (id) => {
  await axios.delete(`${API_URL}/${id}`, getAuthHeader());
};
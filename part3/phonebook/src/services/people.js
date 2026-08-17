import axios from "axios";
const baseUrl = "/api/persons";

const logErrorAndThrow = (error) => {
  const errorMessage = error.response.data.error;
  console.log(error.response.data.error);
  throw error.response.data.error;
};

const getAll = () => {
  const request = axios.get(baseUrl);
  return request.then((response) => response.data).catch(logErrorAndThrow);
};

const create = (newObject) => {
  const request = axios.post(baseUrl, newObject);
  return request.then((response) => response.data).catch(logErrorAndThrow);
};

const update = (id, newObject) => {
  const request = axios.put(`${baseUrl}/${id}`, newObject);
  return request.then((response) => response.data).catch(logErrorAndThrow);
};

const deleteOne = (id) => {
  const request = axios.delete(`${baseUrl}/${id}`);
  return request.then((response) => response.data).catch(logErrorAndThrow);
};

export default { getAll, create, update, deleteOne };

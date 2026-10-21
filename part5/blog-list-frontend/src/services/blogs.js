import axios from 'axios'
const baseUrl = '/api/blogs'
let token = null

const logErrorAndThrow = (error) => {
  const errorMessage = error.response.data.error
  console.log(errorMessage)
  throw errorMessage
}

const setToken = newToken => {
  token = `Bearer ${newToken}`
}

const getAll = async () => {
  const response = await axios.get(baseUrl)
  return response.data
}

const create = async (newObject) => {
  const config = {
    headers: { Authorization: token }
  }

  try {
    const response = await axios.post(baseUrl, newObject, config)
    return response.data
  } catch (error) {
    logErrorAndThrow(error)
  }
}

const update = async (newObject) => {
  const config = {
    headers: { Authorization: token }
  }

  try {
    const response = await axios.put(`${baseUrl}/${newObject.id}`, newObject, config)
    return response.data
  } catch (error) {
    logErrorAndThrow(error)
  }
}

const deleteOne = async (id) => {
  const config = {
    headers: { Authorization: token }
  }

  try {
    const response = await axios.delete(`${baseUrl}/${id}`, config)
    return response.data
  } catch (error) {
    logErrorAndThrow(error)
  }
}

export default { getAll, create, update, deleteOne, setToken }
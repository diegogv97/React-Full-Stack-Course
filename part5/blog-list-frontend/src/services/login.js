import axios from 'axios'
const baseUrl = '/api/login'

const logErrorAndThrow = (error) => {
  const errorMessage = error.response.data.error
  console.log(errorMessage)
  throw errorMessage
}

const login = async credentials => {
  try {
    const response = await axios.post(baseUrl, credentials)
    return response.data
  } catch (error) {
    logErrorAndThrow(error)
  }
}

export default { login }
const axios = require('axios')
const __API_URL__ = 'https://core-api.retell.speechkit.ru'

function fetchAudio (url, wstoken) {
  const endpoint = __API_URL__ + '/api/v1/get_audio_article/'

  return axios.get(endpoint, {
    params: { url },
    headers: {
      Getalice: wstoken,
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  }).then((response) => {
    if (response.data.detail) {
      return Promise.reject(response.data)
    }

    if (response.data.audio) {
      return response.data
    } else {
      return Promise.reject(response.data)
    }
  })
}

export default {
  fetchAudio
}

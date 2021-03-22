const axios = require('axios')
const __GATE_URL__ = 'https://gate.retell.speechkit.ru/api/v1/gate/'

function check (url, deviceType) {
  return axios.get(__GATE_URL__, {
    params: {
      url,
      device_type: deviceType
    }
  }).then(response => {
    if (response.data.status) return true

    throw new Error('Access denied')
  }).catch((e) => {
    throw new Error('Access denied')
  })
}

export default {
  check
}

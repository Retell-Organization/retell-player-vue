const axios = require('axios')
const __ANALYTICS_URL__ = 'https://producer.analytics.retell.speechkit.ru'

function log (data) {
  const url = __ANALYTICS_URL__ + '/api/v3/statistic/audio_article_logs/'
  return axios.post(url, data)
}

export default {
  log
}

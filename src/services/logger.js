import { v1 as uuid1 } from 'uuid'
import AnalyticsApi from '@/api/analytics'

class Logger {
  constructor (article, deviceType, duration) {
    this.article = article
    this.deviceType = deviceType
    this.duration = Math.floor(duration)

    this.sessionId = this.generateSessionId()
    this.version = 0
    this.versions = []
  }

  generateSessionId () {
    return uuid1()
  }

  log (listeningTime) {
    this.pushVersion(listeningTime)

    const data = {
      is_new: this.versions.length === 1,
      uniq_data: this.getActualVersions(),
      user_id: this.sessionId,
      article_id: this.article.id,
      title: this.article.title,
      url: this.article.url,
      device_type: this.deviceType,
      duration: this.duration
    }

    this.send(data)
  }

  pushVersion (listeningTime) {
    this.versions.push({
      listening_time: Math.floor(listeningTime),
      sign: 1,
      version: ++this.version
    })

    if (this.versions.length > 3) {
      this.versions.shift()
    }

    if (this.versions.length > 1) {
      const index = this.versions.length - 2
      this.versions[index].sign = -1
    }
  }

  getActualVersions () {
    if (this.versions.length <= 2) {
      return this.versions.slice()
    }

    return this.versions.slice(1)
  }

  send (data) {
    AnalyticsApi.log(data).catch((error) => {
      if (error.status === 400) {
        this.sessionId = this.generateSessionId()
        this.popVersion()
        return
      }

      if (error.status > 400) {
        this.popVersion()
      }
    })
  }

  popVersion () {
    this.version--
    this.versions.pop()
  }
}

export default Logger

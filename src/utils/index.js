export function makeQuery (options, prefix) {
  return (
    '?' + Object.keys(options)
      .reduce((queryArray, key) => {
        if (typeof options[key] === 'object') {
          if (!Object.keys(options[key]).length) {
            return queryArray
          }
          queryArray.push(makeQuery(options[key], key).substring(1))
        } else {
          queryArray.push(`${prefix ? prefix + '.' : ''}${key}=${encodeURIComponent(options[key])}`)
        }

        return queryArray
      }, [])
      .join('&')
  )
}

const WEBVIEW_TRIGGERS = [
  'WebView',
  '(iPhone|iPod|iPad)(?!.*Safari)',
  'Android.*(wv|.0.0.0)',
  'Linux; U; Android'
]

export function getSource () {
  const webview = isWebview(navigator.userAgent)

  if (webview) {
    return 'mobile_app'
  }

  return isMobile(navigator.userAgent) ? 'mobile' : 'desktop'
}

export function isWebview (ua) {
  const regexp = new RegExp('(' + WEBVIEW_TRIGGERS.join('|') + ')', 'ig')

  return !!ua.match(regexp)
}

export function isMobile (ua) {
  return /Mobi|Android/i.test(ua)
}

export const WidgetTypes = [
  'minimal',
  'superminimal',
  'vzglyadMobile',
  'schkulev',
  'sports',
]

const DeviceTypes = [
  'mobile_app',
  'mobile',
  'desktop'
]

export function normalizeUrl (url) {
  let result = url

  const qIndex = result.indexOf('?')
  if (qIndex > -1) {
    result = result.substring(0, qIndex)
  }

  const hashIndex = result.indexOf('#')
  if (hashIndex > -1) {
    result = result.substring(0, hashIndex)
  }

  return result
}

export function isValidUrl (url) {
  try {
    // eslint-disable-next-line no-new
    new URL(url)
  } catch (_) {
    return false
  }

  return true
}

export function validateOptions (userOptions) {
  const options = JSON.parse(JSON.stringify(userOptions))

  if (!options.type) {
    options.type = 'article'
  }

  if (!options.widget || !WidgetTypes.includes(options.widget)) {
    options.widget = 'minimal'
  }

  if (!options.url) {
    options.url = normalizeUrl(window.location.href)
  } else if (!isValidUrl(options.url)) {
    throw new Error('Retell: Invalid URL')
  } else {
    options.url = normalizeUrl(options.url)
  }

  if (options.type === 'playlist' && !options.id) {
    throw new Error('Retell: Playlist type selected, but no playlist id found')
  }

  if (!options.source || !DeviceTypes.includes(options.source)) {
    options.source = getSource()
  }

  return options
}

export function dispatchPostMessage (data) {
  window.parent.postMessage(data, '*')
}

export function transformEvent (event) {
  return {
    type: event.type.replace('Retell', '').toLowerCase(),
    data: event.data
  }
}

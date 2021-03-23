const WEBVIEW_TRIGGERS = [
  'WebView',
  '(iPhone|iPod|iPad)(?!.*Safari)',
  'Android.*(wv|.0.0.0)',
  'Linux; U; Android'
]

export function makeid () {
  return Math.random().toString(3).substring(2, 36) + Math.random().toString(3).substring(2, 36)
}

export function formatDuration (duration) {
  const mins = '0' + Math.floor(duration / 60)
  const secs = '0' + (Math.floor(duration) % 60)

  return mins.substr(-2) + ':' + secs.substr(-2)
}

export function getRetellLink (options) {
  const url = new URL(options.url)
  return `https://retell.cc?utm_source=widget&utm_medium=${
        options.source
    }&utm_campaign=${url.origin}`
}

export function getRelativeX (element, event, sizeShift = 0) {
  const rect = element.getBoundingClientRect()
  const x = event.clientX + sizeShift - rect.left

  return (100 / element.offsetWidth) * x
}

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

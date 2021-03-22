export function makeid () {
  return Math.random().toString(3).substring(2, 36) + Math.random().toString(3).substring(2, 36)
}

export function formatDuration (duration) {
  const mins = '0' + Math.floor(duration / 60)
  const secs = '0' + (Math.floor(duration) % 60)

  return mins.substr(-2) + ':' + secs.substr(-2)
}

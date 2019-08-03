import padLeft from 'pad-left'

function formatTimePart(part) {
  return padLeft(part.toString(), 2, '0')
}

export function secondsToTime(secs) {
  const hours = formatTimePart(Math.floor(secs / (60 * 60)))
  const divisorForMinutes = secs % (60 * 60)
  const minutes = formatTimePart(Math.floor(divisorForMinutes / 60))
  const divisorForSeconds = divisorForMinutes % 60
  const seconds = formatTimePart(Math.floor(divisorForSeconds))
  let timeObj = { hours, minutes, seconds }
  // no negative
  if (parseInt(seconds) < 0) { timeObj = { hours: '0', minutes: '00', seconds: '00' } }
  return timeObj
}

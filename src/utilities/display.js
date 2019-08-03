export const ellipsize = (str, maxStartChars = 0, maxEndChars = 0) => {
  if (maxStartChars === 0 && maxEndChars === 0) {
    return str
  }
  if (str.length <= maxStartChars + maxEndChars) {
    return str
  }
  return `${str.slice(0, maxStartChars)}…${str.slice(str.length - maxEndChars)}`
}

export const formatDate = (date, format) => {
  if (!date) {
    return
  }
  date = date instanceof Date ? date : new Date(date)
  var dateObj = {
    M: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    m: date.getMinutes(),
    s: date.getSeconds()
  }
  format = format.replace(/(M+|d+|h+|m+|s+)/g, function(v) {
    return ((v.length > 1 ? '0' : '') + dateObj[v.slice(-1)]).slice(-2)
  })
  
  return format.replace(/(y+)/g, function(v) {
    return date.getFullYear().toString().slice(-v.length)
  })
}

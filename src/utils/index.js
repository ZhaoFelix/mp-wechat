function formatNumber(n) {
  const str = n.toString()
  return str[1] ? str : `0${str}`
}

// 将时间格式化为2020-10-20 09:23:34的格式
function formatTime(date) {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()

  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  const t1 = [year, month, day].map(formatNumber).join('-')
  const t2 = [hour, minute, second].map(formatNumber).join(':')

  return `${t1} ${t2}`
}
function formatDateStr(date) {
  // eslint-disable-next-line one-var
  let MM = '', DD = '', HH = '', mm = ''
  if (date.getMonth() > 8) { MM = (date.getMonth() + 1).toString() } else { MM = '0' + (date.getMonth() + 1).toString() }
  if (date.getDate() > 9) { DD = date.getDate().toString() } else { DD = '0' + date.getDate().toString() }
  HH = date.getHours().toString()
  mm = date.getMinutes().toString() == "0" ? "00" : date.getMinutes().toString()
  return date.getFullYear() + '-' + MM + '-' + DD + ' ' + HH + ':' + mm
}
export default {
  formatNumber,
  formatTime,
  formatDateStr
}

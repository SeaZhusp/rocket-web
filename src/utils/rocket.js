export function setUserInfo(userInfo) {
  localStorage.setItem('userInfo', JSON.stringify(userInfo))
}

export function setDictItem(dicts) {
  localStorage.setItem('dicts', JSON.stringify(dicts))
}

export function getUserInfo(userInfo) {
  return JSON.parse(localStorage.getItem('userInfo'))
}

export function getFullname() {
  var userInfo = JSON.parse(localStorage.getItem('userInfo'))
  if (userInfo) {
    return userInfo['fullname']
  } else {
    return ''
  }
}

export function resetForm(form) {
  for (const key in form) {
    form[key] = ''
  }
  return form
}

export function removeAll() {
  localStorage.removeItem('userInfo')
  localStorage.removeItem('dicts')
}

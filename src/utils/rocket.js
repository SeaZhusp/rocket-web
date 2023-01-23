export function setUserInfo(userInfo) {
  localStorage.setItem('userInfo', JSON.stringify(userInfo))
}

export function getUserInfo(userInfo) {
  return JSON.parse(localStorage.getItem('userInfo'))
}

export function resetForm(form) {
  for (const key in form) {
    form[key] = ''
  }
  return form
}

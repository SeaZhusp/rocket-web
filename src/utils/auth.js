const TokenKey = 'token'

export function getToken() {
  return localStorage.getItem(TokenKey)
  
}

export function setToken(token) {
  return localStorage.setItem(TokenKey, token)
}

export function removeToken() {
  return localStorage.removeItem(TokenKey)
}

export function setUserInfo(userInfo) {
  localStorage.setItem('fullname', userInfo.fullname)
}
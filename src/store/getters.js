const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  token: state => state.user.token,
  avatar: state => state.user.avatar,
  fullname: state => state.user.fullname,
  projectId: state => state.rocket.projectId
}
export default getters

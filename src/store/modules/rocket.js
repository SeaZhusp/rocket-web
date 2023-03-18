
const getDefaultState = () => {
  return {
    projectId: ''
  }
}

const state = getDefaultState()

const mutations = {
  SET_PROJECT_ID: (state, projectId) => {
    state.projectId = projectId
  }
}

const actions = {
  changeProjectId({ commit }, data) {
    commit('SET_PROJECT_ID', data)
    localStorage.setItem('projectId', data)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}


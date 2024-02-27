import { createStore } from 'vuex'

export default createStore({
  state: {
    seed: null,
    sec: null,
    pub: null,
    balance: 0,
    size: 10,
    tx: [],
    contacts: [],
  },
  mutations: {
    setseed (state, n) {
      state.seed = n;
    },
    setsec (state, n) {
      state.sec = n;
    },
    setpub (state, n) {
      state.pub = n;
    },
    setbal (state, n) {
      state.balance = n;
    },
    setsize (state, n) {
      state.size = n;
    }
  },
  getters: {
    getpub (state) {
      return state.pub
    }
  },
  actions: {
  },
  modules: {
  }
})

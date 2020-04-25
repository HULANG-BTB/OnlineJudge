// 简介更新对象方法

import {
  RECEIVE_PRIVILEGE_INFO,
  RECEIVE_USER_INFO,
  RECEIVE_PROBLEM_INFO,
  RECEIVE_CONTEST_INFO,
  RECEIVE_CONTEST_PROBLEM_LIST
} from './mutation-types'

import {
  reqPivilegeInfo,
  reqUserInfo,
  reqProblemInfo,
  reqContestInfo,
  reqContestProblemList
} from '../api'

export default {
  // async getUserInfo({commit}, query = null) {
  //   const result = await reqUserInfo(query);
  //   if (result.code === 1) {
  //     const UserInfo = result.data
  //     commit(RECEIVE_USER_INFO, {UserInfo})
  //   }
  // }
  async getPrivilegeInfo({ commit }) {
    const result = await reqPivilegeInfo();
    if (result.code === 1) {
      const Privilege = result.data
      commit(RECEIVE_PRIVILEGE_INFO, { Privilege })
    }
  },
  async getUserInfo({ commit }) {
    const result = await reqUserInfo();
    if (result.code === 1) {
      const User = result.data
      commit(RECEIVE_USER_INFO, { User })
    } else {
      const User = {}
      commit(RECEIVE_USER_INFO, { User })
    }
  },
  async getProblemInfo({ commit }, query) {
    const result = await reqProblemInfo(query);
    if (result.code === 1) {
      result.data.spj = result.data.spj === "0" ? 0 : 1;
      result.data.memory_limit = `${result.data.memory_limit}`;
      const ProblemInfo = result.data
      console.log(ProblemInfo)
      commit(RECEIVE_PROBLEM_INFO, { ProblemInfo })
    }
  },
  async getContestInfo({ commit }, query) {
    const result = await reqContestInfo(query);
    if (result.code === 1) {
      const ContestInfo = result.data
      commit(RECEIVE_CONTEST_INFO, { ContestInfo })
    }
  },
  async getContestProblemList({ commit }, query) {
    const result = await reqContestProblemList(query);
    if (result.code === 1) {
      const ContestProblemList = result.data
      commit(RECEIVE_CONTEST_PROBLEM_LIST, { ContestProblemList })
    }
  }

}
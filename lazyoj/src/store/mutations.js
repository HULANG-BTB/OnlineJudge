// 直接更新多个 STATE 方法

import {
  RECEIVE_USER_INFO,
  RECEIVE_PRIVILEGE_INFO,
  RECEIVE_PROBLEM_INFO,
  RECEIVE_CONTEST_INFO,
  RECEIVE_CONTEST_PROBLEM_LIST
} from './mutation-types'

export default {
  [RECEIVE_USER_INFO] (state, {User}) {
    state.User = User
  },
  [RECEIVE_PRIVILEGE_INFO] (state, {Privilege}) {
    state.Privilege = Privilege
  },
  [RECEIVE_PROBLEM_INFO] (state, { ProblemInfo }) {
    state.ProblemInfo = ProblemInfo
  },
  [RECEIVE_CONTEST_INFO] (state, { ContestInfo }) {
    state.ContestInfo = ContestInfo
  },
  [RECEIVE_CONTEST_PROBLEM_LIST] (state, { ContestProblemList }) {
    state.ContestProblemList = ContestProblemList
  }
}
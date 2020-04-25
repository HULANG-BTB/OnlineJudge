// 请求数据方法
import ajax from './ajax'
import captcha from "./capache";

const BASE_URL = '/api'

// 请求验证码图片
export const reqCaptchaImg = (query) => captcha(BASE_URL + `/Login/captchaCode`, query)
// 请求文章列表 分页查询
export const reqArticleListByPaginator = (query) => ajax(BASE_URL + `/Article/getArticleListByPaginator`, query, 'POST')
// 获取权限列表
export const reqPivilegeInfo = () => ajax(BASE_URL + `/privilege/get`)
// 读取用户信息
export const reqUserInfo = () => ajax(BASE_URL + `/user/info`)
// 读取问题详细信息
export const reqProblemInfo = (query) => ajax(BASE_URL + `/problem/detail`, query)
// 读取竞赛详细信息
export const reqContestInfo = (query) => ajax(BASE_URL + `/contest/detail`, query)
// 读取竞赛问题列表
export const reqContestProblemList = (query) => ajax(BASE_URL + `/contest/problemList`, query)
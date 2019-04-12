import qs from 'qs'
import { Axios as idxAxios } from '../axios'

class RESTfulReq {
  constructor (reqUrl, theTab) {
    this.reqUrl = reqUrl
    this.tab = theTab
  }

  /**
   * 请求数据
   * @param suffixUrl
   * @param url
   * @param query
   * @param callBack
   */
  getReq (query, callBack, suffixUrl = '', url = this.reqUrl + suffixUrl) {
    idxAxios.get(url + '?' + qs.stringify(query))
      .then(function (response) {
        callBack(response)
      })
  }

  /**
   * 新建条目
   */
  postReq (formData, callBack, suffixUrl = '', url = this.reqUrl + suffixUrl) {
    idxAxios.post(url, formData)
      .then(function (response) {
        callBack(response)
      })
  }

  /**
   * 更新条目
   */
  putReq (formData, callBack, suffixUrl = '', url = this.reqUrl + suffixUrl) {
    idxAxios.put(url, formData)
      .then(function (response) {
        callBack(response)
      })
  }

  /**
   * 删除条目
   */
  deleteReq (query, callBack, suffixUrl = '', url = this.reqUrl + suffixUrl) {
    idxAxios.delete(url + '?' + qs.stringify(query))
      .then(function (response) {
        callBack(response)
      })
  }
}

export default RESTfulReq

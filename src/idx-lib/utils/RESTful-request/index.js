import qs from 'qs'
import { Axios as idxAxios } from '../axios'

class RESTfulReq {
  constructor (reqUrl) {
    this.reqUrl = reqUrl
  }

  /**
   * 请求数据
   * @param suffixUrl
   * @param url
   * @param query
   */
  getReq (query, suffixUrl = '', url = this.reqUrl + suffixUrl) {
    return new Promise((resolve, reject) => {
      idxAxios.get(url + '?' + qs.stringify(query))
        .then(function (response) {
          resolve(response)
        }).catch(function (error) {
          reject(error)
        })
    })
  }

  /**
   * post 请求
   * @param formData
   * @param suffixUrl
   * @param url
   * @returns {Promise<any>}
   */
  postReq (formData, suffixUrl = '', url = this.reqUrl + suffixUrl) {
    return new Promise((resolve, reject) => {
      idxAxios.post(url, formData)
        .then(function (response) {
          resolve(response)
        }).catch(function (error) {
          reject(error)
        })
    })
  }

  fileUpload (formData, suffixUrl = '', url = this.reqUrl + suffixUrl) {
    return new Promise((resolve, reject) => {
      idxAxios.post(url, formData,
        {
          headers: {
            'Content-type': 'multipart/form-data;charset=UTF-8'
          }
        })
        .then(function (response) {
          resolve(response)
        }).catch(function (error) {
          reject(error)
        })
    })
  }

  /**
   * put 请求
   * @param formData
   * @param suffixUrl
   * @param url
   * @returns {Promise<any>}
   */
  putReq (formData, suffixUrl = '', url = this.reqUrl + suffixUrl) {
    return new Promise((resolve, reject) => {
      idxAxios.put(url, formData)
        .then(function (response) {
          resolve(response)
        }).catch(function (error) {
          reject(error)
        })
    })
  }

  /**
   * delete 请求
   * @param query
   * @param suffixUrl
   * @param url
   * @returns {Promise<any>}
   */
  deleteReq (query, suffixUrl = '', url = this.reqUrl + suffixUrl) {
    return new Promise((resolve, reject) => {
      idxAxios.delete(url + '?' + qs.stringify(query))
        .then(function (response) {
          resolve(response)
        }).catch(function (error) {
          reject(error)
        })
    })
  }
}

export default RESTfulReq

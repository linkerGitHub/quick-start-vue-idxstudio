import { Axios as idxAxios } from '../axios'

class RESTfulReq {
  constructor (reqUrl, config = {}) {
    this.reqUrl = reqUrl
    this.config = config
  }

  setReqUrl (url) {
    this.reqUrl = url
  }

  getReqUrl () {
    return this.url
  }

  setConfig (config) {
    this.config = config
  }

  getConfig () {
    return this.config
  }

  /**
   * 请求数据
   * @param suffixUrl
   * @param url
   * @param query
   */
  getReq (query, suffixUrl = '', url = this.reqUrl + suffixUrl) {
    const theObj = this
    return new Promise((resolve, reject) => {
      idxAxios.get(url, {
        params: query,
        ...theObj.config
      })
        .then((response) => {
          resolve(response)
        }).catch((error) => {
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
    const theObj = this
    return new Promise((resolve, reject) => {
      idxAxios.post(url, formData, theObj.config)
        .then((response) => {
          resolve(response)
        }).catch((error) => {
          reject(error)
        })
    })
  }

  fileUpload (formData, suffixUrl = '', url = this.reqUrl + suffixUrl) {
    const theObj = this
    return new Promise((resolve, reject) => {
      idxAxios.post(url, formData,
        {
          headers: {
            'Content-type': 'multipart/form-data;charset=UTF-8'
          },
          ...theObj.config
        })
        .then((response) => {
          resolve(response)
        }).catch((error) => {
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
    const theObj = this
    return new Promise((resolve, reject) => {
      idxAxios.put(url, formData, theObj.config)
        .then((response) => {
          resolve(response)
        }).catch((error) => {
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
    const theObj = this
    return new Promise((resolve, reject) => {
      idxAxios.delete(url,
        {
          params: query,
          ...theObj.config
        })
        .then((response) => {
          resolve(response)
        }).catch((error) => {
          reject(error)
        })
    })
  }
}

export default RESTfulReq

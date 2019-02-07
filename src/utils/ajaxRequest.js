export default function (path, method, data, contentType) {
  //console.log(data)
  return new Promise((resolve, reject) => {
    const ajax = new XMLHttpRequest()
    ajax.open(method, path, true)
    if (contentType) {
      ajax.setRequestHeader('Content-type', contentType)
    } else {
      ajax.setRequestHeader('Content-type', 'application/json')
    }
    // ajax.setRequestHeader(requestHeader.header, requestHeader.type)
    ajax.onreadystatechange = function () {
      // //console.log(this.readyState)
      // //console.log(this.status)
      if (this.readyState === 4) {
        //console.log("gg " + this.getResponseHeader('x-set-token'))
        //console.log(this)
        if (this.status === 200) {
          let a = JSON.parse(this.responseText)
          //console.log(a)
          a.token = this.getResponseHeader('x-set-token')
          resolve(a)
        } else {
          reject(this.responseText)
        }
      }
    }
    ajax.send(data)
  })
}
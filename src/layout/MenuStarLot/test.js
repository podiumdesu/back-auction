import { Upload, Icon, Modal, message } from 'antd';
import React from 'react'

import oss from 'ali-oss/lib/browser'
import OSSSignInfo from '../../config'

const client = (self) => {
  // const { token } = self.state
  // ////console.log(token);
  console.log(OSSSignInfo)
  return new oss({
    accessKeyId: OSSSignInfo.accessKeyId,
    accessKeySecret: OSSSignInfo.accessKeySecret,
    region: OSSSignInfo.region,
    bucket: OSSSignInfo.bucket,
  });
}
const uploadPath = (path, file) => {
  // 上传文件的路径，使用日期命名文件目录
  return `pastIdolWishingWells/${file.name.split(".")[0]}-${file.uid}.${file.type.split("/")[1]}`
}
const UploadToOss = (self, path, file) => {
  const url = uploadPath(path, file)
  return new Promise((resolve, reject) => {
    client(self).multipartUpload(url, file).then(data => {
      resolve(data);
    }).catch(error => {
      reject(error)
    })
  })
}
class PicturesWall extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      loading: false,
      previewVisible: false,
      previewImage: '',
      // fileList: [{
      //   uid: '-1',
      //   name: 'xxx.png',
      //   status: 'done',
      //   url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
      // }],
      fileList: []
    };
    this.handleCancel = this.handleCancel.bind(this)
    this.handlePreview = this.handlePreview.bind(this)
    this.handleChange = this.handleChange.bind(this)
    this.beforeUpload = this.beforeUpload.bind(this)
    ////console.log(this.props)
  }


  handleCancel() {
    this.setState({ previewVisible: false })
  }

  handlePreview(file) {
    this.setState({
      previewImage: file.url || file.thumbUrl,
      previewVisible: true,
    });
  }

  // ⚠️
  handleChange({ fileList }) {
    this.setState({ fileList })
    const res = []
    this.state.fileList.map((i) => {
      res.push(i.url)
    })
    ////console.log(res)
    // 处理删除图片的情况
    this.props.onChange(res)
  }
  beforeUpload(file) {
    const isLt2M = file.size / 1024 / 1024 < 10;
    if (!isLt2M) {
      message.error('文件大小应小于10MB！');
      return false
    }
    let reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      // 使用ossupload覆盖默认的上传方法
      UploadToOss(this, '上传路径oss配置信息', file).then(data => {
        // console.log("返回链接")
        // console.log(data.res.requestUrls)
        let temp = data.res.requestUrls.map(i => {
          if (i.indexOf("?uploadId") >= 0) {
            return i.split("?uploadId")[0]
          }
          return i
        })
        console.log(temp)

        this.setState({ imageUrl: temp });
        const fileList = this.state.fileList
        fileList.pop()  // 真是一个dirty的实现
        fileList.push({
          name: file.name,
          uid: file.uid,
          status: "done",
          url: temp[0]
        })
        this.setState({ fileList: fileList })
        const res = []
        this.state.fileList.map((i) => {
          res.push(i.url)
        })

        this.props.onChange(res)
        message.success("上传成功!")
        return true
      })


      return false; // 不调用默认的上传方法
    }
  }
  render() {
    const { previewVisible, previewImage, fileList } = this.state;
    const uploadButton = (
      <div>
        <Icon type="plus" />
        <div className="ant-upload-text">{this.props.uploadInfo}</div>
      </div>
    );
    return (
      <div className="clearfix" style={{ paddingLeft: this.props.paddingLeft ? "90px" : "0" }}>
        <Upload
          action="//jsonplaceholder.typicode.com/posts/"
          listType="picture-card"
          accept={this.props.acceptFileType}
          fileList={fileList}
          onPreview={this.handlePreview}
          onChange={this.handleChange}
          beforeUpload={this.beforeUpload}
        >
          {fileList.length >= this.props.fileNum ? null : uploadButton}
        </Upload>
        <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
          <img alt="example" style={{ width: '100%' }} src={previewImage} />
        </Modal>
      </div>
    );
  }
}

export default PicturesWall

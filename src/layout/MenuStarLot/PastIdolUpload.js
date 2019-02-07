import React from 'react'

import PicturesWall from './test'

import styles from '../../style/PastIdolUpload.sass'
import {
  Input, message, Icon, Button
} from "antd";
export default class PastIdolUpload extends React.Component {
  constructor(props) {
    super(props)
    this.handlePastPhotoOnChange = this.handlePastPhotoOnChange.bind(this)
    this.handlePastPdfOnChange = this.handlePastPdfOnChange.bind(this)
    this.getName = this.getName.bind(this)
    this.state = {
      uploadPastInfo: {
        name: "",
        imageUrl: "",
        flashbackPdfUrl: ""
      }
    }
  }
  async getName(e) {
    // e.preventDefault()
    //console.log(e.target.value)
    const idolName = e.target.value
    await this.setState(prevState => ({
      uploadPastInfo: {
        name: idolName,
        imageUrl: prevState.uploadPastInfo.image,
        flashbackPdf: prevState.uploadPastInfo.pdf
      }
    }))

    if (this.state.uploadPastInfo.name && this.state.uploadPastInfo.image && this.state.uploadPastInfo.pdf) {
      //console.log("upload!!!")
      //console.log(this.state.uploadPastInfo.name)
      this.props.getUploadInfo({ data: this.state.uploadPastInfo, index: this.props.value })
    } else {
      this.props.getUploadInfo({ data: null, index: this.props.value })
    }
  }
  handlePastPhotoOnChange(res) {
    let temp = []
    if (res[0]) {
      temp = res[0].split("?")
    }
    if (temp.length > 2 && temp.length <= 0) {
      message.error("上传失败，文件名中不能包含?等特殊字符")
    } else {
      this.setState(prevState => ({
        uploadPastInfo: {
          name: prevState.uploadPastInfo.name,
          imageUrl: prevState.uploadPastInfo.image,
          flashbackPdfUrl: temp[0]
        }
      }))
      //console.log(this.state.uploadPastInfo)
    }
    this.setState(prevState => ({
      uploadPastInfo: {
        name: prevState.uploadPastInfo.name,
        imageUrl: temp[0],
        flashbackUrl: prevState.uploadPastInfo.pdf
      }
    }))
    if (this.state.uploadPastInfo.name && this.state.uploadPastInfo.image && this.state.uploadPastInfo.pdf) {
      this.props.getUploadInfo({ data: this.state.uploadPastInfo, index: this.props.value })
    } else {
      this.props.getUploadInfo({ data: null, index: this.props.value })
    }

  }
  handlePastPdfOnChange(res) {
    let temp = []
    if (res[0]) {
      temp = res[0].split("?")
    }
    if (temp.length > 2 && temp.length <= 0) {
      message.error("上传失败，文件名中不能包含?等特殊字符")
    } else {
      this.setState(prevState => ({
        uploadPastInfo: {
          name: prevState.uploadPastInfo.name,
          imageUrl: prevState.uploadPastInfo.image,
          flashbackPdfUrl: temp[0]
        }
      }))
      //console.log(this.state.uploadPastInfo)
    }
    if (this.state.uploadPastInfo.name && this.state.uploadPastInfo.image && this.state.uploadPastInfo.pdf) {
      this.props.getUploadInfo({ data: this.state.uploadPastInfo, index: this.props.value })
    } else {
      this.props.getUploadInfo({ data: null, index: this.props.value })
    }
  }
  render() {
    //console.log(this.props)
    //console.log("gg" + this.props.removePastClick)
    return (
      <div className={styles["past-ctn"]}>
        <span >爱豆姓名： </span>
        < Input style={{ width: "55%", display: "inline-block" }} onChange={this.getName} placeholder="姓名" />
        <div className={styles["upload-oss-ctn"]}>
          <PicturesWall fileNum={1} acceptFileType={".jpg,.png"} onChange={this.handlePastPhotoOnChange} uploadInfo={"上传往期图片"} />
          <PicturesWall fileNum={1} acceptFileType={".pdf,.jpg"} onChange={this.handlePastPdfOnChange} uploadInfo={"上传往期总结"} />
        </div>
        <Button type="dashed" onClick={() => this.props.removePastClick(this.props.value)} style={{ width: "88%" }}>
          <Icon type="minus" /> 移除
          </Button>
      </div >
    )
  }
}
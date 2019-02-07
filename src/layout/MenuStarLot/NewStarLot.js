import React from "react"
import styles from "../../style/NewStarLot.sass"


import PicturesWall from "./test"
import PastIdolUpload from './PastIdolUpload'
import { ApolloConsumer } from "react-apollo"
import gql from "graphql-tag"
import {
  Form, Input, Icon, Button, Spin
} from "antd";

import {
  DatePicker, message
} from "antd";
import TextArea from "antd/lib/input/TextArea";

const { MonthPicker, RangePicker } = DatePicker;


let id = 0;

function foo(obj) {
  let json = `${JSON.stringify(obj).replace(/"(\w+?)":/g, "$1:")}`
  if (obj.status) {
    json = json.replace(/status:"(\w+?)"/, "status:$1")
  }
  return `
    mutation {
      createIdolWishingWell(
        data: ${json}
      ) {
        id
        bannerImage
        name
        status
      }
    }
  `
}

class NewStarLot extends React.Component {
  constructor(props) {
    super(props)
    this.remove = this.remove.bind(this)
    this.add = this.add.bind(this)
    this.handlePhotosOnChange = this.handlePhotosOnChange.bind(this)
    this.handleBannerOnChange = this.handleBannerOnChange.bind(this)
    this.handleVideoOnChange = this.handleVideoOnChange.bind(this)
    this.getUploadPastInfo = this.getUploadPastInfo.bind(this)
    this.addPast = this.addPast.bind(this)
    this.removePast = this.removePast.bind(this)
    this.state = {
      photoUrls: [],
      bannerUrl: [],
      videoUrl: [],
      lastWishingWells: [
        // {
        //   idolName: "",
        //   photo: "",
        //   pdf: ""
        // }
      ],
      pastNumArr: [],
      pastNum: -1,
      submitBtnBan: false,
      loading: false
    }
  }

  async addPast() {
    const pastArr = this.state.pastNumArr
    let num = this.state.pastNum + 1

    await this.setState({
      pastNum: num
    })
    const nextArr = pastArr.concat([this.state.pastNum])
    const newIdolWishings = this.state.lastWishingWells
    newIdolWishings[this.state.pastNum] = {}
    await this.setState({
      pastNumArr: nextArr,
      lastWishingWells: newIdolWishings
    })
  }

  async removePast(k) {
    await this.setState({
      pastNumArr: this.state.pastNumArr.filter(key => key !== k)
    })
    const oldWishingWells = this.state.lastWishingWells
    oldWishingWells[k] = null
    await this.setState({
      lastWishingWells: oldWishingWells
    })
  }
  remove(k) {
    const { form } = this.props;
    const keys = form.getFieldValue("keys");
    if (keys.length === 1) {
      return;
    }
    form.setFieldsValue({
      keys: keys.filter(key => key !== k),
    });
  }

  add() {
    const { form } = this.props;
    // can use data-binding to get
    const keys = form.getFieldValue("keys");
    const nextKeys = keys.concat(++id);
    // can use data-binding to set
    // important! notify form to detect changes
    form.setFieldsValue({
      keys: nextKeys,
    });
  }

  handlePhotosOnChange(res) {
    this.setState({
      photoUrls: res
    })
  };

  handleBannerOnChange(res) {
    this.setState({
      bannerUrl: res
    })
  }

  handleVideoOnChange(res) {
    // 最后存在uploadId的问题
    // //console.log(res)
    let temp = []
    if (res[0]) {
      temp = res[0].split("?")
    }
    if (temp.length > 2 && temp.length <= 0) {
      message.error("上传失败，文件名中不能包含?等特殊字符")
    } else {
      this.setState({
        videoUrl: [temp[0]]
      })
    }
  }
  getUploadPastInfo(res) {
    const pastWishing = this.state.lastWishingWells
    if (res.data) {
    } else {
    }
    pastWishing[res.index] = res.data  // null
    this.setState({
      lastWishingWells: pastWishing
    })
  }

  render() {
    const { getFieldDecorator, getFieldValue } = this.props.form;
    const formItemLayout = {
      labelCol: {
        xs: { span: 2 },
        sm: { span: 4 },
      },
      wrapperCol: {
        xs: { span: 10 },
        sm: { span: 20 },
      },
    };

    const formItemLayoutWithOutLabel = {
      wrapperCol: {
        xs: { span: 24, offset: 0 },
        sm: { span: 20, offset: 4 },
      },
    };

    const config = {
      rules: [{ type: "object", required: true, message: "Please select time!" }],
    };
    const rangeConfig = {
      rules: [{ type: "array", required: true, message: "Please select time!" }],
    };



    getFieldDecorator("keys", { initialValue: [0] });
    const keys = getFieldValue("keys");
    const formItems = keys.map((k, index) => (
      <Form.Item
        {...(index === 0 ? formItemLayout : formItemLayoutWithOutLabel)}
        label={index === 0 ? "许愿池" : ""}
        required={true}
        key={k}
      >
        {getFieldDecorator(`fansChoices[${k}]`, {
          validateTrigger: ["onChange", "onBlur"],
          rules: [{
            required: true,
            whitespace: true,
            message: "请输入内容",
          }],
        })(
          <Input placeholder="fans Choices" style={{ width: "60%", marginRight: 8 }} />
        )}
        {keys.length > 1 ? (
          <Icon
            className="dynamic-delete-button"
            type="minus-circle-o"
            disabled={keys.length === 1}
            onClick={() => this.remove(k)}
          />
        ) : null}
      </Form.Item>

    ));
    const pastArr = this.state.pastNumArr
    const pastItems = pastArr.map((k, index) => (
      <PastIdolUpload key={k} value={k} removePastClick={this.removePast} getUploadInfo={this.getUploadPastInfo} />
    ))

    return (
      <Spin spinning={this.state.loading} delay={500}>
        <Form onSubmit={this.handleSubmit}>
          <h3 className={styles["title"]}>Banner图</h3>

          <Form.Item {...formItemLayout} label="上传banner图">
            {getFieldDecorator("bannerUrl", {
              rules: [{
                required: false,
                message: "请上传banner图",
              }],
              valuePropName: "fileList",
              getValueFromEvent: this.handleBannerOnChange,
            })(

              <PicturesWall fileNum={1} acceptFileType={".jpg,,jpeg,.png"} uploadInfo={"上传图片"} />
            )}
          </Form.Item>
          <h3 className={styles["title"]}>爱豆信息</h3>
          <Form.Item {...formItemLayout} label="本期许愿爱豆" >
            {getFieldDecorator("idolName", {
              rules: [{
                required: true,
                message: "请输入爱豆姓名",
              }],
            })(
              <Input style={{ width: "30%" }} placeholder="姓名" />
            )}
          </Form.Item>



          <Form.Item {...formItemLayout} label="爱豆寄语">
            {getFieldDecorator("idolQuote", {
              rules: [{
                required: true,
                message: "请输入爱豆寄语",
              }],
            })(
              <Input style={{ width: "50%" }} placeholder="一句话寄语" />
            )}
          </Form.Item>

          {/* <h3 className={styles["title"]}>图像资料（最多上传五张）</h3> */}
          <Form.Item {...formItemLayout} label="图像资料（最多五张）">
            {getFieldDecorator("photoUrls", {
              rules: [{
                required: false,
                message: "请上传图像资料",
              }],
              valuePropName: "fileList",
              getValueFromEvent: this.handlePhotosOnChange,
            })(

              <PicturesWall fileNum={5} acceptFileType={".jpg,,jpeg,.png"} uploadInfo={"上传图片"} />
            )}
          </Form.Item>
          <Form.Item {...formItemLayout} label="视频资料">
            {getFieldDecorator("videoUrl", {
              rules: [{
                required: false,
                message: "请上传视频资料",
              }],
              valuePropName: "fileList",
              getValueFromEvent: this.handleVideoOnChange,
            })(

              <PicturesWall fileNum={2} acceptFileType={".mp4,.pdf"} uploadInfo={"上传视频"} />
            )}
          </Form.Item>
          {/* <h3 className={styles["title"]}>视频资料（最多上传一段）</h3>

        <PicturesWall fileNum={1} acceptFileType={".mp4"} uploadInfo={"上传视频"} /> */}

          {/* <p>图像资料<small>最多上传五张</small></p> */}





          <h3 className={styles["title"]}>许愿信息</h3>


          <Form.Item
            {...formItemLayout}
            label="圆梦时间"
          >
            {getFieldDecorator("range-picker", rangeConfig)(
              <RangePicker />
            )}
          </Form.Item>


          {formItems}
          <Form.Item {...formItemLayoutWithOutLabel}>
            <Button type="dashed" onClick={this.add} style={{ width: "60%" }}>
              <Icon type="plus" /> 添加愿望
          </Button>
          </Form.Item>


          <h3 className={styles["title"]}>竞拍信息</h3>
          <Form.Item {...formItemLayout} label="许愿底价" >
            {getFieldDecorator("startingPrice", {
              rules: [{
                required: true,
                message: "请输入许愿底价",
              }],
            })(
              < Input style={{ width: "30%" }} placeholder="起拍价" />
            )}
          </Form.Item>
          <Form.Item
            {...formItemLayout}
            label="起拍时间"
          >
            {getFieldDecorator("timeToStart", config)(
              <DatePicker showTime format="YYYY-MM-DD HH:mm:ss" />
            )}
          </Form.Item>

          <h3 className={styles["title"]}>公益信息</h3>
          <Form.Item {...formItemLayout} label="公益信息">
            {getFieldDecorator("publicWelfareString", {
              rules: [{
                required: true,
                message: "请输入公益信息",
              }],
            })(
              <TextArea style={{ width: "80%" }}
                autosize={{ minRows: 4 }}
                placeholder="多行输入" />
            )}
          </Form.Item>

          <h3 className={styles["title"]}>往期回顾</h3>
          <Button type="dashed" onClick={this.addPast} style={{ width: "60%", marginLeft: "180px" }}>
            <Icon type="plus" /> 添加往期回顾
            </Button>
          <div style={{
            display: "flex",
            marginLeft: "180px",
            width: "900px",
            flexWrap: "wrap",
          }}>
            {pastItems}

          </div>

          <h3 className={styles["title"]}>补充内容</h3>
          <Form.Item {...formItemLayout} label="用户协议">
            {getFieldDecorator("extraInfo", {
              rules: [{
                required: true,
                message: "请输入用户协议",
              }],
            })(
              <TextArea style={{ width: "80%" }}
                autosize={{ minRows: 4 }}
                placeholder="多行输入" />
            )}
          </Form.Item>
          {/* <Mutation mutation={createNewWishingWell}> */}
          {/* {(createIdolWishingWell) => ( */}
          <ApolloConsumer >
            {client => (
              <Form.Item {...formItemLayoutWithOutLabel}>
                <Button type="primary" htmlType="submit" disabled={this.state.submitBtnBan} onClick={
                  async e => {
                    e.preventDefault()
                    // let th
                    // alert("gg")
                    //console.log("what happens" + this.props)
                    this.setState({
                      submitBtnBan: true,
                      loading: true
                    })
                    this.props.form.validateFields(async (err, fieldsValue) => {
                      if (!err) {
                        // //console.log("Received values of form: ", fieldsValue);
                      }

                      // Should format date value before submit.
                      //console.log("准备上传")
                      //console.log(this.state.lastWishingWells)
                      let allPastData = this.state.lastWishingWells.filter((key) => key)
                      allPastData = allPastData.length > 0 ? allPastData : null
                      const rangeValue = fieldsValue["range-picker"];
                      let finishAll = fieldsValue["idolName"] && fieldsValue["idolQuote"] && rangeValue[0] && rangeValue[1]
                        && fieldsValue["fansChoices"] && fieldsValue["startingPrice"] && fieldsValue["timeToStart"]
                        && fieldsValue["publicWelfareString"] && fieldsValue["extraInfo"]
                        && this.state.photoUrls && this.state.bannerUrl && this.state.videoUrl
                      // finishAll = true
                      const modifyTime = new Date()
                      if (finishAll) {
                        const values = {
                          // ...fieldsValue,
                          "active": true,
                          "lastStatusChangeTime": modifyTime,
                          "status": "Pending",

                          "bannerImage": this.state.bannerUrl[0],
                          "name": fieldsValue["idolName"],
                          "quote": fieldsValue["idolQuote"],

                          "images": {
                            "set": this.state.photoUrls
                          },
                          "video": this.state.videoUrl[0],

                          "dateFrom": new Date(rangeValue[0]),
                          "dateTo": new Date(rangeValue[1]),

                          "fansChoices": {
                            "set": fieldsValue["fansChoices"]
                          },

                          "startingPrice": parseFloat(fieldsValue["startingPrice"]),
                          "timeToStart": new Date(fieldsValue["timeToStart"]),

                          "publicWelfareString": fieldsValue["publicWelfareString"],
                          // "pastIdolName": fieldsValue["pastIdolName"],

                          "userAgreement": fieldsValue["extraInfo"],
                          "past": {
                            "create": allPastData
                          }
                        };

                        //console.log("测试" + values)
                        console.log(foo(values))

                        const { data } = await client.mutate({
                          mutation: gql(
                            foo(values)
                          )
                        })
                        if (data.createIdolWishingWell.id) {
                          message.success("提报成功！")
                          this.setState({
                            submitBtnBan: true,
                            loading: false
                          })
                        } else {
                          message.error("提报失败，请重试！")
                          this.setState({
                            submitBtnBan: false,
                            loading: false
                          })
                        }
                        //console.log(data.createIdolWishingWell)

                      } else {
                        message.error("请填写完整信息！")
                        this.setState({
                          submitBtnBan: false,
                          loading: false
                        })
                      }


                    });
                  }
                }>Submit</Button>
              </Form.Item>
            )}
          </ApolloConsumer>
          {/* )} */}
          {/* </Mutation> */}
        </Form >

      </Spin>
    );
  }
}

const WrappedDynamicFieldSet = Form.create({ name: "dynamic_form_item" })(NewStarLot);
// ReactDOM.render(<WrappedDynamicFieldSet />, mountNode);
export default WrappedDynamicFieldSet
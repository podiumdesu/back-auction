import React from 'react'

import { message, Carousel, Modal, Button, Input } from 'antd'
import styles from '../../style/AllLotShow.sass'
import detailedStyles from '../../style/DetailedItemOfStarLot.sass'
import { graphql, Query, Mutation } from 'react-apollo'
import gql from 'graphql-tag'
import date from 'date-and-time'
import { Player } from 'video-react'
import { showChineseStatusOfStarLotAccordingString } from '../../utils/commonChange'
import "../../../node_modules/video-react/dist/video-react.css";
import '../../style/carousel.css'

const oneItemData = gql`
  query QUERY_ONE_ITEM(  $id: ID!  ) {
    idolWishingWell(where: {id: $id}) {
      highestBidUser {
        name
        phoneNumber
      }
      status
      quote
      timeToStart
      startingPrice
      fansChoices
      dateTo
      dateFrom
      publicWelfareString
      highestBid
      name
      id
      images
      video
      # category {
      #   id
      # }
    }
  }
`

const changeStatusMutation = gql`
  mutation CHANGE($id: ID!, $time: DateTime!){
    updateIdolWishingWell(
      where: {
        id: $id,
        # status: Finishing,
      },
      data: {
        status: Finished,
        lastStatusChangeTime: $time,
        active: false
      }
    ) {
      # count
      status
    }
  }
`


// ❌ use apolloFetch
// import { createApolloFetch } from 'apollo-fetch'

// const uri = 'http://localhost:4000/graphql'
// const apolloFetch = createApolloFetch({ uri })

class DetailedItem extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      visible: false,
      showVideo: false,
      buttonDisabled: false,
      reasonVisible: false,
      firstCheckFailReason: "",
    }
    this.showBigPhoto = this.showBigPhoto.bind(this)
    this.handleOk = this.handleOk.bind(this)
    this.handleCancel = this.handleCancel.bind(this)
    this.showVideo = this.showVideo.bind(this)
    this.handleReasonOk = this.handleReasonOk.bind(this)
    this.handleReasonCancel = this.handleReasonCancel.bind(this)
    this.getDenyReason = this.getDenyReason.bind(this)
  }

  showBigPhoto(photoPath) {
    this.setState({
      showBigPhotoPath: photoPath,
      visible: true,
    })
  }
  showVideo(photoPath, videoPath) {
    this.setState({
      showBigPhotoPath: photoPath,
      videoPath: videoPath,
      visible: true,
      showVideo: true
    })
    console.log(this.state.videoPath)
  }

  handleOk(e) {
    this.setState({
      visible: false,
      showVideo: false,
    });
  }

  handleCancel(e) {
    this.setState({
      visible: false,
      showVideo: false
    });
  }
  handleReasonCancel() {
    this.setState({
      reasonVisible: false
    })
  }
  handleReasonOk() {
    this.setState({
      reasonVisible: false
    })
  }
  getDenyReason(e) {
    console.log(e)
    this.setState({
      firstCheckFailReason: e.target.value
    })
    console.log(e.target.value)
  }
  render() {
    const that = this
    const ModalThings = !this.state.showVideo ? (
      <div className={detailedStyles['bigPhotos-ctn']}>
        <img className={detailedStyles["bigPhotos"]} src={this.state.showBigPhotoPath} alt="图片" />
      </div>)
      :
      (<div>
        {/* <video src={this.state.videoPath}></video> */}
        <Player
          playsInline
          poster={this.state.showBigPhotoPath}
          src={this.state.videoPath}
        />
      </div>)
    return (
      <div className={detailedStyles['detailed-ctn']}>
        <Modal
          title="详情展示"
          visible={this.state.visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          keyboard={true}
          footer={null}
        >
          {ModalThings}

        </Modal>

        {/* <Modal
          title="输入拒绝理由"
          visible={this.state.reasonVisible}
          onOk={this.handleReasonOk}
          onCancel={this.handleReasonCancel}
          keyboard={true}
          footer={null}
        >
          <Mutation mutation={reportDenyMutation}>
            {(updateIdolWishingWell) => (
              <div className={detailedStyles['button-right']}>
                <Input onChange={that.getDenyReason} style={{ marginBottom: "10px" }} />
                <Button type="primary" style={{ marginRight: "11px" }} disabled={this.state.buttonDisabled} onClick={
                  async e => {
                    e.preventDefault()
                    if (that.state.firstCheckFailReason.length > 0) {
                      const { data } = await updateIdolWishingWell({
                        variables: {
                          id: this.props.id,
                          time: new Date(),
                          reason: that.state.firstCheckFailReason
                        }
                      })
                      if (data.updateIdolWishingWell.count == 1) {
                        that.setState({
                          buttonDisabled: true
                        })
                        message.success('提报审核不通过 操作成功！')
                      } else {
                        message.error('操作失败！请刷新后重试');
                        that.setState({
                          buttonDisabled: true
                        })
                      }
                    } else {
                      message.error("请输入审核不通过的理由！")
                    }

                  }}>
                  提报审核不通过

                </Button>
                <Button disabled={this.state.buttonDisabled} onClick={
                  () => {
                    this.setState({
                      reasonVisible: false,
                      firstCheckFailReason: ""
                    })
                  }
                }>
                  取消
                </Button>
              </div>
            )}
          </Mutation>
        </Modal> */}
        <Query query={oneItemData} variables={{ id: this.props.id }} >
          {({ loading, error, data }) => {
            console.log("ok")
            if (loading) return <div>loading</div>
            if (error) return <div>`Error!: ${error}`</div>
            return (
              <div className={detailedStyles["item-detail-ctn"]} >
                <div className={detailedStyles["left-bar"]}>
                  <div className={detailedStyles["left-top-bar"]}>
                    <Carousel autoplay style={{ backgroundColor: "wheat" }}>
                      <div>
                        <p className={detailedStyles['click-to-video-text']} >点击播放视频</p>
                        <img className={detailedStyles['images']} src={data.idolWishingWell.images[0]} onClick={(e) => this.showVideo(data.idolWishingWell.video, i)} />
                      </div>

                      {data.idolWishingWell.images.map((i) => {
                        return (
                          <div className={detailedStyles["images-ctn"]}>
                            <img className={detailedStyles['images']} src={i} onClick={(e) => this.showBigPhoto(i)} />
                          </div>
                        )
                      })}

                    </Carousel>
                  </div>
                  <div className={detailedStyles["left-bottom-bar"]}>
                    <h3>交易状态</h3>
                    <p >{showChineseStatusOfStarLotAccordingString(data.idolWishingWell.status)}</p>
                  </div>
                </div>
                <div className={detailedStyles["right-bar"]}>
                  <h3 className={detailedStyles["ctn-title"]}>买家资料</h3>
                  {!data.idolWishingWell.highestBidUser ? (
                    <div>
                      <div className={detailedStyles['intro-line']}>
                        <p className={detailedStyles['intro-line-title']}>买家姓名：</p>
                        <p className={detailedStyles['intro-line-text']}>暂无</p>
                      </div>

                      <div className={detailedStyles['intro-line']}>
                        <p className={detailedStyles['intro-line-title']}>联系方式：</p>
                        <p className={detailedStyles['intro-line-text']}>暂无</p>
                      </div>
                      <div className={detailedStyles['intro-line']}>
                        <p className={detailedStyles['intro-line-title']}>交易价格：</p>
                        <p className={detailedStyles['intro-line-text']}>暂无</p>
                      </div>
                    </div>
                  ) : (
                      <div>
                        <div className={detailedStyles['intro-line']}>
                          <p className={detailedStyles['intro-line-title']}>买家姓名：</p>
                          <p className={detailedStyles['intro-line-text']}>{data.idolWishingWell.highestBidUser.name}</p>
                        </div>
                        <div className={detailedStyles['intro-line']}>
                          <p className={detailedStyles['intro-line-title']}>联系方式：</p>
                          <p className={detailedStyles['intro-line-text']}>{data.idolWishingWell.highestBidUser.phoneNumber}</p>
                        </div>
                        <div className={detailedStyles['intro-line']}>
                          <p className={detailedStyles['intro-line-title']}>交易价格：</p>
                          <p className={detailedStyles['intro-line-text']}>¥ {data.idolWishingWell.highestBid}</p>
                        </div>
                      </div>
                    )}

                  <h3 className={detailedStyles["ctn-title"]}>许愿池资料</h3>
                  <div className={detailedStyles["right-top-bar"]}>
                    <div className={detailedStyles["right-top-left-bar"]}>
                      <div className={detailedStyles['intro-line']}>
                        <p className={detailedStyles['intro-line-title']}>爱豆姓名</p><p className={detailedStyles['intro-line-text']}>{data.idolWishingWell.name}</p>
                      </div>
                      <div className={detailedStyles['intro-line']}>
                        <p className={detailedStyles['intro-line-title']}>爱豆寄语 </p><p className={detailedStyles['intro-line-text']}>{data.idolWishingWell.quote}</p>
                      </div>
                      <div className={detailedStyles['intro-line']}>
                        <p className={detailedStyles['intro-line-title']}>竞拍开始时间</p><p className={detailedStyles['intro-line-text']}>{date.format(new Date(data.idolWishingWell.timeToStart), 'YYYY年MM月DD日 HH:mm:ss')}</p>
                      </div>
                      <div className={detailedStyles['intro-line']}>
                        <p className={detailedStyles['intro-line-title']}>起拍价</p><p className={detailedStyles['intro-line-text']}>¥ {data.idolWishingWell.startingPrice}</p>
                      </div>
                    </div>
                  </div>
                  <div className={detailedStyles['right-bottom-bar']} >
                    <div className={detailedStyles['intro-line']}>
                      <p className={detailedStyles['intro-line-title']}>许愿内容</p>
                      <div className={detailedStyles['cert-photo-ctn']}>
                        {data.idolWishingWell.fansChoices.map((i, index) => {
                          return <p>{index + 1}. {i}</p>
                        })}
                      </div>
                    </div>
                  </div>
                  <div className={detailedStyles['intro-line']}>
                    <p className={detailedStyles['intro-line-title']}>圆梦时间</p><p className={detailedStyles['intro-line-text']}>{date.format(new Date(data.idolWishingWell.dateFrom), 'YYYY.MM.DD')} - {date.format(new Date(data.idolWishingWell.dateTo), 'YYYY.MM.DD')}</p>
                  </div>
                  <div className={detailedStyles['right-bottom-bar']} >
                    <div className={detailedStyles['intro-line']}>
                      <p className={detailedStyles['intro-line-title']}>公益内容</p>
                      <div className={detailedStyles['cert-photo-ctn']}>
                        {data.idolWishingWell.publicWelfareString}
                      </div>
                    </div>
                  </div>

                  {data.idolWishingWell.status == "Finishing" ? (
                    <div className={detailedStyles['button-ctn']}>
                      <Mutation mutation={changeStatusMutation}>
                        {(updateIdolWishingWell) => (
                          <div className={detailedStyles['button-left']}>
                            <Button type="primary" disabled={this.state.buttonDisabled} onClick={
                              async e => {
                                e.preventDefault()
                                const { data } = await updateIdolWishingWell({
                                  variables: {
                                    id: this.props.id,
                                    time: new Date(),
                                  }
                                })
                                // console.log(data)
                                if (data.updateIdolWishingWell.status == "Finished") {
                                  this.setState({
                                    buttonDisabled: true
                                  })
                                  message.success('成功完成交易！');
                                } else {
                                  message.error('操作失败！请刷新后重试');
                                  this.setState({
                                    buttonDisabled: true
                                  })
                                }
                              }}>
                              完成交易
                            </Button>
                          </div>
                        )}
                      </Mutation>
                    </div>
                  ) : (
                      <div></div>
                    )

                  }


                </div>
              </div >
            )
          }}
        </Query>

      </div >
    )
  }
}

export default graphql(oneItemData)(DetailedItem)
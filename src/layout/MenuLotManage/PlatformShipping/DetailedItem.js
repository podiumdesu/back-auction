import React from 'react'

import { message, Carousel, Modal, Button, Input } from 'antd'
import styles from '../../../style/AllLotShow.sass'
import detailedStyles from '../../../style/DetailedItem.sass'
import { graphql, Query, Mutation } from 'react-apollo'
import gql from 'graphql-tag'
import date from 'date-and-time'
import { Player } from 'video-react'
import "../../../../node_modules/video-react/dist/video-react.css";
import '../../../style/carousel.css'


const oneItemData = gql`
  query QUERY_ONE_ITEM(  $id: ID!  ) {
    auctionItem(where: {id: $id}) {
      id
      title
      description
      createTime
      startingPrice
      noBarginPrice
      newDegree
      photos
      videos
      certPhotos
      seller {
        id
        name
        phoneNumber
      }
      secondCheckFailReason
      status
      lastStatusChangeTime
      # category {
      #   id
      # }
    }
  }
`
const getSellerInfo = gql`
  query QUERY_ONE_USER($id: ID!) {
    user (where: {id: $id}) {
      addresses {
        id
        name
        phone
        province
        city
        district
        detail
      }
    }
  }
`
const shippingToSeller = gql`  #退货给卖家
  mutation CHANGE($id: ID!, $time: DateTime!, $expressID: String!){
    updateManyAuctionItems(
      where: {
        id: $id,
        status: Ended,
      },
      data: {
        status: Ended,
        lastStatusChangeTime: $time,  #修改了extraStatus
        extraStatus: TransportingToSeller

        platformExpressBackId: $expressID
        platformShippedBackTime: $time
      }
    ) {
      count
    }
  }
`

const shippingToBuyer = gql` #发货给买家
  mutation CHANGE($id: ID!, $time: DateTime!, $expressID: String!){
    updateManyAuctionItems(
      where: {
        id: $id,
        status: PlatformShipping
      },
      data: {
        status: TransportingToBuyer
        lastStatusChangeTime: $time
        extraStatus: null   # 重置extra status

        platformExpressId: $expressID
        platformShippedTime: $time
      }
    ) {
      count
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
      shippingNum: "",
      shippingMoney: "",
      status: "",

    }
    this.showBigPhoto = this.showBigPhoto.bind(this)
    this.handleOk = this.handleOk.bind(this)
    this.handleCancel = this.handleCancel.bind(this)
    this.showVideo = this.showVideo.bind(this)
    this.handleReasonOk = this.handleReasonOk.bind(this)
    this.handleReasonCancel = this.handleReasonCancel.bind(this)
    this.getShippingMoney = this.getShippingMoney.bind(this)
    this.getShippingNum = this.getShippingNum.bind(this)
  }
  // componentDidMount() {
  //   this.setState({
  //     auctionStatus: 
  //   })
  // }
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

  handleReasonOk(e) {
    this.setState({
      reasonVisible: false
    })
  }

  handleReasonCancel(e) {
    this.setState({
      reasonVisible: false,
    });
  }
  getShippingNum(e) {
    this.setState({
      shippingNum: e.target.value
    })
    console.log(this.state.shippingNum)
  }

  getShippingMoney(e) {
    this.setState({
      shippingMoney: e.target.value
    })
  }
  render() {
    const ModalThings = !this.state.showVideo ? (
      <div className={detailedStyles['bigPhotos-ctn']}>
        <img className={detailedStyles["bigPhotos"]} src={this.state.showBigPhotoPath} alt="图片" />
      </div>)
      :
      (<div>
        <Player
          playsInline
          poster={this.state.showBigPhotoPath}
          src={this.state.videoPath}
        />
      </div>)
    let that = this
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
        <Modal
          title="输入发货信息"
          visible={this.state.reasonVisible}
          onOk={this.handleReasonOk}
          onCancel={this.handleReasonCancel}
          keyboard={true}
          footer={null}
        >
          {this.state.status === "Ended" ?
            <Mutation mutation={shippingToSeller}>
              {(updateManyAuctionItems) => (
                <div className={detailedStyles['button-right']}>
                  <Input addonBefore="快递单号" onChange={that.getShippingNum} style={{ marginBottom: "10px" }} />
                  <Input addonBefore="邮费" disabled placeholder="邮费到付" onChange={that.getShippingMoney} style={{ marginBottom: "10px" }} />
                  <Button type="primary" style={{ marginRight: "11px" }} disabled={this.state.buttonDisabled} onClick={
                    async e => {
                      e.preventDefault()
                      if (this.state.shippingNum.length > 0) {
                        const { data } = await updateManyAuctionItems({
                          variables: {
                            id: this.props.id,
                            time: new Date(),
                            expressID: this.state.shippingNum
                          }
                        })
                        if (data.updateManyAuctionItems.count == 1) {
                          that.setState({
                            buttonDisabled: true
                          })
                          message.success('发货成功！')
                        } else {
                          message.error('操作失败！请刷新后重试');
                          that.setState({
                            buttonDisabled: true
                          })
                        }
                      } else {
                        message.error("请填写发货编号！")
                      }
                    }}>
                    确认退货给卖家
                     </Button>
                  <Button disabled={this.state.buttonDisabled} onClick={
                    () => {
                      this.setState({
                        reasonVisible: false,
                      })
                    }
                  }>
                    取消
                  </Button>
                </div>
              )}
            </Mutation>
            :
            <Mutation mutation={shippingToBuyer}>
              {(updateManyAuctionItems) => (
                <div className={detailedStyles['button-right']}>
                  <Input addonBefore="快递单号" onChange={that.getShippingNum} style={{ marginBottom: "10px" }} />
                  <Input addonBefore="邮费" onChange={that.getShippingMoney} style={{ marginBottom: "10px" }} />
                  <Button type="primary" style={{ marginRight: "11px" }} disabled={this.state.buttonDisabled} onClick={
                    async e => {
                      console.log("hello")
                      e.preventDefault()
                      if (this.state.shippingNum.length > 0 && this.state.shippingMoney.length > 0) {
                        const { data } = await updateManyAuctionItems({
                          variables: {
                            id: this.props.id,
                            time: new Date(),
                            expressID: this.state.shippingNum
                          }
                        })
                        console.log(data)
                        if (data.updateManyAuctionItems.count == 1) {
                          that.setState({
                            buttonDisabled: true
                          })
                          message.success('发货成功！')
                        } else {
                          message.error('操作失败！请刷新后重试');
                          that.setState({
                            buttonDisabled: true
                          })
                        }
                      } else {
                        message.error("请完成填写信息！")
                      }
                    }}>
                    确认发货给买家
                </Button>
                  <Button disabled={this.state.buttonDisabled} onClick={
                    () => {
                      this.setState({
                        reasonVisible: false,
                      })
                    }
                  }>
                    取消
                </Button>
                </div>
              )}
            </Mutation>
          }


        </Modal>
        <Query query={oneItemData} variables={{ id: this.props.id }} >
          {({ loading, error, data }) => {
            console.log("query ok")
            if (loading) return <div>loading</div>
            if (error) return <div>`Error!: ${error}`</div>
            return (
              <div className={detailedStyles["item-detail-ctn"]} >
                <div className={detailedStyles["left-bar"]}>
                  <div className={detailedStyles["left-top-bar"]}>
                    <Carousel autoplay style={{ backgroundColor: "wheat" }}>
                      {data.auctionItem.videos.map((i) => {
                        return (
                          <div>
                            <p className={detailedStyles['click-to-video-text']} >点击播放视频</p>
                            <img className={detailedStyles['photos']} src={data.auctionItem.photos[0]} onClick={(e) => this.showVideo(data.auctionItem.photos[1], i)} />
                          </div>
                        )
                      })}
                      {data.auctionItem.photos.map((i) => {
                        return (
                          <div className={detailedStyles["photos-ctn"]}>
                            <img className={detailedStyles['photos']} src={i} onClick={(e) => this.showBigPhoto(i)} />
                          </div>
                        )
                      })}

                      {/* <div><h3>1</h3></div>
                      <div><h3>2</h3></div>
                      <div><h3>3</h3></div>
                      <div><h3>4</h3></div> */}
                    </Carousel>
                  </div>
                  <div className={detailedStyles["left-bottom-bar"]}>
                    <h3 className={detailedStyles["ctn-title"]}>卖家资料</h3>
                    <p>卖 家 ：{data.auctionItem.seller.name}</p>
                    <p>联系方式 {data.auctionItem.seller.phoneNumber}</p>
                    {data.auctionItem.status === "Ended" ? <p>二审拒绝理由 ：{data.auctionItem.secondCheckFailReason}</p> : ""}

                  </div>
                </div>
                <div className={detailedStyles["right-bar"]}>
                  {
                    data.auctionItem.status === "Ended" ?
                      <div className={detailedStyles['right-bottom-bar']} >
                        <h3 className={detailedStyles["ctn-title"]}>卖家资料（审核不通过，退货给卖家）</h3>
                        <div className={detailedStyles['intro-line']}>
                          <p className={detailedStyles['intro-line-title']}>收货人姓名</p><p className={detailedStyles['intro-line-text']}> 猪猪柳</p>
                        </div>
                        <div className={detailedStyles['intro-line']}>
                          <p className={detailedStyles['intro-line-title']}>联系电话</p><p className={detailedStyles['intro-line-text']}> 13524452340</p>
                        </div>
                        <div className={detailedStyles['intro-line']}>
                          <p className={detailedStyles['intro-line-title']}>收货地址</p><p className={detailedStyles['intro-line-text']}> 湖北省武汉市华中科技大学主校区沁苑东九舍</p>
                        </div>
                        {/* <div className={detailedStyles['intro-line']}>
                      <p className={detailedStyles['intro-line-title']}>联系电话</p><p className={detailedStyles['intro-line-text']}> 13524452340</p>
                    </div> */}
                      </div>
                      :
                      <div className={detailedStyles['right-bottom-bar']} >
                        <h3 className={detailedStyles["ctn-title"]}>买家资料（审核通过，发货给买家）</h3>
                        <div className={detailedStyles['intro-line']}>
                          <p className={detailedStyles['intro-line-title']}>收货人姓名</p><p className={detailedStyles['intro-line-text']}> 桃桃</p>
                        </div>
                        <div className={detailedStyles['intro-line']}>
                          <p className={detailedStyles['intro-line-title']}>联系电话</p><p className={detailedStyles['intro-line-text']}> 13524452340</p>
                        </div>
                        <div className={detailedStyles['intro-line']}>
                          <p className={detailedStyles['intro-line-title']}>收货地址</p><p className={detailedStyles['intro-line-text']}> 湖北省武汉市华中科技大学主校区沁苑东九舍</p>
                        </div>
                        {/* <div className={detailedStyles['intro-line']}>
                      <p className={detailedStyles['intro-line-title']}>联系电话</p><p className={detailedStyles['intro-line-text']}> 13524452340</p>
                    </div> */}
                      </div>
                  }


                  <div className={detailedStyles['button-ctn']}>
                    <div className={detailedStyles['button-left']}>
                      {/* <Query query={getSellerInfo}> */}
                      <Button type="primary" disabled={this.state.buttonDisabled} onClick={
                        () => {
                          this.setState({
                            reasonVisible: true,
                            status: data.auctionItem.status
                          })
                        }
                      }>
                        点击发货
                      </Button>
                      {/* </Query> */}

                    </div>
                  </div>
                  <h3 className={detailedStyles["ctn-title"]}>拍品资料</h3>
                  <div className={detailedStyles["right-top-bar"]}>
                    <div className={detailedStyles["right-top-left-bar"]}>
                      <div className={detailedStyles['intro-line']}>
                        <p className={detailedStyles['intro-line-title']}>拍品名称</p><p className={detailedStyles['intro-line-text']}>{data.auctionItem.title}</p>
                      </div>
                      <div className={detailedStyles['intro-line']}>
                        <p className={detailedStyles['intro-line-title']}>拍品介绍 </p><p className={detailedStyles['intro-line-text']}>{data.auctionItem.description}</p>
                      </div>
                      <div className={detailedStyles['intro-line']}>
                        <p className={detailedStyles['intro-line-title']}>提报时间</p><p className={detailedStyles['intro-line-text']}>{date.format(new Date(data.auctionItem.createTime), 'YYYY年MM月DD日 HH:mm')}</p>
                      </div>
                    </div>
                    <div className={detailedStyles["right-top-right-bar"]}>
                      <div className={detailedStyles['intro-line']}>
                        <p className={detailedStyles['intro-line-title']}>一口价</p><p className={detailedStyles['intro-line-text']}>¥ {data.auctionItem.noBarginPrice}</p>
                      </div>
                      <div className={detailedStyles['intro-line']}>
                        <p className={detailedStyles['intro-line-title']}>起拍价</p><p className={detailedStyles['intro-line-text']}>¥ {data.auctionItem.startingPrice}</p>
                      </div>
                      <div className={detailedStyles['intro-line']}>
                        <p className={detailedStyles['intro-line-title']}>新度</p><p className={detailedStyles['intro-line-text']}>{data.auctionItem.newDegree}</p>
                      </div>
                    </div>
                  </div>
                  <div className={detailedStyles['right-bottom-bar']} >
                    <div className={detailedStyles['intro-line']}>
                      <p className={detailedStyles['intro-line-title']}>拍品保障</p>
                      <div className={detailedStyles['cert-photo-ctn']}>
                        {data.auctionItem.certPhotos.map((i) => {
                          return <img className={detailedStyles['cert-photo']} src={i} onClick={(e) => this.showBigPhoto(i)} />
                        })}
                      </div>
                    </div>
                  </div>
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
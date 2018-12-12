import React from 'react'

import { message, Carousel, Modal } from 'antd'
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
      status
      lastStatusChangeTime
      # category {
      #   id
      # }
    }
  }
`

const changeStatusMutation = gql`
  mutation CHANGE($id: ID!, $time: Date!){
    updateManyAuctionItems(
      where: {
        id: $id,
        status: InFirstCheck,
      },
      data: {
        status: InAuction,
        lastStatusChangeTime: $time,
      }
    ) {
      count
    }
  }
`
// const reportDenyMutation = gql`
//   mutation CHANGE($id: ID!){
//     updateManyAuctionItems(
//       where: {
//         id: $id,
//         status: InFirstCheck,
//       },
//       data: {
//         status: Ended,
//         endedReason: FirstCheckFailed,
//         endedTime: new Date(now),
//         lastStatusChangeTime: new Date(now),
//       }
//     ) {
//       count
//     }
//   }
// `

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
    }
    this.showBigPhoto = this.showBigPhoto.bind(this)
    this.handleOk = this.handleOk.bind(this)
    this.handleCancel = this.handleCancel.bind(this)
    this.showVideo = this.showVideo.bind(this)
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
  render() {
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
                      {data.auctionItem.videos.map((i) => {
                        return (
                          <div>
                            <p className={detailedStyles['click-to-video-text']} >点击播放视频</p>
                            <img className={detailedStyles['photos']} src={data.auctionItem.photos[1]} onClick={(e) => this.showVideo(data.auctionItem.photos[1], i)} />
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
                  </div>
                </div>
                <div className={detailedStyles["right-bar"]}>
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
                        <p className={detailedStyles['intro-line-title']}>状态改变</p><p className={detailedStyles['intro-line-text']}>{date.format(new Date(data.auctionItem.lastStatusChangeTime), 'YYYY年MM月DD日 HH:mm')}</p>
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
import React from 'react'
import { DatePicker, Input, Select, Button, Icon, Pagination } from 'antd'
import { graphql, Query } from 'react-apollo'
import gql from 'graphql-tag'
import { getStatusColorOfStarLot } from '../../utils/commonChange'
import styles from '../../style/AllLotShow.sass'
import { ApolloConsumer } from 'react-apollo'
import 'babel-polyfill';

import moment from 'moment';
import 'moment/locale/zh-cn';
moment.locale('zh-cn');

import date from 'date-and-time'
import DetailedItem from './DetailedItem'
import DisplayItem from './DisplayItem'
const pageDataItemsNum = 15

// const RGBType = new GraphQLEnumType({
//   name: 'AuctionStatus',
//   values: {
//     InFirstCheck: { value: 0 },
//   }
// })
const getAllStarLot = gql`
  query idolWishingWells {
    idolWishingWells {
      name
      images
      status
      lastStatusChangeTime
      id
      highestBidUser {
        name
      }
    }
  }
`
// const getAllStarLot = gql`
//   query idolWishingWells($status: Number!){
//     idolWishingWells(status: $status) {
//       id
//       title
//       description
//       status
//       categoryId
//       lastStatusChangeTime
//       seller {
//         id
//         phoneNumber
//       }
//     }
//   }
// `
class AllStarLot extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      allItems: null,
      displayItems: null,
      currentItemId: "",
      progressTips: "->详情",
      returnEle: [],
      currentPage: 1,
    }
    this.changePageClick = this.changePageClick.bind(this)
    this.transferItemId = this.transferItemId.bind(this)
    this.clearItemId = this.clearItemId.bind(this)
    this.getAllItems = this.getAllItems.bind(this)
  }

  async clearItemId() {
    this.setState({
      currentItemId: ""
    })

  }

  transferItemId(itemId) {

    console.log('transferItemId' + itemId)
    // 通过 itemID 获取该产品的信息
    // 目前应当是需要
    this.setState({
      currentItemId: itemId,
    })
  }
  changePageClick(page, pageSize) {
    console.log(page, pageSize)
    const returnEle = []

    for (let i = 0, len = (this.state.displayItems.length < page * pageSize) ? this.state.displayItems.length % pageSize : pageSize; i < len; i++) {
      console.log(len)
      returnEle.push(
        <DisplayItem transferItemId={this.transferItemId.bind(this, this.state.displayItems[i + (page - 1) * pageSize].id)}
          key={this.state.displayItems[i + (page - 1) * pageSize].id}
          statusToShow={date.format(new Date(this.state.displayItems[i + (page - 1) * pageSize].lastStatusChangeTime), 'YYYY年MM月DD日 HH:mm')}
          statusColor={getStatusColorOfStarLot(this.state.displayItems[i + (page - 1) * pageSize].status)}
          info={this.state.displayItems[i + (page - 1) * pageSize]}
        />)
    }
    console.log(returnEle)
    this.setState({
      returnEle: returnEle,
      currentPage: page
    })
  }
  // 点击获取所有内容按钮触发：
  getAllItems(allItems) {
    this.setState({
      allItems: allItems,
      displayItems: allItems
    })
    const returnEle = []
    const firstRenderNum = (this.state.displayItems.length < pageDataItemsNum) ? this.state.displayItems.length : pageDataItemsNum
    if (firstRenderNum === 0) {
      console.log("ddd")
      this.setState({
        returnEle: "没有需要审核的拍品"
      })
    } else {
      // console.log(this.state.displayItems[0])
      for (let i = 0, len = firstRenderNum; i < len; i++) {
        console.log('color' + getStatusColorOfStarLot(this.state.displayItems[i].status))
        console.log('status' + this.state.displayItems[i].status)
        returnEle.push(
          <DisplayItem transferItemId={this.transferItemId.bind(this, this.state.displayItems[i].id)}
            key={this.state.displayItems[i].id}
            statusToShow={date.format(new Date(this.state.displayItems[i].lastStatusChangeTime), 'YYYY年MM月DD日 HH:mm')}
            statusColor={getStatusColorOfStarLot(this.state.displayItems[i].status)}
            info={this.state.displayItems[i]} />)
      }
      this.setState({
        returnEle: returnEle
      })
    }
    // const firstRenderNum = (this.state.displayItems.length < pageDataItemsNum) ? this.state.displayItems.length : pageDataItemsNum
    // if (firstRenderNum === 0) {
    //   returnEle = "没有需要审核的拍品"
    // } else {
    //   for (let i = 0, len = firstRenderNum; i < len; i++) {
    //     returnEle.push(
    //       <DisplayItem transferItemId={this.transferItemId.bind(this, this.state.displayItems[i].id)}
    //         key={this.state.displayItems[i].id}
    //         statusToShow="hello"
    //         info={this.state.displayItems[i]} />)
    //   }
    // }
  }



  render() {
    if (this.state.displayItems && this.state.currentItemId.length <= 0) {
      return (
        <div>
          <div className={styles['search-bar']}>
            <div className={styles['search-detail']}>
              <span className={styles['item-title']}>明星姓名</span>
              <div className={styles['search-item-ctn']}>
                <Input size="default"></Input>
              </div>
              <span className={styles['item-title']}>买家手机号码</span>
              <div className={styles['search-item-ctn']}>
                <Input size="default"></Input>
              </div>
              <Button onClick={this.getSearchResult}><Icon type="search"></Icon>搜索</Button>
            </div>
          </div>
          <div className={styles["result-ctn"]}>
            <div className={styles["result-ctn-flex"]}>
              {this.state.returnEle}
            </div>
          </div>
          <Pagination onChange={this.changePageClick} hideOnSinglePage={true} total={this.state.displayItems.length} pageSize={pageDataItemsNum} defaultCurrent={this.state.currentPage} current={this.state.currentPage} />
        </div>

      )
    } else if (this.state.displayItems && this.state.currentItemId.length > 0) {  // 展示具体物品信息
      return (
        <ApolloConsumer>
          {client => (
            <div>
              <p className={styles["return-text"]}><span style={{ textDecoration: 'underline' }}
                onClick={async () => {
                  const { data } = await client.query({
                    query: getAllStarLot,
                  })
                  console.log(data.idolWishingWells)
                  this.getAllItems(data.idolWishingWells)
                  this.clearItemId()
                  let page = this.state.currentPage
                  let pageSize = pageDataItemsNum
                  let returnEle = []
                  for (let i = 0, len = (this.state.displayItems.length < page * pageSize) ? this.state.displayItems.length % pageSize : pageSize; i < len; i++) {
                    console.log(len)
                    returnEle.push(
                      <DisplayItem transferItemId={this.transferItemId.bind(this, this.state.displayItems[i + (page - 1) * pageSize].id)}
                        key={this.state.displayItems[i + (page - 1) * pageSize].id}
                        statusToShow={showChineseStatusAccordingString(this.state.displayItems[i + (page - 1) * pageSize].status)}
                        statusColor={getStatusColorOfStarLot(this.state.displayItems[i + (page - 1) * pageSize].status)}

                        info={this.state.displayItems[i + (page - 1) * pageSize]}
                      />)
                  }
                  console.log(returnEle)
                  this.setState({
                    returnEle: returnEle,
                  })
                }}>拍品提报审核</span>->拍品详情</p>
              <div className={styles["result-ctn"]}>
                <div className={styles["result-ctn-flex"]}>
                  <DetailedItem id={this.state.currentItemId} />
                </div>
              </div>
            </div>
          )}
        </ApolloConsumer>
      )
    } else {
      return (
        <ApolloConsumer>
          {client => (
            <div>
              <button onClick={async () => {
                const { data } = await client.query({
                  query: getAllStarLot,
                })
                this.getAllItems(data.idolWishingWells)
              }}>点击获取内容</button>

            </div>
          )}

        </ApolloConsumer>
      )
    }
  }
}

export default AllStarLot
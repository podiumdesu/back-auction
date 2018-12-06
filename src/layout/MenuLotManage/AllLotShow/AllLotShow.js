import React from 'react'
import { DatePicker, Input, Select, Button, Icon, Pagination } from 'antd'
import { graphql, Query } from 'react-apollo'
import gql from 'graphql-tag'
import { showCategoryAccordingNum, showChineseStatusAccordingString } from '../../../utils/commonChange'
import styles from '../../../style/AllLotShow.sass'
import { ApolloConsumer } from 'react-apollo'
import 'babel-polyfill';

import moment from 'moment';
import 'moment/locale/zh-cn';
moment.locale('zh-cn');

import date from 'date-and-time'
import DetailedItem from '../AllLotShow/DetailedItem'
import DisplayItem from '../AllLotShow/DisplayItem'
const pageDataItemsNum = 15

// const RGBType = new GraphQLEnumType({
//   name: 'AuctionStatus',
//   values: {
//     InFirstCheck: { value: 0 },
//   }
// })
const getWaitingFirstCheckItemData = gql`
  query {
    auctionItems (
      where: {
        status: InFirstCheck
      }
    ){
      id
      title
      description
      status
      photos
      seller {
        id
        phoneNumber
      }
      category {
        id
        title
      }
      createTime
      lastStatusChangeTime
    }
  }
`
// const getWaitingFirstCheckItemData = gql`
//   query auctionItems($status: Number!){
//     auctionItems(status: $status) {
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
class tradeResult extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      allItems: null,
      displayItems: null,
      currentItemId: "",
      progressTips: "->拍品详情",
      returnEle: [],
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
          info={this.state.displayItems[i + (page - 1) * pageSize]}
        />)
    }
    console.log(returnEle)
    this.setState({
      returnEle: returnEle
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
      console.log("setState")
      for (let i = 0, len = firstRenderNum; i < len; i++) {
        returnEle.push(
          <DisplayItem transferItemId={this.transferItemId.bind(this, this.state.displayItems[i].id)}
            key={this.state.displayItems[i].id}
            statusToShow={date.format(new Date(this.state.displayItems[i].lastStatusChangeTime), 'YYYY年MM月DD日 HH:mm')}
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
          <p>拍品提报审核</p>
          <div className={styles['search-bar']}>
            <div className={styles['search-detail']}>
              <span className={styles['item-title']}>卖家号码</span>
              <div className={styles['search-item-ctn']}>
                <Input size="default"></Input>
              </div>
              <span className={styles['item-title']}>拍品名称</span>
              <div className={styles['search-item-ctn']}>
                <Input size="default"></Input>
              </div>
              <span className={styles['item-title']}>类别</span>
              <div className={styles['search-category-ctn']}>
                <Select size="default" defaultActiveFirstOption={true} defaultValue="字画">
                  <Option value="painting">字画</Option>
                  <Option value="oldthings">古董</Option>
                  <Option value="rich">奢侈品</Option>
                  <Option value="food">食品</Option>
                </Select>
              </div>
              <span className={styles['item-title']}>提报时间</span>
              <div className={styles['search-item-ctn']}>
                <DatePicker className={styles['search-date']} defaultValue={moment('2018-11-01', 'YYYY-MM-DD')} showToday={true} onChange={this.test} />
              </div>
              <Button onClick={this.getSearchResult}><Icon type="search"></Icon>搜索</Button>
            </div>
          </div>
          <div className={styles["result-ctn"]}>
            <div className={styles["result-ctn-flex"]}>
              {this.state.returnEle}
            </div>
          </div>
          <Pagination total={50} onChange={this.changePageClick} hideOnSinglePage={true} total={this.state.displayItems.length} pageSize={pageDataItemsNum} defaultCurrent={this.state.displayItems.length / pageDataItemsNum} current={this.state.displayItems.length / pageDataItemsNum} />
        </div>

      )
    } else if (this.state.displayItems && this.state.currentItemId.length > 0) {  // 展示具体物品信息
      return (
        <ApolloConsumer>
          {client => (
            <div>
              <p><span style={{ textDecoration: 'underline' }}
                onClick={async () => {
                  const { data } = await client.query({
                    query: getWaitingFirstCheckItemData,
                  })
                  console.log(data.auctionItems)
                  this.getAllItems(data.auctionItems)
                  this.clearItemId()
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
                  query: getWaitingFirstCheckItemData,
                })
                this.getAllItems(data.auctionItems)
              }}>点击获取内容</button>

            </div>
          )}

        </ApolloConsumer>
      )
    }
  }
}

export default tradeResult
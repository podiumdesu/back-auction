import React from 'react'
import { DatePicker, Input, Select, Button, Icon, Pagination } from 'antd'
import { graphql, Query } from 'react-apollo'
import gql from 'graphql-tag'
import { showShippingStatus, getStatusColor, getUniqueCategoryName } from '../../../utils/commonChange'
import styles from '../../../style/AllLotShow.sass'
import { ApolloConsumer } from 'react-apollo'
import 'babel-polyfill';

import moment from 'moment';
import 'moment/locale/zh-cn';
moment.locale('zh-cn');

const Option = Select.Option
import date from 'date-and-time'
import DetailedItem from './DetailedItem'
import DisplayItem from '../AllLotShow/DisplayItem'
const pageDataItemsNum = 15

// const RGBType = new GraphQLEnumType({
//   name: 'AuctionStatus',
//   values: {
//     InFirstCheck: { value: 0 },
//   }
// })

function foo(obj, status_in, extra_status_in) {
  let json = `${JSON.stringify(obj).replace(/"(\w+?)":/g, "$1:")}`
  if (obj.status) {
    json = json.replace(/status:"(\w+?)"/, "status:$1")
  }
  if (extra_status_in) {
    json = json.slice(0, -1) + `,extraStatus_in: [PlatformShippingBack]}`
  }
  if (status_in) {
    json = json.slice(0, -1) + `,status_in: [PlatformShipping, Ended]}`
  }

  return `
    query {
      auctionItems (
        where: ${json}
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
}


const getWaitingFirstCheckItemData = gql`
  query {
    auctionItems (
      where: {
        status_in: [PlatformShipping, Ended]   # 发货给买家 / 二审不通过
        extraStatus_in: [PlatformShippingBack]  # 发货给卖家
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
class PlatformShipping extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      allItems: null,
      displayItems: null,
      currentItemId: "",
      progressTips: "->拍品详情",
      returnEle: [],
      currentPage: 1,



      allCategoryName: null,

      searchItemTitle: "",
      searchPhoneNumber: "",
      searchReportTime: "",
      searchCategoryName: ""
    }
    this.changePageClick = this.changePageClick.bind(this)
    this.transferItemId = this.transferItemId.bind(this)
    this.clearItemId = this.clearItemId.bind(this)
    this.getAllItems = this.getAllItems.bind(this)


    this.getItemTitle = this.getItemTitle.bind(this)
    this.getCategoryName = this.getCategoryName.bind(this)
    this.getReportTime = this.getReportTime.bind(this)
    this.getSellerPhoneNumber = this.getSellerPhoneNumber.bind(this)
  }


  getItemTitle(e) {
    this.setState({
      searchItemTitle: e.target.value
    })
  }
  getCategoryName(value) {
    this.setState({
      searchCategoryName: value
    })
  }
  getReportTime(e) {
    this.setState({
      searchReportTime: e.target.value
    })
  }
  getSellerPhoneNumber(e) {
    this.setState({
      searchPhoneNumber: e.target.value
    })
  }

  async clearItemId() {
    this.setState({
      currentItemId: ""
    })

  }

  transferItemId(itemId) {

    // console.log('transferItemId' + itemId)
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
          statusToShow={showShippingStatus(this.state.displayItems[i + (page - 1) * pageSize].status)}
          statusColor={getStatusColor(this.state.displayItems[i + (page - 1) * pageSize].status)}
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
        returnEle: "没有需要发货的拍品"
      })
    } else {

      for (let i = 0, len = firstRenderNum; i < len; i++) {
        console.log('color' + getStatusColor(this.state.displayItems[i].status))
        console.log('status' + this.state.displayItems[i].status)
        returnEle.push(
          <DisplayItem transferItemId={this.transferItemId.bind(this, this.state.displayItems[i].id)}
            key={this.state.displayItems[i].id}
            statusToShow={showShippingStatus(this.state.displayItems[i].status)}
            statusColor={getStatusColor(this.state.displayItems[i].status)}
            info={this.state.displayItems[i]} />)
      }
      this.setState({
        returnEle: returnEle
      })
    }
  }

  getSearchResult(allItems) {
    this.setState({
      allItems: allItems,
      displayItems: allItems
    })
    const returnEle = []
    const firstRenderNum = (this.state.displayItems.length < pageDataItemsNum) ? this.state.displayItems.length : pageDataItemsNum
    if (firstRenderNum === 0) {
      //console.log("ddd")
      this.setState({
        returnEle: "没有查询到符合要求的拍品"
      })
    } else {

      for (let i = 0, len = firstRenderNum; i < len; i++) {
        //console.log('color' + getStatusColor(this.state.displayItems[i].status))
        //console.log('status' + this.state.displayItems[i].status)
        returnEle.push(
          <DisplayItem transferItemId={this.transferItemId.bind(this, this.state.displayItems[i].id)}
            key={this.state.displayItems[i].id}
            statusToShow={showShippingStatus(this.state.displayItems[i].status)}
            statusColor={getStatusColor(this.state.displayItems[i].status)}
            info={this.state.displayItems[i]} />)
      }
      this.setState({
        returnEle: returnEle
      })
    }
  }


  render() {
    if (this.state.displayItems && this.state.allCategoryName && this.state.currentItemId.length <= 0) {
      return (
        <div>
          <div className={styles['search-bar']}>
            <div className={styles['search-detail']}>
              <span className={styles['item-title']}>卖家号码</span>
              <div className={styles['search-item-ctn']}>
                <Input size="default" onChange={this.getSellerPhoneNumber}></Input>
              </div>
              <span className={styles['item-title']}>拍品名称</span>
              <div className={styles['search-item-ctn']}>
                <Input size="default" onChange={this.getItemTitle}></Input>
              </div>
              <div>
                <span className={styles['item-title']}>类别</span>
                <div className={styles['search-category-ctn']}>
                  <Select size="default" defaultActiveFirstOption={true} onChange={this.getCategoryName} defaultValue="所有分类">
                    {
                      this.state.allCategoryName.map(i => {
                        return (
                          <Option key={i} value={i}>{i}</Option>
                        )
                      })
                    }
                    <Option value="">所有分类</Option>

                  </Select>
                </div>
              </div>
              {/* <span className={styles['item-title']}>提报时间</span>
              <div className={styles['search-item-ctn']}>
                <DatePicker className={styles['search-date']} defaultValue={moment('2018-11-01', 'YYYY-MM-DD')} showToday={true} onChange={this.test} />
              </div> */}
              <ApolloConsumer>
                {client => (
                  <div>
                    <Button type="primary" onClick={async () => {
                      let obj = {}
                      if (this.state.searchItemTitle) obj.title = this.state.searchItemTitle
                      if (this.state.searchCategoryName) obj.category = { title: this.state.searchCategoryName }
                      if (this.state.searchPhoneNumber) obj.seller = { phoneNumber: this.state.searchPhoneNumber }
                      ////console.log(obj)
                      console.log(foo(obj, true, true))
                      const { data } = await client.query({
                        query: gql(
                          foo(obj, true, true)
                        )
                      })
                      // console.log(data.auctionItems)
                      this.getSearchResult(data.auctionItems)
                    }
                    } > <Icon type="search"></Icon>搜索</Button>

                  </div>
                )}

              </ApolloConsumer>
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
                    query: getWaitingFirstCheckItemData,
                  })
                  console.log(data.auctionItems)
                  this.getAllItems(data.auctionItems)
                  this.clearItemId()
                  let page = this.state.currentPage
                  let pageSize = pageDataItemsNum
                  let returnEle = []
                  for (let i = 0, len = (this.state.displayItems.length < page * pageSize) ? this.state.displayItems.length % pageSize : pageSize; i < len; i++) {
                    console.log(len)
                    returnEle.push(
                      <DisplayItem transferItemId={this.transferItemId.bind(this, this.state.displayItems[i + (page - 1) * pageSize].id)}
                        key={this.state.displayItems[i + (page - 1) * pageSize].id}
                        statusToShow={showShippingStatus(this.state.displayItems[i + (page - 1) * pageSize].status)}
                        statusColor={getStatusColor(this.state.displayItems[i + (page - 1) * pageSize].status)}

                        info={this.state.displayItems[i + (page - 1) * pageSize]}
                      />)
                  }
                  console.log(returnEle)
                  this.setState({
                    returnEle: returnEle,

                    searchItemTitle: "",
                    searchPhoneNumber: "",
                    searchCategoryName: "",
                    searchReportTime: "",

                  })
                }}>拍品实物审核</span>->拍品详情</p>
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


                const categoryNameData = await client.query({
                  query: gql`
                  query {
                    auctionItems (
                      where: {
                        status_in: [PlatformShipping, Ended]
                        extraStatus_in: [PlatformShippingBack]  # 发货给卖家
                      }
                    ){
                      category {
                        title
                      }
                    }
                  }
                  `
                })
                this.setState({
                  allCategoryName: getUniqueCategoryName(categoryNameData.data.auctionItems)
                })
              }}>点击获取内容</button>

            </div>
          )}

        </ApolloConsumer>
      )
    }
  }
}

export default PlatformShipping
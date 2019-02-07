import React from 'react'
import { DatePicker, Input, Select, Button, Icon, Pagination } from 'antd'
import gql from 'graphql-tag'
import { getStatusColorOfStarLot, showChineseStatusOfStarLotAccordingString } from '../../utils/commonChange'
import styles from '../../style/AllLotShow.sass'
import { ApolloConsumer } from 'react-apollo'
import 'babel-polyfill';

import moment from 'moment';
import 'moment/locale/zh-cn';
moment.locale('zh-cn');


import DetailedItem from './DetailedItem'
import DisplayItem from './DisplayItem'
const pageDataItemsNum = 15


const getAllStarLot = gql`
  query idolWishingWells {
    idolWishingWells {
      name
      images
      status
      lastStatusChangeTime
      id
      highestBid
      highestBidUser {
        name
        phoneNumber
      }
    }
  }
`

function foo(obj) {
  let a = `where: ${JSON.stringify(obj).replace(/"(\w+?)":/g, "$1:")}`;
  return `
    query {
      idolWishingWells(
        ${a}
      ) {
        name
        images
        status
        lastStatusChangeTime
        id
        highestBid
        highestBidUser {
          name
          phoneNumber
        }
      }
    }
  `
}

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
      idolName: null,
      phoneNumber: null,
    }
    this.changePageClick = this.changePageClick.bind(this)
    this.transferItemId = this.transferItemId.bind(this)
    this.clearItemId = this.clearItemId.bind(this)
    this.getAllItems = this.getAllItems.bind(this)
    this.getSearchResult = this.getSearchResult.bind(this)
    this.getIdolNameBySearch = this.getIdolNameBySearch.bind(this)
    this.getPhoneNumberBySearch = this.getPhoneNumberBySearch.bind(this)
  }

  async clearItemId() {
    this.setState({
      currentItemId: ""
    })

  }

  getIdolNameBySearch(e) {
    this.setState({
      idolName: e.target.value
    })
  }

  getPhoneNumberBySearch(e) {
    this.setState({
      phoneNumber: e.target.value
    })
  }

  transferItemId(itemId) {

    ////console.log('transferItemId' + itemId)
    // 通过 itemID 获取该产品的信息
    // 目前应当是需要
    this.setState({
      currentItemId: itemId,
    })
  }
  changePageClick(page, pageSize) {
    ////console.log(page, pageSize)
    const returnEle = []

    for (let i = 0, len = (this.state.displayItems.length < page * pageSize) ? this.state.displayItems.length % pageSize : pageSize; i < len; i++) {
      ////console.log(len)
      returnEle.push(
        <DisplayItem transferItemId={this.transferItemId.bind(this, this.state.displayItems[i + (page - 1) * pageSize].id)}
          key={this.state.displayItems[i + (page - 1) * pageSize].id}
          statusToShow={showChineseStatusOfStarLotAccordingString(this.state.DisplayItems[i].status)}
          statusColor={getStatusColorOfStarLot(this.state.displayItems[i + (page - 1) * pageSize].status)}
          info={this.state.displayItems[i + (page - 1) * pageSize]}
        />)
    }
    ////console.log(returnEle)
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
      ////console.log("ddd")
      this.setState({
        returnEle: "没有许愿池物品"
      })
    } else {
      ////console.log(this.state.displayItems[0])
      for (let i = 0, len = firstRenderNum; i < len; i++) {
        ////console.log('color' + getStatusColorOfStarLot(this.state.displayItems[i].status))
        ////console.log('status' + this.state.displayItems[i].status)
        returnEle.push(
          <DisplayItem transferItemId={this.transferItemId.bind(this, this.state.displayItems[i].id)}
            key={this.state.displayItems[i].id}
            statusToShow={showChineseStatusOfStarLotAccordingString(this.state.displayItems[i].status)}
            statusColor={getStatusColorOfStarLot(this.state.displayItems[i].status)}
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
      ////console.log("ddd")
      this.setState({
        returnEle: "没有符合的许愿池物品"
      })
    } else {
      ////console.log(this.state.displayItems[0])
      for (let i = 0, len = firstRenderNum; i < len; i++) {
        ////console.log('color' + getStatusColorOfStarLot(this.state.displayItems[i].status))
        ////console.log('status' + this.state.displayItems[i].status)
        returnEle.push(
          <DisplayItem transferItemId={this.transferItemId.bind(this, this.state.displayItems[i].id)}
            key={this.state.displayItems[i].id}
            statusToShow={showChineseStatusOfStarLotAccordingString(this.state.displayItems[i].status)}
            statusColor={getStatusColorOfStarLot(this.state.displayItems[i].status)}
            info={this.state.displayItems[i]} />)
      }
      this.setState({
        returnEle: returnEle
      })
    }
  }



  render() {
    if (this.state.displayItems && this.state.currentItemId.length <= 0) {
      return (
        <div>
          <div className={styles['search-bar']}>
            <div className={styles['search-detail']}>
              <span className={styles['item-title']}>明星姓名</span>
              <div className={styles['search-item-ctn']}>
                <Input size="default" onChange={this.getIdolNameBySearch}></Input>
              </div>
              <span className={styles['item-title']}>买家手机号码</span>
              <div className={styles['search-item-ctn']}>
                <Input size="default" onChange={this.getPhoneNumberBySearch}></Input>
              </div>
              {/* <Button onClick={this.}> */}
              <ApolloConsumer>
                {client => (
                  <div>
                    <button onClick={async () => {
                      let obj = {}
                      if (this.state.idolName) obj.name = this.state.idolName
                      if (this.state.phoneNumber) obj.highestBidUser = {
                        phoneNumber: this.state.phoneNumber
                      }
                      const { data } = await client.query({
                        query: gql(
                          foo(obj)
                        )
                      })
                      this.getSearchResult(data.idolWishingWells)
                    }
                    } > <Icon type="search"></Icon>搜索</button>

                  </div>
                )}

              </ApolloConsumer>
              {/* 搜索</Button> */}
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
                  ////console.log(data.idolWishingWells)
                  this.getAllItems(data.idolWishingWells)
                  this.clearItemId()
                  let page = this.state.currentPage
                  let pageSize = pageDataItemsNum
                  let returnEle = []
                  for (let i = 0, len = (this.state.displayItems.length < page * pageSize) ? this.state.displayItems.length % pageSize : pageSize; i < len; i++) {
                    ////console.log(len)
                    returnEle.push(
                      <DisplayItem transferItemId={this.transferItemId.bind(this, this.state.displayItems[i + (page - 1) * pageSize].id)}
                        key={this.state.displayItems[i + (page - 1) * pageSize].id}
                        statusToShow={showChineseStatusOfStarLotAccordingString(this.state.displayItems[i + (page - 1) * pageSize].status)}
                        statusColor={getStatusColorOfStarLot(this.state.displayItems[i + (page - 1) * pageSize].status)}

                        info={this.state.displayItems[i + (page - 1) * pageSize]}
                      />)
                  }
                  ////console.log(returnEle)
                  this.setState({
                    returnEle: returnEle,
                    phoneNumber: null,
                    idolName: ""
                  })
                }}>许愿池</span>->详情</p>
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
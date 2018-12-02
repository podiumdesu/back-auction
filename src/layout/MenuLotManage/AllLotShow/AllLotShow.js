import React from 'react'


import styles from '../../../style/AllLotShow.sass'
// import '../../../style/AllLotShow.sass'

const pageDataItemsNum = 15
const testData = [
  {
    time: "2018.10.11",
    title: "包邮大闸蟹",
    category: "食品",
    owner: "红红",
    itemId: "1",
  },
  {
    time: "2018.10.12",
    title: "包邮大闸蟹",
    category: "食品",
    owner: "红红",
    itemId: "2"
  },
  {
    time: "2018.10.13",
    title: "包邮大闸蟹",
    category: "食品",
    owner: "红红",
    itemId: "3"
  },
  {
    time: "2018.10.14",
    title: "包邮大闸蟹",
    category: "食品",
    owner: "红红",
    itemId: "4"

  },
  {
    time: "2018.10.15",
    title: "包邮大闸蟹",
    category: "食品",
    owner: "红红",
    itemId: "5"

  },
  {
    time: "2018.10.16",
    title: "包邮大闸蟹",
    category: "食品",
    owner: "红红",
    itemId: "6"

  },
  {
    time: "2018.10.17",
    title: "包邮大闸蟹",
    category: "食品",
    owner: "红红",
    itemId: "2"

  },
  {
    time: "2018.10.18",
    title: "包邮大闸蟹",
    category: "食品",
    owner: "红红",
    itemId: "2"

  },
  {
    time: "2018.10.19",
    title: "包邮大闸蟹",
    category: "食品",
    owner: "红红",
    itemId: "2"
  },
  {
    time: "2018.10.20",
    title: "包邮大闸蟹",
    category: "食品",
    owner: "红红",
    itemId: "2"

  },
  {
    time: "2018.10.21",
    title: "包邮大闸蟹",
    category: "食品",
    owner: "红红",
    itemId: "2"

  },
  {
    time: "2018.10.22",
    title: "包邮大闸蟹",
    category: "食品",
    owner: "红红",
    itemId: "2"

  },
  {
    time: "2018.20.11",
    title: "包邮大闸蟹",
    category: "食品",
    owner: "红红",
    itemId: "2"

  },
  {
    time: "2018.20.12",
    title: "包邮大闸蟹",
    category: "食品",
    owner: "红红",
    itemId: "2"

  },
  {
    time: "2018.20.13",
    title: "包邮大闸蟹",
    category: "食品",
    owner: "红红",
    itemId: "2"

  },
  {
    time: "2018.20.14",
    title: "包邮大闸蟹",
    category: "食品",
    owner: "红红",
    itemId: "2"

  },
  {
    time: "2018.20.15",
    title: "包邮大闸蟹",
    category: "食品",
    owner: "红红",
    itemId: "2"

  },
  {
    time: "2018.20.16",
    title: "包邮大闸蟹",
    category: "食品",
    owner: "红红",
    itemId: "2"

  },
  {
    time: "2018.20.17",
    title: "包邮大闸蟹",
    category: "食品",
    owner: "红红",
    itemId: "2"

  },
  {
    time: "2018.20.18",
    title: "包邮大闸蟹",
    category: "食品",
    owner: "红红",
    itemId: "2"

  },
  {
    time: "2018.20.19",
    title: "包邮大闸蟹",
    category: "食品",
    owner: "红红",
    itemId: "2"

  },
  {
    time: "2018.20.20",
    title: "包邮大闸蟹",
    category: "食品",
    owner: "红红",
    itemId: "2"

  },
  {
    time: "2018.20.21",
    title: "包邮大闸蟹",
    category: "食品",
    owner: "红红",
    itemId: "2"

  },
  {
    time: "2018.20.22",
    title: "包邮大闸蟹",
    category: "食品",
    owner: "红红",
    itemId: "2"

  },
]


import moment from 'moment';
import 'moment/locale/zh-cn';
moment.locale('zh-cn');

import DisplayItem from './DisplayItem'
import DetailedItem from './DetailedItem'

import { DatePicker, Input, Select, Button, Icon, Pagination } from 'antd'
import { graphql } from 'react-apollo'
import { Mutation } from 'react-apollo'
import gql from 'graphql-tag'

const data = gql`
  query {
    ReturnAllThings {
      _id
      title
      description
    }
  }
`

// const oneItemData = gql`
//   query QUERY_ONE_ITEM($itemId: ObjectId!) {
//     ReturnOneItem(_id: $itemId) {
//       _id
//       title
//       description
//     }
//   }
// `
// const changeStatusMutation = gql`
//   mutation {
//     changeAuctionStatus(newStatus: 9, itemId: "5c02cd1f5b120f1a382e6336") 
//   }
// `

const QueryItemsWithStatus = gql`
query {
  ReturnItemsWithStatus(status: 2) {
    _id
    title
  }
}

`



class AllLotShow extends React.Component {
  constructor(props) {
    super(props)
    this.test = this.test.bind(this)
    this.changePageClick = this.changePageClick.bind(this)
    this.transferItemId = this.transferItemId.bind(this)
    this.clearItemId = this.clearItemId.bind(this)
    this.state = {
      // this.props.data.ReturnAllThings.length / pageDataItemsNum: this.props.data.ReturnAllThings.length / pageDataItemsNum,
      returnEle: [],
      progressTips: "->拍品详情",
      currentItemId: "",
      currentItemInfo: null
    }
  }

  test(a, b) {
    // function(date: moment, dateString: string)
    // console.log(a)
    // console.log(b)
    console.log('hello')
  }
  clearItemId() {
    this.setState({
      currentItemId: ""
    })
  }
  componentWillMount() {
    if (this.props.data.loading) {
      return <p>Loading ...</p>;
    }
    if (this.props.data.error) {
      return <p>{error.message}</p>;
    }
    const returnEle = []
    const firstRenderNum = (this.props.data.ReturnAllThings.length < pageDataItemsNum) ? this.props.data.ReturnAllThings.length : pageDataItemsNum

    for (let i = 0, len = firstRenderNumw; i < len; i++) {
      returnEle.push(
        <DisplayItem transferItemId={this.transferItemId.bind(this, this.props.data.ReturnAllThings[i]._id)}
          key={this.props.data.ReturnAllThings[i]._id}
          info={this.props.data.ReturnAllThings[i]} />)
      // itemId={this.props.data.ReturnAllThings[i]._id} />)
    }
    this.setState({
      returnEle: returnEle
    })
  }
  transferItemId(itemId) {

    console.log(itemId)
    // 通过 itemID 获取该产品的信息
    // 目前应当是需要
    const info = {
      ownerInfo: {
        phoneNumber: 13524452340,
        nickName: 'wwh',
      },
      itemInfo: {
        photos: [],
        title: '包邮大闸蟹嘤嘤嘤我真的真的好想吃啊',
        description: '就是红红超级想吃的包邮大闸蟹！',
        createTime: '2018-10-11',
        expireTime: '2018-11-11',
        noBarginPrice: 134,
        startingPrice: 13,
        newDegree: '9',
        certPhotos: [],
        status: '',
      }
    }
    this.setState({
      currentItemId: itemId,
      currentItemInfo: info
    })
  }
  changePageClick(page, pageSize) {
    if (this.props.data.loading) {
      return <p>Loading ...</p>;
    }
    if (this.props.data.error) {
      return <p>{error.message}</p>;
    }

    console.log(page, pageSize)
    const returnEle = []
    // if ((this.props.data.ReturnAllThings.length < page * pageSize)) {
    //   console.log(true)
    // }
    // let len = (this.props.data.ReturnAllThings.length < page * pageSize) ? this.props.data.ReturnAllThings.length % pageSize : pageSize
    // console.log(len)
    for (let i = 0, len = (this.props.data.ReturnAllThings.length < page * pageSize) ? this.props.data.ReturnAllThings.length % pageSize : pageSize; i < len; i++) {
      console.log(len)

      returnEle.push(
        <DisplayItem transferItemId={this.transferItemId.bind(this, this.props.data.ReturnAllThings[i + (page - 1) * pageSize]._id)}
          key={this.props.data.ReturnAllThings[i + (page - 1) * pageSize]._id}
          // itemId={this.props.data.ReturnAllThings[i + (page - 1) * pageSize]._id}

          info={this.props.data.ReturnAllThings[i + (page - 1) * pageSize]}
        // info={this.props.data.ReturnAllThings[i + (page - 1) * pageSize]}

        />)
    }
    console.log(returnEle)
    this.setState({
      returnEle: returnEle
    })
  }
  render() {
    if (this.props.data.loading) {
      return <p>Loading ...</p>;
    }
    if (this.props.data.error) {
      return <p>{error.message}</p>;
    }
    return (
      <div>
        {this.state.currentItemId.length > 0 ?
          (
            <div>
              <p><span style={{ textDecoration: 'underline' }} onClick={this.clearItemId}>拍品提报审核</span>->拍品详情</p>
              <div className={styles["result-ctn"]}>

                <div className={styles["result-ctn-flex"]}>
                  <DetailedItem _id={this.state.currentItemId} />
                </div>
              </div>
            </div>

          ) : (
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
                  <Button><Icon type="search"></Icon>搜索</Button>
                </div>
              </div>
              <div className={styles["result-ctn"]}>
                <div className={styles["result-ctn-flex"]}>
                  {this.state.returnEle}
                </div>
              </div>
              <Pagination total={50} onChange={this.changePageClick} hideOnSinglePage={true} total={this.props.data.ReturnAllThings.length} pageSize={pageDataItemsNum} defaultCurrent={this.props.data.ReturnAllThings.length / pageDataItemsNum} current={this.props.data.ReturnAllThings.length / pageDataItemsNum} />
            </div>
          )
        }
      </div >

    )
  }
}

export default graphql(data)(AllLotShow)
import React from 'react'

import { graphql, Query } from 'react-apollo'
import gql from 'graphql-tag'
import { showCategoryAccordingNum } from '../../../utils/commonChange'
import date from 'date-and-time'
import styles from '../../../style/AllLotShow.sass'
const allItemData = gql`
query {
  ReturnAllThings {
    _id
    status
    categoryId
    title
    description
    owner {
      _id
      phoneNumber
    }
    lastStatusChangeTime
  }
}
`
class tradeResult extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      allItems: [],
    }
  }

  render() {
    const that = this

    return (
      <Query query={allItemData} >
        {({ loading, error, data }) => {
          if (loading) return <div>loading</div>
          if (error) return <div>`Error!: ${error}`</div>
          console.log(data.ReturnAllThings)
          // that.setState({
          //   allItems: data.ReturnAllThings[0]
          // })
          console.log(that.state.allItems.length)
          const returnEle = []
          for (let i = 0; i < data.ReturnAllThings.length; i++) {
            returnEle.push(
              <div key={data.ReturnAllThings[i]._id} className={styles["item-detail-ctn"]} >
                <div className={styles["item-image-ctn"]} style={{
                  height: "90px",
                  width: "210px",
                  background: "url('http://pipclm21l.bkt.clouddn.com/image/countryBigPic/china.png')",
                  backgroundRepeat: "no-repeat",
                  backgroundSize: "200px 100px",
                  backgroundPosition: "center",
                }}>
                  <p className={styles["item-issue-time"]}>{date.format(new Date(data.ReturnAllThings[i].lastStatusChangeTime), 'YYYY年MM月DD日 HH:mm')}</p>
                </div>
                <div className={styles["item-text-info-ctn"]}>
                  <p className={styles["item-detail-line"]}><span className={styles["item-detail-title"]}>名称</span>{data.ReturnAllThings[i].title}</p>
                  <p className={styles["item-detail-line"]}><span className={styles["item-detail-title"]}>分类</span>{showCategoryAccordingNum(data.ReturnAllThings[i].categoryId)}</p>
                  <p className={styles["item-detail-line"]}><span className={styles["item-detail-title"]}>卖家</span>{data.ReturnAllThings[i].owner.phoneNumber}</p>
                </div>
                {/* <p>_id: {data.ReturnAllThings[i]._id}</p>
                <p>名称：{data.ReturnAllThings[i].title}</p>
                <p>提报时间：{data.ReturnAllThings[i].lastStatusChangeTime}</p>
                <p>状态（应该是1）：{data.ReturnAllThings[i].status}</p> */}
                {/* <p>分类：{data.ReturnAllThings.categoryId}</p> */}

                {/* <p>分类：{showCategoryAccordingNum(parseInt(data.ReturnAllThings.categoryId))}</p> */}
              </div >
            )
          }
          return (
            <div className={styles["result-ctn"]}>
              <div className={styles["result-ctn-flex"]}>
                {returnEle}

              </div>
            </div>
          )
        }}
      </Query>
    )

  }
}

export default tradeResult
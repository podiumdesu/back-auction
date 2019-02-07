import React from 'react'
import { showCategoryAccordingNum, showChineseStatusAccordingString, getUniqueCategoryName } from '../../../utils/commonChange'
import gql from 'graphql-tag'
import { Query } from 'react-apollo'
import styles from '../../../style/tradeNum.sass'
const GetAllItems = gql`
  query {
    auctionItems {
      id
      title
      description
      status
      seller {
        id
        phoneNumber
      }
      category {
        title
      }
      createTime
      lastStatusChangeTime
    }
  }
`

const tradeNum = () => (
  <Query query={GetAllItems}>
    {({ loading, error, data }) => {
      if (loading) return null;
      if (error) return `Error!: ${error}`;
      const statusReturnEle = []
      const categoryReturnEle = []
      let statusString = [
        "PayingDeposit",
        "InFirstCheck",
        "InAuction",
        "BuyerPaying",
        "SellerShipping",
        "TransportingToPlatform",
        "InSecondCheck",
        "PlatformShipping",
        "TransportingToBuyer",
        "Ended"
      ]
      let itemsWithStatus = {
        "PayingDeposit": 0,
        "InFirstCheck": 0,
        "InAuction": 0,
        "BuyerPaying": 0,
        "SellerShipping": 0,
        "TransportingToPlatform": 0,
        "InSecondCheck": 0,
        "PlatformShipping": 0,
        "TransportingToBuyer": 0,
        "Ended": 0
      }
      const categoryName = getUniqueCategoryName(data.auctionItems)
      const categoryNameObj = {}
      for (let i = 0, len = data.auctionItems.length; i < len; i++) {
        itemsWithStatus[data.auctionItems[i].status]++;
        if (categoryNameObj[data.auctionItems[i].category.title]) {
          categoryNameObj[data.auctionItems[i].category.title]++
        } else {
          categoryNameObj[data.auctionItems[i].category.title] = 1
        }
      }

      for (let i = 0; i < 10; i++) {
        statusReturnEle.push(
          <div key={i}><p className={styles['info-of-line']}>{showChineseStatusAccordingString(statusString[i])}的拍品</p> ：{itemsWithStatus[statusString[i]]} 件</div>
        )
      }
      for (let i = 0; i < categoryName.length; i++) {
        categoryReturnEle.push(
          <div key={i}><p className={styles['info-of-line']}>{categoryName[i]}</p>： {categoryNameObj[categoryName[i]]}件</div>
        )
      }
      return (
        <div>
          <div className={styles['page-container']}>
            <div className={styles['container']}>
              <h3 className={styles['title']}>展示状态统计</h3>
              {statusReturnEle}
            </div>
            <div className={styles['container']}>
              <h3 className={styles['title']}> 拍品分类统计</h3>
              {categoryReturnEle}
            </div>

          </div>
        </div>
      );
    }}
  </Query>
);


export default tradeNum
import React from 'react'
import { showCategoryAccordingNum, showChineseStatusAccordingString } from '../../../utils/commonChange'
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
      createTime
      lastStatusChangeTime
    }
  }
  # query {
  #   auctionItems {
  #     id
  #     status
  #     title
  #     categoryId
  #     description
  #     seller {
  #       id
  #     }
  #   }
  # }
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
      // const categoryIdArr = [
      //   0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      //   0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      // ]
      for (let i = 0, len = data.auctionItems.length; i < len; i++) {
        itemsWithStatus[data.auctionItems[i].status]++;
        // categoryIdArr[parseInt(data.auctionItems[i].categoryId)]++;
      }

      for (let i = 0; i < 10; i++) {
        statusReturnEle.push(
          <div key={i}><p className={styles['info-of-line']}>{showChineseStatusAccordingString(statusString[i])}的拍品</p> ：{itemsWithStatus[statusString[i]]} 件</div>
        )
      }
      // for (let i = 0; i < 3; i++) {
      //   categoryReturnEle.push(
      //     <div key={i}>{showCategoryAccordingNum(i + 1)}： {categoryIdArr[i]}件</div>
      //   )
      // }
      return (
        <div>
          <div className={styles['page-container']}>
            <div className={styles['container']}>
              <h3 className={styles['title']}>展示状态统计</h3>
              {statusReturnEle}
            </div>
            <div className={styles['container']}>
              <h3 className={styles['title']}> 拍品分类统计</h3>
              {/* {categoryReturnEle} */}
            </div>

          </div>
        </div>
      );
    }}
  </Query>
);


// export default tradeNum
// class tradeNum extends React.Component {
//   render() {
//     return (
//       <div>展示拍品数量
//         <p>包括提报中的拍品</p>
//         <p>已上线的拍品</p>
//         <p>审核中的拍品</p>
//         <p>待收货的拍品</p>
//         <p>交易成功拍品</p>
//         <p>交易失败拍品</p>
//         <h2>拍品分类统计</h2>
//         <p>字画</p>
//         <p>珠宝</p>
//         <p>箱包</p>
//         <p>古玩</p>
//       </div>
//     )
//   }
// }

export default tradeNum
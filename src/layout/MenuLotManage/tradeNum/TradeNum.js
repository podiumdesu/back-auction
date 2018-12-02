import React from 'react'

class tradeNum extends React.Component {
  render() {
    return (
      <div>展示拍品数量
        <p>包括提报中的拍品</p>
        <p>已上线的拍品</p>
        <p>审核中的拍品</p>
        <p>待收货的拍品</p>
        <p>交易成功拍品</p>
        <p>交易失败拍品</p>
        <h2>拍品分类统计</h2>
        <p>字画</p>
        <p>珠宝</p>
        <p>箱包</p>
        <p>古玩</p>
      </div>
    )
  }
}

export default tradeNum
function showCategoryAccordingNum(categoryNum) {
  const changeSet = new Map([
    [1, '珠宝'],
    [2, '字画'],
    [3, '虚拟物品']
  ])
  // console.log(categoryNum)
  // console.log('hello')
  // console.log(typeof (categoryNum))
  return changeSet.get(parseInt(categoryNum))
}


function showChineseStatusAccordingString(status) {
  const changeSet = {

    "PayingDeposit": '待支付保证金',
    "InFirstCheck": '等待提报审核',
    "InAuction": '当前在拍卖中',
    "BuyerPaying": '等待买家支付',
    "SellerShipping": '等待卖家发货',
    "TransportingToPlatform": '卖家已发货，运输中',
    "InSecondCheck": '平台实物审核',
    "PlatformShipping": '等待平台发货',
    "TransportingToBuyer": '平台已发货，运输中', // 确认收货/超过七天自动收货
    "Ended": '交易结束'
  }
  return changeSet[status]

}

function getStatusColor(status) {
  const changeSet = {

    "PayingDeposit": 'rgba(0,0,0,0.75)',
    "InFirstCheck": 'rgba(0,0,0,0.75)',
    "InAuction": 'rgba(0,0,0,0.75)',
    "BuyerPaying": 'rgba(0,0,0,0.75)',
    "SellerShipping": 'rgba(0,0,0,0.75)',
    "TransportingToPlatform": 'rgba(0,0,0,0.75)',
    "InSecondCheck": 'rgba(0,0,0,0.75)',
    "PlatformShipping": 'rgba(0,0,0,0.75)',
    "TransportingToBuyer": 'rgba(0,0,0,0.75)', // 确认收货/超过七天自动收货
    "Ended": 'rgba(0,0,0,0.3)'
  }
  return changeSet[status] ? changeSet[status] : 'rgba(0,0,0)'

}
export {
  showCategoryAccordingNum,
  showChineseStatusAccordingString,
  getStatusColor
}
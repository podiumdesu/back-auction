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


export {
  showCategoryAccordingNum,
}
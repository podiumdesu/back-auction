import React from 'react'

import styles from '../../../style/AllLotShow.sass'
import { showCategoryAccordingNum } from '../../../utils/commonChange'
import date from 'date-and-time'

class DisplayItem extends React.Component {
  constructor(props) {
    super(props)
  }
  render() {

    return (
      <div className={styles["item-detail-ctn"]} onClick={this.props.transferItemId} >
        {/* <p>{this.props.info.time}</p> */}
        {/* <p>_id: {this.props.info._id}</p> */}
        <div className={styles["item-image-ctn"]} style={{
          height: "90px",
          width: "210px",
          background: "url('http://pipclm21l.bkt.clouddn.com/image/countryBigPic/china.png')",
          backgroundRepeat: "no-repeat",
          backgroundSize: "200px 100px",
          backgroundPosition: "center",
        }}>
          <p className={styles["item-issue-time"]}>{date.format(new Date(this.props.info.lastStatusChangeTime), 'YYYY年MM月DD日 HH:mm')}</p>
        </div>
        <div className={styles["item-text-info-ctn"]}>
          <p className={styles["item-detail-line"]}><span className={styles["item-detail-title"]}>名称</span>{this.props.info.title}</p>
          <p className={styles["item-detail-line"]}><span className={styles["item-detail-title"]}>分类</span>{showCategoryAccordingNum(this.props.info.categoryId)}</p>
          <p className={styles["item-detail-line"]}><span className={styles["item-detail-title"]}>卖家</span>{this.props.info.owner.phoneNumber}</p>
        </div>

        {/* <p>description: {this.props.info.description}</p> */}
        {/* <p>{this.props.info.owner}</p> */}
      </div >
    )
  }
}

export default DisplayItem
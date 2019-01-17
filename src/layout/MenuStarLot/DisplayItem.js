import React from 'react'

import styles from '../../style/AllLotShow.sass'
import date from 'date-and-time'

class DisplayItem extends React.Component {
  constructor(props) {
    super(props)
  }
  render() {
    const photoToShow = this.props.info.images[0].length > 0 ? this.props.info.images[0] : 'http://pipclm21l.bkt.clouddn.com/image/countryBigPic/china.png'
    return (
      <div className={styles["item-detail-ctn"]} onClick={this.props.transferItemId} >
        {/* <p>{this.props.info.time}</p> */}
        {/* <p>id: {this.props.info.id}</p> */}
        <div className={styles["item-image-ctn"]} style={{
          height: "90px",
          width: "210px",
          background: `url(${photoToShow})`,
          backgroundRepeat: "no-repeat",
          backgroundSize: "200px 100px",
          backgroundPosition: "center",
        }}>
          <p style={{
            backgroundColor: `${this.props.statusColor}`,
            color: "white",
            lineHeight: "16px",
            fontSize: "10px",
            margin: "0",
            position: "absolute",
            bottom: "0",
            width: "100%",
            textAlign: "center"
          }}>{this.props.statusToShow}</p>

          {/* <p className={styles["item-issue-time"]}>{date.format(new Date(this.props.info.lastStatusChangeTime), 'YYYY年MM月DD日 HH:mm')}</p> */}
        </div>
        <div className={styles["item-text-info-ctn"]}>
          {/* <p className={styles["item-detail-line"]}><span className={styles["item-detail-title"]}>名称</span>{this.props.info.title}</p> */}
          <p className={styles["item-detail-line"]}><span className={styles["item-detail-title"]}>明星</span>{this.props.info.name}</p>
          <p className={styles["item-detail-line"]}><span className={styles["item-detail-title"]}>买家</span>{this.props.info.highestBidUser ? this.props.info.highestBidUser.name : "无"}</p>
        </div>

        {/* <p>description: {this.props.info.description}</p> */}
        {/* <p>{this.props.info.owner}</p> */}
      </div >
    )
  }
}

export default DisplayItem
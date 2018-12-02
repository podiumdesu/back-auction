import React from 'react'

import styles from '../../../style/AllLotShow.sass'

class DisplayItem extends React.Component {
  constructor(props) {
    super(props)
  }
  render() {

    return (
      <div className={styles["item-detail-ctn"]} onClick={this.props.transferItemId} >
        {/* <p>{this.props.info.time}</p> */}
        <p>_id: {this.props.info._id}</p>
        <p>title: {this.props.info.title}</p>
        <p>description: {this.props.info.description}</p>
        {/* <p>{this.props.info.owner}</p> */}
      </div >
    )
  }
}

export default DisplayItem
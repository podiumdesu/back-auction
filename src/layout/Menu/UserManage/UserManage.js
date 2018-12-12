import React from 'react'
import styles from '../../../style/UserManage.sass'
import { graphql, Query, Mutation } from 'react-apollo'
import gql from 'graphql-tag'
import { Button, Switch, Popconfirm, Modal, message } from 'antd'
const GetUsersData = gql`
  query {
    users {
      id
      name
      phoneNumber
      type
      items {
        id
      }
      bidItems {
        id
      }
      eula
      gender
      points
      isBanned
    }
  }
`
// const changeStatusMutation = gql`
//   mutation CHANGE($id: ID!){
//     updateManyAuctionItems(
//       where: {
//         id: $id,
//         status: InFirstCheck
//       },
//       data: {
//         status: InAuction
//       }
//     ) {
//       count
//     }
//   }
// `

const banUsers = gql`
  mutation CHANGE($id: ID!, $isBanned: Boolean!) {
    updateUser(
      where: {
        id: $id,
      },
      data: {
        isBanned: $isBanned
      }
    ){
      id
      isBanned
    }
  }
`

class ShowUserInfo extends React.Component {
  constructor(props) {
    super(props)
    this.handleOperation = this.handleOperation.bind(this)
    this.handleOk = this.handleOk.bind(this)
    this.handleCancel = this.handleCancel.bind(this)
    this.state = {
      switchWaiting: false,
      userSelect: false,
      showInfo: "",
      isBanned: null
    }
  }
  componentWillMount() {
    console.log(this.state.isBanned)
    this.setState({
      isBanned: this.props.info.isBanned
    })
    console.log(this.state.isBanned)
  }
  handleOperation(isBanned) {
    if (isBanned) {   // 用户已经被封禁
      this.setState({
        showInfo: "确定要解封该用户吗？",
        visible: true,

      })
    } else {
      this.setState({
        showInfo: "确定要封禁该用户吗？",
        visible: true,
      })
    }
  }

  // 提示用户
  handleOk(e) {
    console.log(e);
    console.log(this.state.isBanned)

    this.setState(prevState => ({
      visible: false,
      isBanned: !prevState.isBanned
    }));
    console.log(this.state.isBanned)
  }

  handleCancel(e) {
    console.log(e);
    console.log(this.state.isBanned)

    this.setState(prevState => ({
      visible: false,
      isBanned: prevState.isBanned
    }));
    console.log(this.state.isBanned)
  }


  render() {
    console.log('render' + this.state.isBanned)
    return (
      <div className={styles['user-info-ctn']}>
        <Mutation mutation={banUsers}>
          {(updateUser) => (
            <Modal
              title="确认操作"
              visible={this.state.visible}
              onOk={
                async e => {
                  console.log("确认")
                  e.preventDefault()
                  const changeStatus = !(this.props.info.isBanned)
                  const { data } = await updateUser({
                    variables: {
                      id: this.props.info.id,
                      isBanned: changeStatus,
                    }
                  })
                  console.log(data.updateUser)
                  if (data.updateUser.isBanned == !(this.state.isBanned)) {
                    message.success("操作成功")

                  } else {
                    message.error("操作失败")
                  }
                  this.setState({
                    visible: false,
                    isBanned: data.updateUser.isBanned
                  })
                }
              }
              onCancel={this.handleCancel}
            >
              {this.state.showInfo}
            </Modal>
          )}
        </Mutation>

        <p className={styles['user-info-name']}>{this.props.info.name}</p>
        <p className={styles['user-info-phone']} >{this.props.info.phoneNumber}</p>
        <p className={styles['user-info-check']}>{this.props.info.eula ? '是' : '否'}</p>
        {/* <p className={styles['user-info-real-name']}>真实姓名</p> */}
        {/* <p className={styles['user-info-idCard']}>身份证号</p> */}
        <p className={styles['user-info-buyNum']}>{this.props.info.bidItems.length}</p>
        <p className={styles['user-info-sellNum']}>{this.props.info.items.length}</p>
        <p className={styles['user-info-point']}>{this.props.info.points}</p>
        {/* <Button className={styles['user-info-operation']} onClick={() => { console.log(this.props..id) }}></Button> */}
        {/* <Popconfirm placement="topLeft" title={"gg"} onConfirm={confirm} okText="Yes" cancelText="No"> */}
        <Switch className={styles['user-info-operation']} checkedChildren="封号" checked={!this.state.isBanned} unCheckedChildren="解封" loading={this.state.switchWaiting} defaultChecked={!this.state.isBanned} onChange={(e) => this.handleOperation(this.props.info.isBanned)} />
        {/* </Popconfirm> */}
      </div>
    )
  }
}

class DetailedItem extends React.Component {
  constructor(props) {
    super(props)
  }
  render() {
    const ReturnEle = []
    return (
      <div className={styles["page-ctn"]}>
        <Query query={GetUsersData} >
          {({ loading, error, data }) => {
            console.log("ok")
            if (loading) return <div>loading</div>
            if (error) return <div>`Error!: ${error}`</div>
            console.log(data.users)
            for (let i = 0, len = data.users.length; i < len; i++) {
              ReturnEle.push(
                <ShowUserInfo key={data.users[i].id} info={data.users[i]} />
              )
            }
            return (
              <div className={styles["item-detail-ctn"]} >
                <div className={styles["user-info-title-ctn"]}>
                  <p className={styles['user-info-name']}>用户昵称</p>
                  <p className={styles['user-info-phone']} >手机号码</p>
                  <p className={styles['user-info-check']}>是否验证身份</p>
                  {/* <p className={styles['user-info-real-name']}>真实姓名</p> */}
                  {/* <p className={styles['user-info-idCard']}>身份证号</p> */}
                  <p className={styles['user-info-buyNum']}>正在交易拍品数量</p>
                  <p className={styles['user-info-sellNum']}>正在出售拍品数量</p>
                  <p className={styles['user-info-point']}>信用积分</p>
                  <p className={styles['user-info-operation']}>操作</p>
                </div>
                {ReturnEle}
              </div >
            )
          }}
        </Query>


      </div >
    )
  }
}

export default graphql(GetUsersData)(DetailedItem)


{/* <Mutation mutation={changeStatusMutation}>
{(updateManyAuctionItems) => (
  <div>
    <button onClick={
      e => {
        console.log("hello")
        e.preventDefault()
        updateManyAuctionItems({
          variables: {
            id: this.props.id
          }
        })
      }}>
    </button>
  </div>
)}
</Mutation> */}
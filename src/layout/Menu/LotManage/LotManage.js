import React from 'react'
import { BrowserRouter as Router, Route, Link } from 'react-router-dom'

import { Layout, Menu, Icon } from 'antd'
const { Header, Content } = Layout

import SubmitCheck from '../../MenuLotManage/AllLotShow/index'
import OnlineLots from '../../MenuLotManage/onlineLots/index'
import ObjectCheck from '../../MenuLotManage/objectCheck/index'
import TradeResult from '../../MenuLotManage/tradeResult/index'
import TradeNum from '../../MenuLotManage/tradeNum/index'
import PlatformShipping from '../../MenuLotManage/PlatformShipping/index'

class LotManage extends React.Component {
  constructor(props) {
    super(props)
  }
  render() {
    return (
      <Router >
        <Layout>
          <Header style={{ background: '#fff', padding: 0 }}>
            <Menu
              onClick={this.handleClick}
              // selectedKeys={[this.state.current]}
              mode="horizontal"
            >
              <Menu.Item key="report">
                <Link to={`${this.props.match.path}/submit-check`}>
                  <Icon type="check-circle" />
                  拍品提报审核
              </Link>
              </Menu.Item>
              <Menu.Item key="online">
                <Link to={`${this.props.match.path}/online-lots`}>
                  <Icon type="shop" />
                  已上线的拍品
              </Link>
              </Menu.Item>
              <Menu.Item key="audit">
                <Link to={`${this.props.match.path}/object-check`}>
                  <Icon type="eye" />
                  拍品实物审核
              </Link>
              </Menu.Item>
              <Menu.Item key="shipping">
                <Link to={`${this.props.match.path}/shipping`}>
                  <Icon type="gift" />
                  实物发货登记
              </Link>
              </Menu.Item>
              <Menu.Item key="result">
                <Link to={`${this.props.match.path}/trade-result`}>
                  <Icon type="red-envelope" />
                  拍品交易结果
              </Link>
              </Menu.Item>
              <Menu.Item key="numbers">
                <Link to={`${this.props.match.path}/trade-num`}>
                  <Icon type="bar-chart" />
                  拍品数量统计
              </Link>
              </Menu.Item>
            </Menu>
          </Header>
          <Content style={{ minHeight: "600px" }}>
            {/* <Route exact path={`${this.props.match.path}`} component={LotManage} /> */}
            <Route path={`${this.props.match.path}/submit-check`} component={SubmitCheck} />
            <Route path={`${this.props.match.path}/online-lots`} component={OnlineLots} />
            <Route path={`${this.props.match.path}/object-check`} component={ObjectCheck} />
            <Route path={`${this.props.match.path}/shipping`} component={PlatformShipping} />
            <Route path={`${this.props.match.path}/trade-result`} component={TradeResult} />
            <Route path={`${this.props.match.path}/trade-num`} component={TradeNum} />
          </Content>
        </Layout>
      </Router>
    )
  }
}

export default LotManage
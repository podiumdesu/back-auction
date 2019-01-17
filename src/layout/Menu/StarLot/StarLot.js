import React from 'react'
import { BrowserRouter as Router, Route, Link } from 'react-router-dom'

import { Layout, Menu, Icon } from 'antd'
const { Header, Content } = Layout

import NewStarLot from '../../MenuStarLot/NewStarLot'
import AllStarLot from '../../MenuStarLot/AllStarLot';

class StarLot extends React.Component {
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
              <Menu.Item key="newStarLot">
                <Link to={`${this.props.match.path}/report-new-star-lot`}>
                  <Icon type="shop" />
                  许愿池提报
                </Link>
              </Menu.Item>
              <Menu.Item key="allStarLot">
                <Link to={`${this.props.match.path}/all-star-lot`}>
                  <Icon type="eye" />
                  全部许愿池
                </Link>
              </Menu.Item>
            </Menu>
          </Header>
          <Content style={{ minHeight: "600px" }}>
            {/* <Route exact path={`${this.props.match.path}`} component={LotManage} /> */}
            <Route path={`${this.props.match.path}/report-new-star-lot`} component={NewStarLot} />
            <Route path={`${this.props.match.path}/all-star-lot`} component={AllStarLot} />
          </Content>
        </Layout>
      </Router>
    )
  }
}

export default StarLot
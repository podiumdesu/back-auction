/**
 * Created by petnakanojo on 2018/3/9.
 */

import React, { Component } from 'react'
import ReactDom from 'react-dom'
import { BrowserRouter as Router, Route, Link } from 'react-router-dom'

import { Layout, Menu, Icon } from 'antd'
const { Header, Sider, Content } = Layout
const { Item, SubMenu } = Menu
const MenuItemGroup = Menu.ItemGroup

// import AAA from './test'
// apollo
import { ApolloProvider } from 'react-apollo';
// apolloProvider 作为客户端实例
import { ApolloClient } from 'apollo-client';
// apolloClient 作为查询结果数据的中心存储
import { InMemoryCache } from 'apollo-cache-inmemory'
import { HttpLink } from 'apollo-link-http'

// solve 400

import { ApolloLink } from 'apollo-boost'
import { onError } from 'apollo-link-error'

const errorLink = onError(({ graphQLErrors }) => {
  if (graphQLErrors) graphQLErrors.map(({ message }) => console.log(message))
})

// const networkInterface = createNetworkInterface({
//   uri: `http://localhost:4000/graphql`,
//   opts: {
//     credentials: 'same-origin',
//     mode: 'no-cors',
//   },
// });

// const client = new ApolloClient({ networkInterface });

const client = new ApolloClient({
  link: ApolloLink.from([errorLink, new HttpLink({
    uri: `http://parities.farawaaay.com:4466`
  })]),
  cache: new InMemoryCache()
})

import 'antd/dist/antd.css'
// import LeftBoard from './layout/LeftBoard/index'
// import App from './layout/App'
// import Contact from './components/Contact/index'
// import Map from './components/Map/index'
// import About from './components/About/index'
// import styles from './style/index.sass'
import LotManage from './layout/Menu/LotManage/index'
import StarLot from './layout/Menu/StarLot/index'
import FridayLot from './layout/Menu/FridayLot/index'
import UserManage from './layout/Menu/UserManage/index'
import gql from 'graphql-tag'
class Main extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      collapsed: false,
    }
    this.toggle = this.toggle.bind(this)
  }
  componentWillMount() {
    const data = gql`
      query {
        ReturnAllThings {
          _id
          title
          }
        }
    `
    console.log(data)
  }
  toggle() {
    this.setState({
      collapsed: !this.state.collapsed,
    });
  }

  render() {
    return (
      <Router>
        <Layout style={{ height: "100%" }}>
          <Sider
            trigger={null}
            collapsible
            collapsed={this.state.collapsed}
          >
            <div className="logo" />
            <Menu theme="dark" mode="inline" defaultSelectedKeys={['1']}>
              <Menu.Item key="1">
                <Link to="/LotManage">
                  <Icon type="user" />
                  <span>拍品管理</span>
                </Link>
              </Menu.Item>
              <Menu.Item key="2">
                <Link to="/StarLot">
                  <Icon type="video-camera" />
                  <span>明星拍立得</span>
                </Link>
              </Menu.Item>
              <Menu.Item key="3">
                <Link to="/FridayLot">
                  <Icon type="upload" />
                  <span>周五拍立得</span>
                </Link>
              </Menu.Item>
              <Menu.Item key="4">
                <Link to="/UserManage">
                  <Icon type="upload" />
                  <span>用户管理</span>
                </Link>
              </Menu.Item>
            </Menu>
          </Sider>
          <Layout>
            {/* <Icon
              className="trigger"
              type={this.state.collapsed ? 'menu-unfold' : 'menu-fold'}
              onClick={this.toggle}
            /> */}
            {/* <AAA /> */}

            <Content style={{ margin: '24px 16px', padding: 24, background: '#fff', minHeight: 280 }}>
              <Route exact path="/" component={LotManage} />
              <Route path="/LotManage" component={LotManage} />
              <Route path="/StarLot" component={StarLot} />
              <Route path="/FridayLot" component={FridayLot} />
              <Route path="/UserManage" component={UserManage} />
            </Content>
          </Layout>
        </Layout>
      </Router >
    );
  }
}

ReactDom.render(
  <ApolloProvider client={client}>
    <Main />
  </ApolloProvider>
  , document.getElementById('root'))

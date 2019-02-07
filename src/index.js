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

import styles from './style/login.sass'
import { Button } from 'antd'
// import AAA from './test'
// apollo
import { ApolloProvider } from 'react-apollo';
// apolloProvider 作为客户端实例
import { ApolloClient } from 'apollo-client';
// apolloClient 作为查询结果数据的中心存储
import { InMemoryCache } from 'apollo-cache-inmemory'
import { setContext } from 'apollo-link-context';
import { createHttpLink } from 'apollo-link-http';
// solve 400
import Login from './components/Login'
import { onError } from 'apollo-link-error'
const errorLink = onError(({ graphQLErrors }) => {
  if (graphQLErrors) graphQLErrors.map(({ message }) => console.log(message))
})

import { getCookie, setCookie } from './utils/cookie'

// const networkInterface = createNetworkInterface({
//   uri: `http://localhost:4000/graphql`,
//   opts: {
//     credentials: 'same-origin',
//     mode: 'no-cors',
//   },
// });

// const client = new ApolloClient({ networkInterface });

// const client = new ApolloClient({
//   link: ApolloLink.from([errorLink, new HttpLink({
//     uri: `http://parities.farawaaay.com:4466`
//   })]),
//   cache: new InMemoryCache()
// })

const httpLink = createHttpLink({
  uri: 'https://admin.parities.farawaaay.com/graphql',
});

const authLink = setContext((_) => {
  // get the authentication token from local storage if it exists
  // return the headers to the context so httpLink can read them
  return {
    headers: {
      authorization: { "Authoration": getCookie("token") }
    }
  }
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache()
});


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
    let temp = getCookie("login") === "true" ? true : false
    super(props)
    this.state = {
      collapsed: false,

      login: temp,
      loginInfo: null
    }
    console.log("cons" + this.state.login)
    this.toggle = this.toggle.bind(this)

    this.transferLoginInfo = this.transferLoginInfo.bind(this)
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

  transferLoginInfo(info) {
    this.setState({
      loginInfo: info,
      login: info.success
    })
    console.log("login" + info.success)
    setCookie("login", info.success, 2);
    setCookie("token", info.token, 2);
  }
  render() {
    return (
      <Router>
        {(this.state.login || getCookie("login") === "true") ? (
          <Layout style={{ height: "100%" }}>
            <Sider
              trigger={null}
              collapsible
              collapsed={this.state.collapsed}
            >
              <div className="logo" />
              <h1 style={{
                color: "rgba(255, 255, 255, 0.8)",
                margin: "0",
                lineHeight: "51px",
                fontSize: "21px",
                textAlign: "center",
                letterSpacing: "1px",
              }}>拍立得后台</h1>

              {/* <Menu theme="dark" mode="inline" defaultSelectedKeys={['1']}> */}
              <Menu theme="dark" mode="inline">

                <Menu.Item key="1">
                  <Link to="/LotManage">
                    <Icon type="user" />
                    <span>拍品管理</span>
                  </Link>
                </Menu.Item>
                <Menu.Item key="2">
                  <Link to="/StarLot">
                    <Icon type="video-camera" />
                    <span>拍立得许愿池</span>
                  </Link>
                </Menu.Item>
                {/* <Menu.Item key="3">
                <Link to="/FridayLot">
                  <Icon type="upload" />
                  <span>周五拍立得</span>
                </Link>
              </Menu.Item> */}
                <Menu.Item key="4">
                  <Link to="/UserManage">
                    <Icon type="upload" />
                    <span>用户管理</span>
                  </Link>
                </Menu.Item>
              </Menu>
            </Sider>
            <Layout style={{ minWidth: "1200px", minHeight: "600px" }}>
              {/* <Icon
              className="trigger"
              type={this.state.collapsed ? 'menu-unfold' : 'menu-fold'}
              onClick={this.toggle}
            /> */}
              {/* <AAA /> */}

              <Content style={{ margin: '24px 16px', padding: 24, background: '#fff', minHeight: "600px", minWidth: "1000px", overflow: "scroll" }}>
                {/* <Route exact path="/" component={LotManage} /> */}
                <Route path="/LotManage" component={LotManage} />
                <Route path="/StarLot" component={StarLot} />

                {/* <Route path="/FridayLot" component={FridayLot} /> */}
                <Route path="/UserManage" component={UserManage} />
              </Content>
            </Layout>
          </Layout>
        ) : (
            <div className={styles["page-ctn"]} >
              <div className={styles["login-ctn"]}>
                <h3>请登录</h3>
                <Login transferLoginInfo={this.transferLoginInfo.bind(this)} />

              </div>
            </div>
          )}

      </Router >
    );
  }
}

ReactDom.render(
  <ApolloProvider client={client}>
    <Main />
  </ApolloProvider>
  , document.getElementById('root'))

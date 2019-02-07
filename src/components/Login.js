import {
  Form, Icon, Input, Button, Checkbox, message
} from 'antd';
import React from 'react'
import styles from '../style/login.sass'
import ajaxRequest from '../utils/ajaxRequest'
class NormalLoginForm extends React.Component {
  constructor(props) {
    super(props)
    this.handleSubmit = this.handleSubmit.bind(this)
  }
  handleSubmit(e) {
    e.preventDefault();
    const that = this
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const userInfo = {}
        // console.log('Received values of form: ', values);
        if (values.userName) userInfo.phoneNumber = values.userName
        if (values.password) userInfo.password = values.password
        that.props.transferLoginInfo(userInfo)
        ajaxRequest("https://admin.parities.farawaaay.com/login/passwd", "POST", JSON.stringify(userInfo))
          .then((receivedInfo) => {
            const loginInfo = {
              success: true,
              token: receivedInfo.token
            }
            message.success("登录成功")
            this.props.transferLoginInfo(loginInfo)
          })
          .catch((catchInfo) => {
            console.log(catchInfo)
            const loginInfo = {
              success: false,
              token: ""
            }
            message.error("用户名或密码错误")
            this.props.transferLoginInfo(loginInfo)
          })
      }
    });
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Form onSubmit={this.handleSubmit} className={styles["login-form"]}>
        <Form.Item>
          {getFieldDecorator('userName', {
            rules: [{ required: true, message: '请输入用户名！' }],
          })(
            <Input prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="Username" />
          )}
        </Form.Item>
        <Form.Item>
          {getFieldDecorator('password', {
            rules: [{ required: true, message: '请输入密码！' }],
          })(
            <Input prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />} type="password" placeholder="Password" />
          )}
        </Form.Item>
        <Button type="primary" htmlType="submit" >
          登录
        </Button>

      </Form>
    );
  }
}

const WrappedNormalLoginForm = Form.create({ name: 'normal_login' })(NormalLoginForm);

export default WrappedNormalLoginForm

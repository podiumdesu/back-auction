import React from 'react'

// class NewStarLot extends React.Component {
//   constructor(props) {
//     super(props)
//   }

//   render() {
//     return (
//       <div>

//       </div>
//     )
//   }
// }

// export default NewStarLot

import {
  Form, Input, Icon, Button,
} from 'antd';

import {
  DatePicker, TimePicker,
} from 'antd';

const { MonthPicker, RangePicker } = DatePicker;


let id = 0;

class NewStarLot extends React.Component {
  constructor(props) {
    super(props)
    this.remove = this.remove.bind(this)
    this.add = this.add.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }
  remove(k) {
    const { form } = this.props;
    // can use data-binding to get
    const keys = form.getFieldValue('keys');
    // We need at least one passenger
    if (keys.length === 1) {
      return;
    }

    // can use data-binding to set
    form.setFieldsValue({
      keys: keys.filter(key => key !== k),
    });
  }

  add() {
    const { form } = this.props;
    // can use data-binding to get
    const keys = form.getFieldValue('keys');
    const nextKeys = keys.concat(++id);
    // can use data-binding to set
    // important! notify form to detect changes
    form.setFieldsValue({
      keys: nextKeys,
    });
  }

  handleSubmit(e) {
    e.preventDefault();
    this.props.form.validateFields((err, fieldsValue) => {
      if (!err) {
        console.log('Received values of form: ', fieldsValue);
      }
      // Should format date value before submit.
      const rangeValue = fieldsValue['range-picker'];
      const rangeTimeValue = fieldsValue['range-time-picker'];
      const values = {
        // ...fieldsValue,
        'idolName': fieldsValue['idolName'],
        'idolQuote': fieldsValue['idolQuote'],
        'fansChoices': fieldsValue['fansChoices'],
        'date-picker': fieldsValue['date-picker'].format('YYYY-MM-DD'),
        'date-time-picker': fieldsValue['date-time-picker'].format('YYYY-MM-DD HH:mm:ss'),
        'month-picker': fieldsValue['month-picker'].format('YYYY-MM'),
        'range-picker': [rangeValue[0].format('YYYY-MM-DD'), rangeValue[1].format('YYYY-MM-DD')],
        // 'range-time-picker': [
        //   rangeTimeValue[0].format('YYYY-MM-DD HH:mm:ss'),
        //   rangeTimeValue[1].format('YYYY-MM-DD HH:mm:ss'),
        // ],
        // 'time-picker': fieldsValue['time-picker'].format('HH:mm:ss'),
      };
      console.log('Received values of form: ', values);
    });
  }

  render() {
    const { getFieldDecorator, getFieldValue } = this.props.form;
    const formItemLayout = {
      labelCol: {
        xs: { span: 2 },
        sm: { span: 4 },
      },
      wrapperCol: {
        xs: { span: 10 },
        sm: { span: 20 },
      },
    };

    const formItemLayoutWithOutLabel = {
      wrapperCol: {
        xs: { span: 24, offset: 0 },
        sm: { span: 20, offset: 4 },
      },
    };

    // const formItemLayout = {
    //   labelCol: {
    //     xs: { span: 24 },
    //     sm: { span: 8 },
    //   },
    //   wrapperCol: {
    //     xs: { span: 24 },
    //     sm: { span: 16 },
    //   },
    // };
    const config = {
      rules: [{ type: 'object', required: true, message: 'Please select time!' }],
    };
    const rangeConfig = {
      rules: [{ type: 'array', required: true, message: 'Please select time!' }],
    };



    getFieldDecorator('keys', { initialValue: [] });
    const keys = getFieldValue('keys');
    const formItems = keys.map((k, index) => (
      <Form.Item
        {...(index === 0 ? formItemLayout : formItemLayoutWithOutLabel)}
        label={index === 0 ? '许愿池' : ''}
        required={false}
        key={k}
      >
        {getFieldDecorator(`fansChoices[${k}]`, {
          validateTrigger: ['onChange', 'onBlur'],
          rules: [{
            required: true,
            whitespace: true,
            message: "请输入内容",
          }],
        })(
          <Input placeholder="fans Choices" style={{ width: '60%', marginRight: 8 }} />
        )}
        {keys.length > 1 ? (
          <Icon
            className="dynamic-delete-button"
            type="minus-circle-o"
            disabled={keys.length === 1}
            onClick={() => this.remove(k)}
          />
        ) : null}
      </Form.Item>

    ));
    return (
      <Form onSubmit={this.handleSubmit}>


        <Form.Item {...formItemLayout} label="本期许愿爱豆" >
          {getFieldDecorator('idolName', {
            rules: [{
              required: true,
              message: '请输入爱豆姓名',
            }],
          })(
            <Input style={{ width: '30%' }} placeholder="姓名" />
          )}
        </Form.Item>
        <Form.Item {...formItemLayout} label="爱豆寄语">
          {getFieldDecorator('idolQuote', {
            rules: [{
              required: true,
              message: '请输入爱豆寄语',
            }],
          })(
            <Input style={{ width: '50%' }} placeholder="一句话寄语" />
          )}
        </Form.Item>



        <h3 style={{ textAlign: 'center' }}>许愿信息</h3>
        {formItems}
        <Form.Item {...formItemLayoutWithOutLabel}>
          <Button type="dashed" onClick={this.add} style={{ width: '60%' }}>
            <Icon type="plus" /> 添加愿望
          </Button>
        </Form.Item>
        <Form.Item
          {...formItemLayout}
          label="圆梦时间"
        >
          {getFieldDecorator('range-picker', rangeConfig)(
            <RangePicker />
          )}
        </Form.Item>

        <h3 style={{ textAlign: 'center' }}>竞拍信息</h3>
        <Form.Item {...formItemLayout} label="许愿底价" >
          {getFieldDecorator('startingPrice', {
            rules: [{
              required: true,
              message: '请输入许愿底价',
            }],
          })(
            < Input style={{ width: '30%' }} placeholder="起拍价" />
          )}
        </Form.Item>
        <Form.Item
          {...formItemLayout}
          label="起拍时间"
        >
          {getFieldDecorator('timeToStart', config)(
            <DatePicker showTime format="YYYY-MM-DD HH:mm:ss" />
          )}
        </Form.Item>

        <h3 style={{ textAlign: 'center' }}>公益信息</h3>
        <Form.Item {...formItemLayout} label="公益信息">
          {getFieldDecorator('publicWelfareString', {
            rules: [{
              required: true,
              message: '请输入公益信息',
            }],
          })(
            <Input style={{ width: '50%' }}
              autosize={{ minRows: 4 }}
              type='textarea' placeholder="公益信息" />
          )}
        </Form.Item>


        <h3 style={{ textAlign: 'center' }}>补充内容</h3>
        <Form.Item {...formItemLayout} label="用户协议">
          {getFieldDecorator('publicWelfareString', {
            rules: [{
              required: false,
              message: '请输入用户协议',
            }],
          })(
            <Input style={{ width: '50%' }}
              autosize={{ minRows: 4 }}
              type='textarea' placeholder="多行输入" />
          )}
        </Form.Item>



        {/* <Form.Item
        //   {...formItemLayout}
        //   label="DatePicker"
        // >
        //   {getFieldDecorator('date-picker', config)(
        //     <DatePicker />
        //   )}
        // </Form.Item>

        // <Form.Item
        //   {...formItemLayout}
        //   label="MonthPicker"
        // >
        //   {getFieldDecorator('month-picker', config)(
        //     <MonthPicker />
        //   )}
        // </Form.Item>

        {/* <Form.Item
          {...formItemLayout}
          label="RangePicker[showTime]"
        >
          {getFieldDecorator('range-time-picker', rangeConfig)(
            <RangePicker showTime format="YYYY-MM-DD HH:mm:ss" />
          )}
        </Form.Item> */}
        {/* <Form.Item
          {...formItemLayout}
          label="TimePicker"
        >
          {getFieldDecorator('time-picker', config)(
            <TimePicker />
          )}
        </Form.Item> */}
        {/* <Form.Item
          wrapperCol={{
            xs: { span: 24, offset: 0 },
            sm: { span: 16, offset: 8 },
          }}
        >
          <Button type="primary" htmlType="submit">Submit</Button>
        </Form.Item> */}

        <Form.Item {...formItemLayoutWithOutLabel}>
          <Button type="primary" htmlType="submit">Submit</Button>
        </Form.Item>
      </Form>
    );
  }
}

const WrappedDynamicFieldSet = Form.create({ name: 'dynamic_form_item' })(NewStarLot);
// ReactDOM.render(<WrappedDynamicFieldSet />, mountNode);
export default WrappedDynamicFieldSet 
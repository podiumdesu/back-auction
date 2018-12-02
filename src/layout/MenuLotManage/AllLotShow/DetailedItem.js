import React from 'react'

import styles from '../../../style/AllLotShow.sass'
import { graphql, Query, Mutation } from 'react-apollo'
import gql from 'graphql-tag'
import { isNull } from 'util';

const oneItemData = gql`
query QUERY_ONE_ITEM($_id: String!) {
  ReturnOneItem(_id: $_id) {
    _id
    title
    description
    status
    lastStatusChangeTime
    categoryId
  }
}
`
import { showCategoryAccordingNum } from '../../../utils/commonChange'

const changeStatusMutation = gql`
  mutation CHANGE($newStatus: String!, $itemId: ObjectId!) {
    changeAuctionStatus(newStatus: $newStatus , itemId: $itemId ) 
  }
`

// ❌ use apolloFetch
// import { createApolloFetch } from 'apollo-fetch'

// const uri = 'http://localhost:4000/graphql'
// const apolloFetch = createApolloFetch({ uri })

class DetailedItem extends React.Component {
  constructor(props) {
    super(props)
  }
  render() {
    const _id = this.props._id
    let input
    // ❌ use apolloFetch
    // apolloFetch({
    //   oneItemData, variables: { _id }
    // }).then(result => {
    //   const { data, errors, extensions } = result
    //   console.log(data, errors, extensions)
    // }).catch(error => {
    //   console.log(error)
    // })
    // ❌ just use fetch
    // fetch('http://localhost:4000/graphql', {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //     'Accept': 'application/json',
    //   },
    //   body: JSON.stringify({
    //     oneItemData,
    //     variables: { _id },
    //   })
    // })
    //   .then(r => console.log(r))
    //   .then(data => console.log('data returned:', data));
    // console.log(this.props.key)

    // Try 3, use Query

    return (
      <div>
        <Query query={oneItemData} variables={{ _id }} >
          {({ loading, error, data }) => {
            if (loading) return <div>loading</div>
            if (error) return <div>`Error!: ${error}`</div>
            console.log(data.ReturnOneItem)
            return (
              <div className={styles["item-detail-ctn"]} >
                <p>_id: {this.props._id}</p>
                <p>名称：{data.ReturnOneItem.title}</p>
                <p>提报时间：{data.ReturnOneItem.lastStatusChangeTime}</p>
                <p>状态（应该是1）：{data.ReturnOneItem.status}</p>
                {/* <p>分类：{data.ReturnOneItem.categoryId}</p> */}

                {/* <p>分类：{showCategoryAccordingNum(parseInt(data.ReturnOneItem.categoryId))}</p> */}
              </div >
            )
          }}
        </Query>
        <Mutation mutation={changeStatusMutation}>
          {(changeAuctionStatus) => (
            <div>
              <button onClick={
                e => {
                  console.log("hello")
                  e.preventDefault()
                  changeAuctionStatus({
                    variables: {
                      newStatus: "2",
                      itemId: this.props._id
                    }
                  })
                }}>
              </button>
            </div>
          )}
        </Mutation>
      </div >
    )
  }
}

export default graphql(oneItemData)(DetailedItem)
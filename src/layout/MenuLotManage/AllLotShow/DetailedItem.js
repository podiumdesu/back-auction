import React from 'react'

import styles from '../../../style/AllLotShow.sass'
import { graphql, Query, Mutation } from 'react-apollo'
import gql from 'graphql-tag'
import { isNull } from 'util';

const oneItemData = gql`
  query QUERY_ONE_ITEM(  $id: ID!  ) {
    auctionItem(where: {id: $id}) {
      id
      title
      description
      status
      lastStatusChangeTime
      category {
        id
      }
    }
  }
`

const changeStatusMutation = gql`
  mutation CHANGE($id: ID!){
    updateManyAuctionItems(
      where: {
        id: $id,
        status: InFirstCheck
      },
      data: {
        status: InAuction
      }
    ) {
      count
    }
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
    return (
      <div>
        <Query query={oneItemData} variables={{ id: this.props.id }} >
          {({ loading, error, data }) => {
            console.log("ok")
            if (loading) return <div>loading</div>
            if (error) return <div>`Error!: ${error}`</div>
            console.log(data.auctionItem)
            return (
              <div className={styles["item-detail-ctn"]} >
                <p>id: {this.props.id}</p>
                <p>名称：{data.auctionItem.title}</p>
                <p>提报时间：{data.auctionItem.lastStatusChangeTime}</p>
                <p>状态（应该是1）：{data.auctionItem.status}</p>

              </div >
            )
          }}
        </Query>


        <Mutation mutation={changeStatusMutation}>
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
        </Mutation>
      </div >
    )
  }
}

export default graphql(oneItemData)(DetailedItem)
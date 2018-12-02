import {
  graphql
} from 'react-apollo'
import gql from 'graphql-tag'
import React from 'react'
const data = gql `
  query {
    ReturnAllThings {
      _id
      title
      }
    }
`

import {
  Mutation
} from 'react-apollo'
const changeStatusMutation = gql `
  mutation CHANGE($newStatus: String!, $itemId: ObjectId!) {
    changeAuctionStatus(newStatus: $newStatus , itemId: $itemId ) 
  }
`
// "5c02cd1f5b120f1a382e6336"

const oneItemData = gql `
  query QUERY_ONE_ITEM($itemId: ObjectId!) {
    ReturnOneItem(_id: $itemId) {
      _id
      title
      description
    }
  }
`
class test extends React.Component {
  constructor(props) {
    super(props)
  }
  render() {
    let input
    return ( <
      div >
      <
      Mutation mutation = {
        changeStatusMutation
      } > {
        (changeAuctionStatus) => ( <
          div >
          <
          form onSubmit = {
            e => {
              e.preventDefault()
              console.log(input.value)
              console.log(typeof (input.value))
              changeAuctionStatus({
                variables: {
                  newStatus: input.value,
                  itemId: "5c02cd1f5b120f1a382e6336"
                }
              })
              input.value = ""
            }
          } >
          <
          input ref = {
            node => {
              input = node;
            }
          }
          /> <
          button type = "submit" > Add Todo < /button> <
          /form> <
          /div>
        )
      } < /Mutation> {
        /* <Query query={oneItemData}>
                  {(ReturnOneItem) => {
                    console.log(ReturnOneItem({
                      variables: {
                        _id: "5c02cd1f5b120f1a382e6336"
                      }
                    }))
                  }}
                </Query> */
      } <
      /div>
    )
  }

}
// class test extends React.Component {
//   constructor(props) {
//     super(props)
//   }

//   render() {
//     if (this.props.data.loading) {
//       return <p>Loading ...</p>;
//     }
//     if (this.props.data.error) {
//       return <p>{error.message}</p>;
//     }
//     console.log(this.props.data.ReturnAllThings[0]._id)
//     return (

//       <ul>{
//         this.props.data.ReturnAllThings[0]._id} {this.props.data.ReturnAllThings.length}
//       </ul>
//     )
//   }
// }

const result = graphql(data)(test)

export default result
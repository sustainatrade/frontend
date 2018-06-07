import React, { Component } from 'react'
import {
    Label
} from 'semantic-ui-react'
import gql from 'graphql-tag'
import { Query } from 'react-apollo'
import ContentLoader from 'react-content-loader'
import PostFeedContext from './../../contexts/PostFeedContext'

const TAG_LIST = gql`
  query{
    PostTagList{
        status
        list{
          name
          count
        } 
      }
  }
`;

const placeHolderSizes = [3,4,1,8,3,9,5,6,9,10,4,5,7,8,5]

const TagPlaceHolder = (props) => {
    const height = 30;
    const width = (60+props.size*5)
    return <ContentLoader
        style={{height,width}}
        height={height}
        width={width}
        speed={2}
        primaryColor="#f3f3f3"
        secondaryColor="#ecebeb"
        {...props}
    >
    <rect x="0" y="0" rx="5" ry="5" width="85%" height="100%"/>
</ContentLoader>}

export default class TagList extends Component {
    render(){
        return (<Query query={TAG_LIST}>
        {({ loading, error, data = {} }) => {
            if(loading) return <div>
                {placeHolderSizes.map((s,i)=><TagPlaceHolder key={i} size={s}/>)}
                </div>
            console.log('data')//TRACE
            console.log(data)//TRACE
            return <div>
                <PostFeedContext.Consumer>
                    {({setSearchesFn})=>(<Label.Group size='large'>
                        {data.PostTagList.list.map(tag=>(<Label key={tag.name}
                            onClick={()=>setSearchesFn({PostTag:tag.name})}
                            style={{cursor:'pointer'}}
                        >
                            {tag.name}
                            <Label.Detail>{tag.count}</Label.Detail>
                        </Label>))
                        }
                        
                    </Label.Group>)}
                </PostFeedContext.Consumer>
            </div>
        }}
    </Query>)
    }
}
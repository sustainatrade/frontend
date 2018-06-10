import React, { Component } from 'react'
import {
    Segment,
    Button,
    Icon,
    Form,
    Input,
    Message,
    TextArea,
    Dropdown,
    Divider,
    Header
} from 'semantic-ui-react'
import { Query, Mutation } from 'react-apollo'
import gql from 'graphql-tag'
import CreatePostContext from './../../contexts/CreatePost'
import PostViewContext from './../../contexts/PostViewContext'
import UploaderContext from './../../contexts/Uploader'
import UploadPhoto from './UploadPhoto'
// import get from 'lodash/get'
// import Modal from 'antd/lib/modal';

const CATEGORY_LIST = gql`
  query{
    CategoryList{
        list{
        id
        name
        }
    }
  }
`;

const CREATE_POST = gql`
  mutation ($post:CreatePostInput){
    CreatePost(input:$post){
      status
      post{
        id
        title
        section
        category
        description
        _refNo
      }
    }
  }
`;

const UPLOAD_NAME = 'Post Image Upload'

function tagItem(tag){
    return {
        key: tag,
        value: tag,
        text: tag
    }
}
export default class CreatePost extends Component {
    state = {
        form: {},
        formErrors: [],
        tagInput: {key:'_',text:'',value:''},
        mutKey: Date.now()
    }

    updateForm(newProps) {
        const { form } = this.state;
        const newForm = Object.assign({}, form, newProps);
        // newForm._hash = 
        // console.log('newForm')//TRACE
        // console.log(newForm)//TRACE
        this.setState({ form: newForm, formErrors: [] });
    }
    
    renderTags() {
        const { form, tagInput } = this.state;
        const tags = form.tags || [];

        const stateOptions = tags.map(tag=>tagItem(tag)) || [];
        // if(stateOptions.length>0)
        if(tagInput.value.length>0)
            stateOptions.unshift(tagInput);

        return (
            <Dropdown placeholder='Enter Tag' fluid
                multiple
                search
                selection
                value={tags}
                onChange={(e,{value})=>{
                    const newForm = Object.assign({},form,{tags:value});
                    this.setState({
                        form:newForm,
                        tagInput:{key:'_',text:'',value:''}
                    })
                }}
                onSearchChange={(e, data)=>{
                    let tmp = {key:'_',text:'',value:''}
                    if(e.target.value.length>2)
                        tmp = tagItem(e.target.value);
                    
                    this.setState({tagInput:tmp})
                }}
                options={stateOptions} />
        )
    }
    renderForm(trigger, { loading, error, data } = {}) {
        const { formErrors, form } = this.state;
        const errsx = [];
        if (error) {
            errsx.push(error.graphQLErrors)
        }
        if (formErrors.length > 0) {
            errsx.push(...formErrors)
        }
        if (data) {
            const { CreatePost } = data;
            console.log('CreatePost')//TRACE
            console.log(CreatePost)//TRACE
            if (CreatePost.status === 'SUCCESS') {
                return (<center><Message info>
                    <Message.Header>Post has been created!</Message.Header>
                    <p>It will be posted in a while</p>
                    <CreatePostContext.Consumer>
                        {({ closeModal }) => (
                            <PostViewContext.Consumer>
                                {({ viewPostFn }) => (
                            <Button
                                content='View Post'
                                icon='eye'
                                onClick={() => {
                                    this.setState({
                                        form: {},
                                        formErrors: [],
                                        mutKey: Date.now()
                                    });
                                    closeModal();
                                    viewPostFn(CreatePost.post._refNo)
                                 }}
                            />)}
                        </PostViewContext.Consumer>
                            )}
                    </CreatePostContext.Consumer>
                </Message></center>)
            }
        }
        return (
            <div>
                {errsx.length > 0 && <Message warning>
                    <Message.Header>New Site Features</Message.Header>
                    <Message.List>
                        {errsx.map((message, i) => (
                            <Message.Item key={i}>{message}</Message.Item>
                        ))}
                    </Message.List>
                </Message>}
                <CreatePostContext.Consumer>
                    {({ photos, modalOpened, closeModal, openModal }) => (
                        <UploaderContext.Consumer>
                            {({ upload, status, isUploading }) => (
                                <Form
                                    onSubmit={async () => {

                                        console.log('subbmititni')//TRACE
                                        const { form } = this.state;
                                        const errs = [];
                                        ['title', 'description', 'section', 'category'].forEach(f => {
                                            if (!form[f]) {
                                                errs.push(`"${f}" should not be empty`);
                                            }
                                        })
                                        if (errs.length > 0) {
                                            this.setState({ formErrors: errs })
                                            return;
                                        }

                                        const path = localStorage.getItem('postPhotoPath')
                                        const ret = await upload({
                                            name: UPLOAD_NAME,
                                            path,
                                            files: photos
                                        });
                                        console.log('ret')//TRACE
                                        console.log(ret)//TRACE
                                        trigger();
                                    }}
                                >
                                    <Form.Field control={Input} label='Title' placeholder='Title'
                                        required
                                        value={form.title || ''}
                                        onChange={(e, { value }) => this.updateForm({ title: value })}
                                    />
                                    <Form.Group widths='equal'>
                                        <Form.Field required>
                                            <label>Section</label>
                                            <Button.Group fluid>
                                                <Button positive={form.section === 'buy'}
                                                    type='button'
                                                    onClick={() => this.updateForm({ section: 'buy' })}
                                                >Buy</Button>
                                                <Button.Or />
                                                <Button positive={form.section === 'sell'}
                                                    type='button'
                                                    onClick={() => this.updateForm({ section: 'sell' })}
                                                >Sell</Button>
                                            </Button.Group>
                                        </Form.Field>
                                        <Form.Field required>
                                            <label>Category</label>
                                            <Query query={CATEGORY_LIST}>
                                                {({ loading, error, data = {} }) => {
                                                    const { CategoryList } = data;
                                                    let options = [];
                                                    if (CategoryList) {
                                                        options = CategoryList.list.map(cat => ({
                                                            key: cat.id,
                                                            text: cat.name,
                                                            value: cat.id
                                                        }))
                                                    }
                                                    return <Form.Select options={options} placeholder='Select Category'
                                                        loading={loading}
                                                        onChange={(e, { value }) => this.updateForm({ category: value })}
                                                        required
                                                    />
                                                }}
                                            </Query>
                                        </Form.Field>
                                    </Form.Group>
                                    <Form.Field control={TextArea}
                                        label='Description' placeholder='Description'
                                        value={form.description || ''}
                                        onChange={(e, { value }) => this.updateForm({ description: value })}
                                        required
                                    />
                                    <Divider horizontal>Photos</Divider>
                                    <UploadPhoto />
                                    <Divider horizontal>Tags</Divider>
                                    {this.renderTags()}
                                    <Divider />
                                    <div style={{ textAlign: 'right' }}>
                                        <Button
                                            type='button'
                                            content='Cancel'
                                            icon='x'
                                            loading={loading || isUploading(UPLOAD_NAME)}
                                            disabled={loading || isUploading(UPLOAD_NAME)}
                                            onClick={closeModal}
                                        />
                                        <Button type='submit'
                                            color='black'
                                            loading={loading || isUploading(UPLOAD_NAME)}
                                            disabled={loading || isUploading(UPLOAD_NAME)}>
                                            Submit
                                        </Button>
                                    </div>
                                </Form>)}
                        </UploaderContext.Consumer>
                    )}
                </CreatePostContext.Consumer>

            </div>
        )
    }
    render() {
        const { form, mutKey } = this.state;

        return (<Segment basic>
            <Header as='h2'>
                <Icon name='compose' />
                <Header.Content>
                    Create Post
                    </Header.Content>
            </Header>
            <Divider />
            <UploaderContext.Consumer>
                {({ status }) => {
                    
                    const photos = [];
                 
                    if(status[UPLOAD_NAME]){
                        status[UPLOAD_NAME].forEach(p => {
                            if(p.data){
                                photos.push(p.data.name);
                            }
                        });
                    }
                    return <Mutation mutation={CREATE_POST}
                        key={mutKey}
                        variables={{ post: Object.assign({}, form, { photos }) }}
                        errorPolicy="all"
                    >
                        {(trigger, mutation) => {
                            return this.renderForm(trigger, mutation)
                        }}
                    </Mutation>
                }}
            </UploaderContext.Consumer>
        </Segment>)
    }
}
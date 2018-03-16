import React, { Component } from 'react';
import { withRouter } from 'react-router';
import { Route, Link, Switch } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Modal from 'react-modal';
import Loading from 'react-loading';
import CategoryList from '../components/CategoryList';
import Post from '../components/Post';
import EditPost from '../components/EditPost';
import PostList from '../containers/PostList';
import PostDetail from '../containers/PostDetail';
import AddPost from '../containers/AddPost';
import Comment from '../containers/Comment';
import { fetchCategories, fetchPostsAll, scoreUporDownPost, fetchComments, deletePost, deleteComment, scoreUporDownComment } from '../actions/index';
import panick from '../img/cuco.jpg';


class ReadableApp extends Component {

  state = {
    currentPost: null,
    rightSideBar: '',
    postToEdit: null,
    showMorePost: null,
    server: false,
    helperServer: 0,
    loading: true
  }


  componentDidMount() {
    this.props.fetchCategories();
    this.props.fetchPostsAll();
    setTimeout(() => this.setState({ loading: false }), 2000);
    // To force the loading effect =)
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.posts !== this.props.posts) {
      this.selectPost = (thePost) => {
        let selectedPostArray = nextProps.posts.filter((post) => post.id === thePost);
        this.setState({currentPost: selectedPostArray});
      }
    }
    this.showMore = (thePost, updateView) => {
      this.setState({showMorePost: thePost, rightSideBar: updateView});
      this.props.fetchComments(thePost.id);
    }
  }


  showView = (view) => {
    this.setState({rightView: view});
  }

  changeScore = (theElement, upOrDown, postOrComment) => {
    if (postOrComment === 'post') {
      this.props.scoreUporDownPost(theElement, upOrDown);
      if (this.state.rightSideBar === 'showMore') {
        let localScore = this.state.showMorePost.voteScore;
        if (upOrDown === 'upVote') {
          localScore = localScore + 1;
          this.setState({ showMorePost: { ...this.state.showMorePost, voteScore: localScore} });
        } else {
          localScore = localScore - 1;
          this.setState({ showMorePost: { ...this.state.showMorePost, voteScore: localScore} });
        }
      }
    } else {
      this.props.scoreUporDownComment(theElement, upOrDown);
    }
  }

  deletePost = (thePostId) => {
    this.setState({rightSideBar: 'delete'});
    this.props.comments.map((eachObj) => deleteComment(eachObj.id))
    this.props.deletePost(thePostId);
  }

  editPost = (thePost, updateView) => {
    this.setState({postToEdit: thePost, rightSideBar: updateView});
  }

  updateRightSidebar = () => {
    setTimeout(() => {
      this.setState({rightSideBar: ''});
    }, 3000);
  }

  tryConnServer = () => {
    this.props.isServerAlive();
    this.setState({helperServer: 1});
  }


  render() {

    const { posts, categories } = this.props;
    const { rightSideBar, postToEdit, showMorePost } = this.state;


    return (

      <div>

        {this.state.loading === true && (
          <Loading type='bars' color='green' height='667' width='375' />
        )}

        <Modal
          className="modal"
          isOpen={ this.state.server }
          onRequestClose={ this.closeModal }
          ariaHideApp={ false } contentLabel="Server is Down">
          <div className="center-helper">
            <div>
              <div style={{ fontSize: 40, margin: 40 }}>Bart, I dont want to alarm you, but there may be a boogeyman or boogeymen in the house!</div>
            </div>
            <img src={ panick } alt="Server is Down" />
            <div style={{ fontSize: 40, margin: 40 }}>... and the server is down!!!</div>
            <button onClick={ () => this.tryConnServer() }>Try AGAIN</button>
          </div>
        </Modal>

        <CategoryList categories={ categories } />

        <div className="full-row-body">

          <div className="columns columns-1-3">
            <div className="instructions">
              <h3>CATEGORIES</h3>
              <div>
                <ul className="element-ul">
                  <li>You can access to the categories using the top navigation or clicking on the main view.</li>
                </ul>
              </div>
              <h3>POSTS</h3>
              <div>
                <ul className="element-ul">
                  <li>Use the select on the main view to sort the posts</li>
                  <li>For more information about a post, click on See more...</li>
                  <li>You can increase or decrease the score from the main view or from the right sidebar view (through See more...)</li>
                  <li>You can Delete and/or Edit a post in the same way: main view or right sidebar view</li>
                  <li>If you want to add a post click on the following button...</li>
                </ul>
                <div className="element-button" onClick={ () => this.showView('add') }>Add Post</div>
              </div>
              <br />
              <h3>COMMENTS</h3>
              <div>
                <ul className="element-ul">
                  <li>You can see, add, delete and edit a comment clicking on See more... for each post.</li>
                </ul>
              </div>
              <div>Among other things... Thanks for your time</div>
              <div>Try with the server down ;)</div>
            </div>
          </div>

          <div className="columns columns-2-3">
            <Switch>

              {categories.map((category) =>
                <Route exact path={ `/${category.path}` } key={ category.name }  render= {() => (
                  <div>
                    <h1 style={{ marginBottom: 0, paddingBottom: 0 }}> { category.name } </h1>
                    <div style={{ textAlign: 'center' }} >
                      <Link className="body-links-home"  to="/">Go Home!</Link>
                    </div>
                    <PostList posts={ posts } postsCategory={ category.name }
                      onChangeScore={ this.changeScore } onDeletePost={ this.deletePost } onEditPost={ this.editPost } onShowMore={ this.showMore }
                    />
                  </div>
                )}/>
              )}

              <Route exact path='/' render= {() => (
                <div>
                  <h1>All our posts...</h1>
                  <PostList posts={ posts }  onChangeScore={ this.changeScore } onDeletePost={ this.deletePost }
                    onEditPost={ this.editPost } onShowMore={ this.showMore }
                  />
                </div>
              )}/>

              <Route exact path={ '/:category/:id' } component={ PostDetail } />

              <Route render= {() => (
                <div>
                  <h1>Nothing here!</h1>
                </div>
              )}/>

            </Switch>
          </div>

          <div className="columns columns-3-3">
            {rightSideBar === 'add' ?
              <AddPost onUpdateRightSidebar={ this.updateRightSidebar } />
            : ( rightSideBar === 'editPost' ?
              <EditPost onEditingPost={ postToEdit } onUpdateRightSidebar={ this.updateRightSidebar } />
            : ( rightSideBar === 'delete' ?
              <div>
                <div className="view-response">Thanks for deleting a post!</div>
                <div style={{textAlign: 'center'}}>This view will be refreshed in 3s...!</div>
                { this.updateRightSidebar() }
              </div>
            : ( rightSideBar === 'showMore' ?
              <div className="post-comments">
                <Post onPassingPost={ showMorePost } onChangeScore={ this.changeScore } onDeletePost={ this.deletePost } onEditPost={ this.editPost }  />
                <Comment onPassingPost={showMorePost} onChangeScore={this.changeScore} />
              </div>
            : <div style={{ textAlign: 'center' }}>
              <i className="fa fa-eye" style={{ fontSize: 100 }}></i>
              <div className="view-response">
                I will show things
              </div>
            </div>
            )
            )
            )}
          </div>

        </div>

      </div>
);
}
}

function mapStateToProps(state) {
  return {
    categories: state.categories,
    posts: state.posts,
    comments: state.comments
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ fetchCategories, fetchPostsAll, scoreUporDownPost, deletePost, fetchComments, deleteComment, scoreUporDownComment }, dispatch);
}

export default withRouter(connect(mapStateToProps,mapDispatchToProps)(ReadableApp));

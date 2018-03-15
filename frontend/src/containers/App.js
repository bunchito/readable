import React, { Component } from 'react';
import { withRouter } from 'react-router';
import { Route, Link, Switch } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Modal from 'react-modal';
import CategoryList from '../components/CategoryList';
import PostList from '../components/PostList';
import Post from '../containers/Post';
import AddPost from '../components/AddPost';
import EditPost from '../components/EditPost';
import Comment from '../containers/Comment';
import { isServerAlive, fetchCategories, fetchPostsAll, scoreUporDown, fetchComments, deletePost, deleteComment } from '../actions/index';
import panick from '../img/cuco.jpg';


class ReadableApp extends Component {

  state = {
    currentPost: null,
    rightView: '',
    postToEdit: null,
    showMorePost: null,
    server: false,
    helperServer: 0
  }

  componentDidMount() {
    this.props.isServerAlive();
    this.props.fetchCategories();
    this.props.fetchPostsAll();
  }

  componentWillReceiveProps(nextProps) {
    this.selectPost = (thePost) => {
      let selectedPostArray = nextProps.posts.filter((post) => post.id === thePost);
      this.setState({currentPost: selectedPostArray});
    }

    this.showMore = (thePost, updateView) => {
      this.setState({showMorePost: thePost, rightView: updateView});
      this.props.fetchComments(thePost.id);
    }

    if (nextProps.serverDown.status !== 200) {
      this.setState({server: true});
    } else if (this.state.helperServer === 1) {
      this.setState({server: false});
      this.props.fetchCategories();
      this.props.fetchPostsAll();
      this.setState({helperServer: 0});
    } else {
      // Nothing for the moment...
    }
  }

  showView = (view) => {
    this.setState({rightView: view});
  }

  changeScore = (thePost, upOrDown) => {
    let selPostToUpScore = this.props.posts.filter((post) => post.id === thePost);
    this.props.scoreUporDown(thePost, upOrDown);

    if (this.state.rightView === 'showMore') {
      let localScore = this.state.showMorePost.voteScore;
      if (upOrDown === 'upVote') {
        localScore = localScore + 1;
        this.setState({ showMorePost: { ...this.state.showMorePost, voteScore: localScore} });
      } else {
        localScore = localScore - 1;
        this.setState({ showMorePost: { ...this.state.showMorePost, voteScore: localScore} });
      }
    }
  }

  deletePost = (thePostId) => {
    this.setState({rightView: 'delete'});
    this.props.comments.map((eachObj) => deleteComment(eachObj.id))
    this.props.deletePost(thePostId);
  }

  editPost = (thePost, updateView) => {
    this.setState({postToEdit: thePost, rightView: updateView});
  }

  reRenderRightView = () => {
    setTimeout(() => {
      this.setState({rightView: ''});
    }, 3000);
  }

  tryConnServer = () => {
    this.props.isServerAlive();
    this.setState({helperServer: 1});
  }

  render() {

    const { posts, categories, comments } = this.props;
    const { currentPost, rightView, postToEdit, showMorePost } = this.state;

    return (
      <div>

        <Modal
          className="modal"
          isOpen={this.state.server}
          onRequestClose={this.closeModal}
          ariaHideApp={false} contentLabel="Server is Down">
          <div className="center-helper">
            <div>
              <div style={{fontSize: 40, margin: 40}}>Bart, I don't want to alarm you, but there may be a boogeyman or boogeymen in the house!</div>
            </div>
            <img src={panick} alt="Server is Down" />
            <div style={{fontSize: 40, margin: 40}}>... and the server is down!!!</div>
            <button onClick={() => this.tryConnServer()}>Try AGAIN</button>

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
                <div className="element-button" onClick={() => this.showView('add')}>Add Post</div>
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
                <Route exact path={'/' + category.path} key={category.name}  render= {() => (
                  <div>
                    <h1 style={{marginBottom: 0, paddingBottom: 0}}> {category.name} </h1>
                    <div style={{textAlign: 'center'}} >
                      <Link className="body-links-home"  to="/">Go Home!</Link>
                    </div>
                    <PostList posts={posts} postsCategory={category.name}
                      onChangeScore={this.changeScore} onDeletePost={this.deletePost} onEditPost={this.editPost} onShowMore={this.showMore} />
                    </div>
                  )}/>
                )}

                <Route path='/' render= {() => (
                  <div>
                    <h1>All our posts...</h1>
                    <PostList posts={posts}  onChangeScore={this.changeScore} onDeletePost={this.deletePost}
                      onEditPost={this.editPost} onShowMore={this.showMore} />
                    </div>
                  )}/>

                </Switch>
              </div>

              <div className="columns columns-3-3">
                {rightView === 'add' ?
                <AddPost onReRenderingView={this.reRenderRightView} />
                : ( rightView === 'editPost' ?
                <EditPost onEditingPost={postToEdit} onReRenderingView={this.reRenderRightView} />
                : ( rightView === 'delete' ?
                <div>
                  <div className="view-response">Thanks for deleting a post!</div>
                  <div style={{textAlign: 'center'}}>This view will be refreshed in 3s...!</div>
                  {this.reRenderRightView()}
                </div>
                : ( rightView === 'showMore' ?
                <div className="post-comments">
                  <Post onPassingPost={showMorePost} onChangeScore={this.changeScore} onDeletePost={this.deletePost} onEditPost={this.editPost}  />
                  <Comment onPassingPost={showMorePost} />
                </div>
                : <div style={{textAlign: 'center'}}>
                  <i className="fa fa-eye" style={{fontSize: 100}}></i>
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
    comments: state.comments,
    serverDown: state.serverDown
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ isServerAlive, fetchCategories, fetchPostsAll, scoreUporDown, deletePost, fetchComments, deleteComment }, dispatch);
}

export default withRouter(connect(mapStateToProps,mapDispatchToProps)(ReadableApp));

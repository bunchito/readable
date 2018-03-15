import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

class Post extends Component {

  render() {

    const { onChangeScore, onSelectToEdit, onDeletingPost, onPassingPost, posts, onDeletePost, onEditPost } = this.props;

    const thePostToShow = this.props.onPassingPost;

    function timeStampToDate(timestamp) {
      const re = /([\w\s\d]+[:\d]+)/;
      let dateIs = new Date(timestamp).toString().split(re);
      return dateIs[1];
    }

    return (
      <div>

        {thePostToShow && (
          <div className="particular-post">
            <div className="view-response">Post details...</div>
            <div>This is the extended view of post #{thePostToShow.id}</div>
            <br />
            <span>{thePostToShow.title}</span>
            <span> by <i>{thePostToShow.author}</i></span>
            <span> at {timeStampToDate(thePostToShow.timestamp)}</span>
            <span> on {thePostToShow.category}</span>
            <div className="scoring">
              Score: {thePostToShow.voteScore}
              <span className="click-element" onClick={() => onChangeScore(thePostToShow.id, 'upVote')}><i className="fa fa-plus-square"></i></span>
              <span className="click-element" onClick={() => onChangeScore(thePostToShow.id, 'downVote')}><i className="fa fa-minus-square"></i></span>
            </div>
            <span className="click-element" style={{marginLeft: 0}} onClick={() => onDeletePost(thePostToShow.id)}>Delete <i className="fa fa-trash"></i></span>
            <span className="click-element" onClick={() => onEditPost(thePostToShow, 'editPost')}>Edit <i className="fa fa-edit"></i></span>
            <br /><br />
            <div>{thePostToShow.body}</div>

          </div>
        )}

      </div>
    );
  }
}


function mapStateToProps(state) {
  return {
    categories: state.categories,
    posts: state.posts
  }
}

export default connect(mapStateToProps)(Post);

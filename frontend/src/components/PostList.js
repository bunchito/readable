import React, { Component } from 'react';
import { Link } from 'react-router-dom';
const sortBy = require('sort-by');

class PostList extends Component {

  state = {
    filtering: 'title'
  }

  onSorting = (sortSelection) => {
    switch (sortSelection) {
      case 'sortScoreAsc':
      return this.setState({ filtering: 'voteScore' });
      case 'sortScoreDesc':
      return this.setState({ filtering: '-voteScore' });
      case 'sortDateAsc':
      return  this.setState({ filtering: 'timestamp' });
      case 'sortDateDesc':
      return  this.setState({ filtering: '-timestamp' });
      default:
      return  this.setState({ filtering: 'title' });
    }
  }

  render() {

    const { onChangeScore, onDeletePost, onEditPost, onShowMore, postsCategory } = this.props;

    let posts = this.props.posts;
    if(postsCategory) {
      posts = posts.filter((post) => post.category === postsCategory);
    }

    let postsList = posts.sort(sortBy(this.state.filtering));

    return (
      <div>
        <div className="general-padding ">
          <select onChange={(event) => this.onSorting(event.target.value)}>
            <option value="sortTitleDesc">Sort by Title: DESC</option>
            <option value="sortScoreAsc">Sort by Score: DESC</option>
            <option value="sortScoreDesc">Sort by Score: ASC</option>
            <option value="sortDateAsc">Sort by Date: DESC</option>
            <option value="sortDateDesc">Sort by Date: ASC</option>
          </select>
        </div>

        {postsList.map((post) => (
          <div key={ post.id } className="post-list general-padding" id={ post.id } >
            <h3 style={{ display: 'block' }}>{ post.title }
            </h3>
            <span>
              by <i>{ post.author }</i> - Category: <Link className="body-links" to={`/${post.category}`}>{ post.category }</Link>
            </span>
            <div className="scoring">
              Score: {post.voteScore}
              <span className="click-element" onClick={() => onChangeScore(post.id, 'upVote')}><i className="fa fa-plus-square"></i></span>
              <span className="click-element" onClick={() => onChangeScore(post.id, 'downVote')}><i className="fa fa-minus-square"></i></span>
            </div>
            <span className="click-element" onClick={() => onDeletePost(post.id)}>Delete <i className="fa fa-trash"></i></span>
            <span className="click-element" onClick={() => onEditPost(post, 'editPost')}>Edit <i className="fa fa-edit"></i></span>
            <span className="click-element" onClick={() => onShowMore(post, 'showMore')}>See more...</span>

          </div>
        ))}

      </div>
    );
  }
}

export default PostList;

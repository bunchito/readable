import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { editPost } from '../actions/index';

class EditPost extends Component {

  state = {
    title: '',
    body: '',
    status: ''
  }

  componentDidMount() {
    this.setState({
      title: this.props.onEditingPost.title,
      body: this.props.onEditingPost.body
    });
  }

  componentWillReceiveProps(nextProps) {
    console.log(nextProps.onEditingPost)
    this.setState({
      title: nextProps.onEditingPost.title,
      body: nextProps.onEditingPost.body
    });
  }

  updateFormElStates = (element, value) => {
    this.setState({
      [element]: value
    })
  }

  onSubmitForm(event) {
    event.preventDefault();
    this.setState({status: 'edited'});
    this.props.editPost(this.state.title, this.state.body, this.props.onEditingPost.id);
  }

  render() {

    const { onEditingPost, onReRenderingView } = this.props;
    const { status } = this.state;

    return (

      <div>

        {status === '' ? (
          <div>
            <div>
              <h2>You are editing: <i>{onEditingPost.title}</i></h2>
            </div>
            <form onSubmit={ this.onSubmitForm.bind(this) }>
              <input type="hidden" defaultValue="{onEditingPost.id}" />
              <div>
                <label>Post title:</label>
                <input type="text" name="title" onChange={ (event) => this.updateFormElStates('title',event.target.value) } value={ this.state.title } required  />
              </div>
              <div>
                <label>Body:</label>
                <textarea name="body" onChange={ (event) => this.updateFormElStates('body',event.target.value) } value={ this.state.body } required>
                </textarea>
              </div>
              <div className="center-helper">
                <button>Save</button>
              </div>
            </form>

          </div>
        ) : (
          <div>
            <div className="view-response">Thanks for editing the post!</div>
            <div style={{textAlign: 'center'}}>This view will be refreshed in 3s...!</div>
            {onReRenderingView()}
          </div>
        )}

      </div>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ editPost }, dispatch);
}

export default connect(null,mapDispatchToProps)(EditPost);

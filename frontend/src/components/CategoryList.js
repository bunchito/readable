import React, { Component } from 'react';

class CategoryList extends Component {

  renderCatList() {
    return this.props.categories.map((category) => {
      return (
        <div key={ category.name }><a href={ category.path }>{ category.name }</a></div>
      );
    });
  }

  render() {

    return (
      <div>
        <div className="full-row-header">
          <i style={{color: '#fff'}}>Current categories:</i> { this.renderCatList() }
        </div>
      </div>
    );
  }
}

export default CategoryList;

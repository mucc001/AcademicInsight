import React from 'react';
import SelectAsync from 'react-select/lib/Async';
import { withRouter } from 'react-router-dom';

import graphQLFetch from './graphQLFetch.js';
import withToast from './withToast.jsx';

class Search extends React.Component {
  constructor(props) {
    super(props);
    this.onChangeSlection = this.onChangeSelection.bind(this);
    this.loadOptions = this.loadOptions.bind(this);
  }

  onChangeSelection = ({ value }) => {
    const { history } = this.props;
    history.push(`/view/${value}`);
  }

  async loadOptions(term) {
    if (term.length < 0) return [];
    const query = `query reviewList($search: String) {
      reviewList(search: $search) {
        reviews {id courseName reviewer}
      }
    }`;

    const { showError } = this.props;
    const data = await graphQLFetch(query, { search: term }, showError);
    return data.reviewList.reviews.map(review => ({
      label: `${review.reviewer}: ${review.courseName}`, value: review.id,
    }));
  }

  render() {
    return (
      <SelectAsync
        instanceId="search-select"
        value=""
        loadOptions={this.loadOptions}
        filterOption={() => true}
        onChange={this.onChangeSelection}
        components={{ DropdownIndicator: null }}
      />
    );
  }
}

export default withRouter(withToast(Search));

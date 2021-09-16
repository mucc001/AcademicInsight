import React from 'react';
import URLSearchParams from 'url-search-params';
import { Pagination } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';

import ReviewTable from './ReviewTable.jsx';
import graphQLFetch from './graphQLFetch.js';
import withToast from './withToast.jsx';
import store from './store.js';

const SECTION_SIZE = 5;

function PageLink({
  params, page, activePage, children,
}) {
  params.set('page', page);
  if (page === 0) return React.cloneElement(children, { disabled: true });
  return (
    <LinkContainer
      isActive={() => page === activePage}
      to={{ search: `?${params.toString()}` }}
    >
      {children}
    </LinkContainer>
  );
}

class ReviewList extends React.Component {
  static async fetchData(match, search, showError) {
    const params = new URLSearchParams(search);
    const vars = { hasSelection: false, selectedId: 0 };

    const { params: { id } } = match;
    const idInt = parseInt(id, 10);
    if (!Number.isNaN(idInt)) {
      vars.hasSelection = true;
      vars.selectedId = idInt;
    }

    let page = parseInt(params.get('page'), 10);
    if (Number.isNaN(page)) page = 1;
    vars.page = page;

    const query = `query reviewList(
      $hasSelection: Boolean!
      $selectedId: Int!
      $page: Int
    ) {
      reviewList(
        page: $page
      ){
        reviews {
          id title courseName reviewer courseDate answer2
        }
        pages
      }
      review(id: $selectedId) @include (if : $hasSelection) {
        id answer2
      }
    }`;
    const data = await graphQLFetch(query, vars, showError);
    return data;
  }

  constructor() {
    super();
    const initialData = store.initialData || { reviewList: {} };
    const {
      reviewList: { reviews, pages }, review: selectedReview,
    } = initialData;
    delete store.initialData;
    this.state = {
      reviews,
      selectedReview,
      pages,
    };
    this.deleteReview = this.deleteReview.bind(this);
  }

  componentDidMount() {
    const { reviews } = this.state;
    if (reviews == null) this.loadData();
  }

  componentDidUpdate(prevProps) {
    const {
      location: { search: prevSearch },
      match: { params: { id: prevId } },
    } = prevProps;
    const { location: { search }, match: { params: { id } } } = this.props;
    if (prevSearch !== search || prevId !== id) {
      this.loadData();
    }
  }

  async loadData() {
    const { location: { search }, match, showError } = this.props;
    const data = await ReviewList.fetchData(match, search, this.showError);
    if (data) {
      this.setState({
        reviews: data.reviewList.reviews,
        selectedReview: data.review,
        pages: data.reviewList.pages,
      });
    }
  }

  async deleteReview(index) {
    const query = `mutation reviewDelete($id: Int!) {
      reviewDelete(id: $id)
    }`;
    const { reviews } = this.state;
    const { location: { pathname, search }, history } = this.props;
    const { id } = reviews[index];
    const data = await graphQLFetch(query, { id }, this.showError);
    if (data && data.reviewDelete) {
      this.setState((prevState) => {
        const newList = [...prevState.reviews];
        if (pathname === `/reviews/${id}`) {
          history.push({ pathname: '/reviews', search });
        }
        newList.splice(index, 1);
        return { reviews: newList };
      });
      this.showSuccess(`Deleted review ${id} successfully.`);
    } else {
      this.loadData();
    }
  }

  render() {
    const { reviews } = this.state;
    if (reviews == null) return null;
    const { selectedReview, pages } = this.state;
    const { location: { search } } = this.props;

    const params = new URLSearchParams(search);
    let page = parseInt(params.get('page'), 10);
    if (Number.isNaN(page)) page = 1;

    const startPage = Math.floor((page - 1) / SECTION_SIZE) * SECTION_SIZE + 1;
    const endPage = startPage + SECTION_SIZE - 1;
    const prevSection = startPage === 1 ? 0 : startPage - SECTION_SIZE;
    const nextSection = endPage >= pages ? 0 : startPage + SECTION_SIZE;

    const items = [];
    for (let i = startPage; i <= Math.min(endPage, pages); i += 1) {
      params.set('page', i);
      items.push((
        <PageLink key={i} params={params} activePage={page} page={i}>
          <Pagination.Item>{i}</Pagination.Item>
        </PageLink>
      ));
    }

    return (
      <React.Fragment>
        <ReviewTable
          reviews={reviews}
          deleteReview={this.deleteReview}
        />
        <Pagination>
          <PageLink params={params} page={prevSection}>
            <Pagination.Item>{'<'}</Pagination.Item>
          </PageLink>
          {items}
          <PageLink params={params} page={nextSection}>
            <Pagination.Item>{'>'}</Pagination.Item>
          </PageLink>
        </Pagination>
      </React.Fragment>
    );
  }
}

const ReviewListWithToast = withToast(ReviewList);
ReviewListWithToast.fetchData = ReviewList.fetchData;

export default ReviewListWithToast;

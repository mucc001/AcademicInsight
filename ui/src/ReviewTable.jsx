import React from 'react';
import { withRouter } from 'react-router-dom';
import { LinkContainer } from 'react-router-bootstrap';
import {
  Button, Glyphicon, Tooltip, OverlayTrigger, Table,
} from 'react-bootstrap';
import UserContext from './UserContext.js';

// eslint-disable-next-line react/prefer-stateless-function
class ReviewRowPlain extends React.Component {
  render() {
    const {
      review, location: { search }, deleteReview, index,
    } = this.props;
    const user = this.context;
    const disabled = !user.signedIn;

    const selectLocation = { pathname: `/reviews/${review.id}`, search };
    const editTooltip = (
      <Tooltip id="close-tooltip" placement="top">View Details</Tooltip>
    );
    // const deleteTooltip = (
    //   <Tooltip id="delete-tooltip" placement="top">Delete Review</Tooltip>
    // );

    function onDelete(e) {
      e.preventDefault();
      deleteReview(index);
    }

    const tableRow = (
      <tr>
        {/* <td>{review.id}</td> */}
        <td>{review.courseName}</td>
        <td>{review.reviewer}</td>
        <td>{review.courseDate ? review.courseDate.toDateString() : ''}</td>
        <td>{review.title}</td>
        <td>
          <LinkContainer to={`/view/${review.id}`}>
            <OverlayTrigger delayShow={1000} overlay={editTooltip}>
              <Button bsSize="xsmall">
                <Glyphicon glyph="sunglasses" />
              </Button>
            </OverlayTrigger>
          </LinkContainer>
        </td>
      </tr>
    );

    return (
      <LinkContainer to={selectLocation}>
        {tableRow}
      </LinkContainer>
    );
  }
}

ReviewRowPlain.contextType = UserContext;
const ReviewRow = withRouter(ReviewRowPlain);
delete ReviewRow.contextType;

export default function ReviewTable({ reviews, deleteReview }) {
  const reviewRows = reviews.map((review, index) => (
    <ReviewRow
      key={review.id}
      review={review}
      deleteReview={deleteReview}
      index={index}
    />
  ));

  return (
    <Table bordered condensed hover responsive>
      <thead>
        <tr>
          {/* <th>ID</th> */}
          <th>CourseName</th>
          <th>Professor</th>
          <th>Semester</th>
          <th>Title</th>
          <th>Details</th>
        </tr>
      </thead>
      <tbody>
        {reviewRows}
      </tbody>
    </Table>
  );
}

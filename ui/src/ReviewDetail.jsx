import React from 'react';
import { Link } from 'react-router-dom';
import { LinkContainer } from 'react-router-bootstrap';
import {
  Col, Panel, Form, FormGroup, FormControl, ControlLabel,
  ButtonToolbar, Button, Alert,
} from 'react-bootstrap';
import withToast from './withToast.jsx';
import store from './store.js';

import graphQLFetch from './graphQLFetch.js';
import DateInput from './DateInput.jsx';
import TextInput from './TextInput.jsx';
import UserContext from './UserContext.js';

class ReviewEdit extends React.Component {
  static async fetchData(match, search, showError) {
    const query = `query review($id: Int!) {
      review(id: $id) {
        id
        courseName
        createdDate
        reviewer
        courseDate
        title
        answer1
        answer2
        answer3
        answer4
        additional
      }
    }`;

    const { params: { id } } = match;
    const result = await graphQLFetch(query, { id }, showError);
    return result;
  }

  constructor() {
    super();
    const review = store.initialData ? store.initialData.review : null;
    delete store.initialData;
    this.state = {
      review,
      invalidFields: {},
      showingValidation: false,
    };
    this.onChange = this.onChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.onValidityChange = this.onValidityChange.bind(this);
  }

  componentDidMount() {
    const { review } = this.state;
    if (review == null) this.loadData();
  }

  componentDidUpdate(prevProps) {
    const { match: { params: { id: prevId } } } = prevProps;
    const { match: { params: { id } } } = this.props;
    if (id !== prevId) {
      this.loadData();
    }
  }

  onChange(event, naturalValue) {
    const { name, value: textValue } = event.target;
    const value = naturalValue === undefined ? textValue : naturalValue;
    this.setState(prevState => ({
      review: { ...prevState.review, [name]: value },
    }));
  }

  onValidityChange(event, valid) {
    const { name } = event.target;
    this.setState((prevState) => {
      const invalidFields = { ...prevState.invalidFields, [name]: !valid };
      if (valid) delete invalidFields[name];
      return { invalidFields };
    });
  }

  async handleSubmit(e) {
    e.preventDefault();
    this.showValidation();
    const { review, invalidFields } = this.state;
    if (Object.keys(invalidFields).length !== 0) return;
    const query = `mutation reviewUpdate(
      $id: Int!
      $changes: ReviewUpdateInputs!
    ) {
      reviewUpdate(
        id: $id
        changes: $changes
      ) {
        id
        courseName
        createdDate
        reviewer
        courseDate
        title
        answer1
        answer2
        answer3
        answer4
        additional
      }
    }`;

    const { id, createdDate, ...changes } = review;
    const { showSuccess, showError } = this.props;
    const data = await graphQLFetch(query, { changes, id }, showError);
    if (data) {
      this.setState({ review: data.reviewUpdate });
      showSuccess('Updated review successfully');
    }
  }

  async loadData() {
    const { match, showError } = this.props;
    const data = await ReviewEdit.fetchData(match, null, showError);
    this.setState({ review: data ? data.review : {}, invalidFields: {} });
  }

  showValidation() {
    this.setState({ showingValidation: true });
  }

  dismissValidation() {
    this.setState({ showingValidation: false });
  }

  render() {
    const { review } = this.state;
    if (review == null) return null;

    const { review: { id } } = this.state;
    const { match: { params: { id: propsId } } } = this.props;
    if (id == null) {
      if (propsId != null) {
        return <h3>{`Review with ID ${propsId} not found.`}</h3>;
      }
      return null;
    }

    const { invalidFields, showingValidation } = this.state;
    let validationMessage;
    if (Object.keys(invalidFields).length !== 0 && showingValidation) {
      validationMessage = (
        <Alert bsStyle="danger" onDismiss={this.dismissValidation}>
          Please correct invalid fields before submitting.
        </Alert>
      );
    }
    const { review: { title, reviewer } } = this.state;
    const { review: { courseName, createdDate, courseDate } } = this.state;
    const {
      review: {
        answer1, answer2, answer3, answer4, additional,
      },
    } = this.state;

    const user = this.context;

    return (
      <Panel>
        <Panel.Heading>
          <Panel.Title>{`Viewing review: ${id}`}</Panel.Title>
        </Panel.Heading>
        <Panel.Body>
          <Form horizontal onSubmit={this.handleSubmit}>
            {/* <FormGroup>
              <Col componentClass={ControlLabel} sm={3}>
                Created
              </Col>
              <Col sm={9}>
                <FormControl.Static>
                  {createdDate.toDateString()}
                </FormControl.Static>
              </Col>
            </FormGroup> */}
            <FormGroup>
              <Col componentClass={ControlLabel} sm={3}>Professor</Col>
              <Col sm={9}>
                <FormControl
                  componentClass={TextInput}
                  name="reviewer"
                  value={reviewer}
                  onChange={this.onChange}
                  key={id}
                />
              </Col>
            </FormGroup>
            <FormGroup>
              <Col componentClass={ControlLabel} sm={3}>Title</Col>
              <Col sm={9}>
                <FormControl
                  componentClass={TextInput}
                  name="title"
                  value={title}
                  onChange={this.onChange}
                  key={id}
                />
              </Col>
            </FormGroup>
            <FormGroup>
              <Col componentClass={ControlLabel} sm={3}>CourseName</Col>
              <Col sm={9}>
                <FormControl
                  componentClass={TextInput}
                  size={50}
                  name="courseName"
                  value={courseName}
                  onChange={this.onChange}
                  key={id}
                />
              </Col>
            </FormGroup>
            <FormGroup validationState={
              invalidFields.due ? 'error' : null
            }
            >
              <Col componentClass={ControlLabel} sm={3}>When did you took the course?</Col>
              <Col sm={9}>
                <FormControl
                  componentClass={DateInput}
                  onValidityChange={this.onValidityChange}
                  name="courseDate"
                  value={courseDate}
                  onChange={this.onChange}
                  key={id}
                />
                <FormControl.Feedback />
              </Col>
            </FormGroup>
            <FormGroup>
              <Col componentClass={ControlLabel} sm={3}>How strictly did the professor grade assignments and exams?</Col>
              <Col sm={9}>
                <FormControl
                  componentClass={TextInput}
                  tag="textarea"
                  rows={3}
                  cols={50}
                  name="answer1"
                  value={answer1}
                  // componentClass={NumInput}
                  // name="effort"
                  // value={effort}
                  onChange={this.onChange}
                  key={id}
                />
              </Col>
            </FormGroup>
            <FormGroup>
              <Col componentClass={ControlLabel} sm={3}>How was the workload (for example, was there a lot of reading)?</Col>
              <Col sm={9}>
                <FormControl
                  componentClass={TextInput}
                  tag="textarea"
                  rows={3}
                  cols={50}
                  name="answer2"
                  value={answer2}
                  // componentClass={NumInput}
                  // name="effort"
                  // value={effort}
                  onChange={this.onChange}
                  key={id}
                />
              </Col>
            </FormGroup>
            <FormGroup>
              <Col componentClass={ControlLabel} sm={3}>How much did the professor help you learn?</Col>
              <Col sm={9}>
                <FormControl
                  componentClass={TextInput}
                  tag="textarea"
                  rows={3}
                  cols={50}
                  name="answer3"
                  value={answer3}
                  // componentClass={NumInput}
                  // name="effort"
                  // value={effort}
                  onChange={this.onChange}
                  key={id}
                />
              </Col>
            </FormGroup>
            <FormGroup>
              <Col componentClass={ControlLabel} sm={3}>How much did you enjoy the lectures?</Col>
              <Col sm={9}>
                <FormControl
                  componentClass={TextInput}
                  tag="textarea"
                  rows={3}
                  cols={50}
                  name="answer4"
                  value={answer4}
                  // componentClass={NumInput}
                  // name="effort"
                  // value={effort}
                  onChange={this.onChange}
                  key={id}
                />
              </Col>
            </FormGroup>
            <FormGroup>
              <Col componentClass={ControlLabel} sm={3}>Additional Comments</Col>
              <Col sm={9}>
                <FormControl
                  componentClass={TextInput}
                  tag="textarea"
                  rows={3}
                  cols={50}
                  name="additional"
                  // componentClass={NumInput}
                  // name="effort"
                  value={additional}
                  onChange={this.onChange}
                  key={id}
                />
              </Col>
            </FormGroup>
            <FormGroup>
              {/* <Col smOffset={3} sm={6}>
                <ButtonToolbar>
                  <Button
                    disabled={!user.signedIn}
                    bsStyle="primary"
                    type="submit"
                  >
                    Submit
                  </Button>
                  <LinkContainer to="/reviews">
                    <Button bsStyle="link">Back</Button>
                  </LinkContainer>
                </ButtonToolbar>
              </Col> */}
            </FormGroup>
            <FormGroup>
              <Col smOffset={3} sm={9}>{validationMessage}</Col>
            </FormGroup>
          </Form>
        </Panel.Body>
        <Panel.Footer>
          <Link to={`/view/${id - 1}`}>Prev</Link>
          {' | '}
          <Link to={`/view/${id + 1}`}>Next</Link>
        </Panel.Footer>
      </Panel>
    );
  }
}

ReviewEdit.contextType = UserContext;
const ReviewEditWithToast = withToast(ReviewEdit);
ReviewEditWithToast.fetchData = ReviewEdit.fetchData;

export default ReviewEditWithToast;

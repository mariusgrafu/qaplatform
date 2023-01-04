import axios from "axios";
import React, { useEffect, useState } from "react";
import { Button, Col, Container, Form, InputGroup, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import TimeAgo from 'react-timeago';
import slugify from "slugify";

import { API_URL } from "../constants";
import Avatar from "./Avatar";
import BestAnswerIcon from "./BestAnswerIcon";
import PaginatedList from "./PaginatedList";

import "./Questions.scss";
import User from "./User";

const sortOptions = ["relevance", "newest first", "oldest first"].map(
  (option) => ({
    name: option,
    value: slugify(option),
  })
);

const PAGE_SIZE = 10;

export default function Questions() {
  const [questions, setQuestions] = useState([]);
  const [lastPage, setLastPage] = useState(1);
  const [loading, setLoading] = useState(true);

  const [currentPage, setCurrentPage] = useState(0);
  const [searchText, setSearchText] = useState("");
  const [unansweredOnly, setUnansweredOnly] = useState(true);
  const [sortOption, setSortOption] = useState(sortOptions[0].value);

  useEffect(() => {
    axios
      .get(`${API_URL}/questions`, {
        params: {
          searchText,
          unansweredOnly,
          sortOption,
          currentPage,
          pageSize: PAGE_SIZE,
        },
      })
      .then(({ data }) => {
        if (data.success) {
          setQuestions(data.questions);
          setLastPage(Math.ceil(data.questionsCount / PAGE_SIZE) - 1);
          setLoading(false);
        }
      });
  }, [currentPage, searchText, unansweredOnly, sortOption]);

  const onSortOptionChange = (event) => {
    setSortOption(event.target.value);
  };

  const onUnansweredOnlyChange = (event) => {
    setUnansweredOnly(event.target.checked);
    setCurrentPage(0);
  };

  const onSearchFormSubmit = (event) => {
    event.preventDefault();

    setSearchText(event.target.search.value.trim());
    setCurrentPage(0);
  };

  const onPageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const renderQuestion = (question) => {
    return <QuestionItem key={question._id} question={question} />;
  };

  return (
    <Container fluid="lg" className="questions-container">
      <div className="title-wrap d-flex">
        <h4 className="page-title">Questions</h4>
        <Link to="/new-question">
          <Button variant="primary">Ask question</Button>
        </Link>
      </div>
      <Row className="filter-wrap d-flex align-items-center" md="3" sm="1">
        <Col className="search-form-col mb-3">
          <Form className="search-form d-flex" onSubmit={onSearchFormSubmit}>
            <InputGroup>
              <Form.Control
                type="search"
                placeholder="Search..."
                aria-label="Search..."
                name="search"
              />
              <Button type="submit" variant="outline-primary">Search</Button>
            </InputGroup>
          </Form>
        </Col>
        <Col className="d-flex align-items-center mb-3" md="3" sm="4">
          <InputGroup className="d-flex align-items-center">
            <InputGroup.Text className="text-nowrap">Sort by</InputGroup.Text>
            <Form.Select value={sortOption} onChange={onSortOptionChange}>
              {sortOptions.map((sortOption) => (
                <option value={sortOption.value} key={sortOption.value}>
                  {sortOption.name}
                </option>
              ))}
            </Form.Select>
          </InputGroup>
        </Col>
        <Col className="mb-3 d-flex align-items-center" md="2" sm="3">
          <Form.Check
            id="onlyUnanswered"
            type="switch"
            label="Only unanswered"
            checked={unansweredOnly}
            onChange={onUnansweredOnlyChange}
            className="d-flex align-items-center" style={{gap: '10px'}}
          />
        </Col>
      </Row>

      <PaginatedList
        items={questions}
        renderItem={renderQuestion}
        currentPage={currentPage}
        lastPage={lastPage}
        onPageChange={onPageChange}
        emptyMessage={"No questions found. Maybe you should ask one!"}
        loading={loading}
      />
    </Container>
  );
}

export function QuestionItem({ question }) {
  return <div className="Question-item">
    <Link to={`/question/${question._id}`} className="title mb-2">
    <h5>{question.isAnswered ? (<BestAnswerIcon className="me-2" />) : null}{question.title}</h5>
    </Link>
    <div className="description mb-3">{question.plainTextDescription}</div>
    <div className="author-section">
      Asked by&nbsp;<User user={question.author} />,&nbsp;<TimeAgo date={question.date} />
    </div>
  </div>;
}

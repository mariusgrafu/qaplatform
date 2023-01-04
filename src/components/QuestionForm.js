import axios from "axios";
import classNames from "classnames";
import React, { useEffect, useState } from "react";
import { Button, Container, Form } from "react-bootstrap";
import { Link, useNavigate, useParams } from "react-router-dom";
import { API_URL } from "../constants";
import { useAuth } from "../contexts/AuthContext";
import FormMarkdown from "./FormMarkdown";

export default function QuestionForm() {
  const { currentUser } = useAuth();
  const { questionId } = useParams();

  const navigate = useNavigate();

  const [questionData, setQuestionData] = useState({
    title: "",
    description: "",
  });
  const [errorsMap, setErrorsMap] = useState({});

  useEffect(() => {
    if (questionId) {
      axios.get(`${API_URL}/question/${questionId}`).then(({ data }) => {
        if (data.success) {
          if (data.question.author.uid !== currentUser.uid) {
            navigate(`/question/${questionId}`);
          }
          setQuestionData({
            title: data.question.title,
            description: data.question.description,
          });
        }
      });
    }
  }, [questionId, currentUser, navigate]);

  const onValueChange = (event) => {
    questionData[event.target.name] = event.target.value;
    setQuestionData({ ...questionData });
  };

  const onSubmit = (event) => {
    event.preventDefault();

    currentUser.getIdToken().then((token) => {
      const authHeader = {
        headers: { Authorization: `Bearer ${token}` },
      };
      if (questionId) {
        axios
          .put(`${API_URL}/question/${questionId}`, questionData, authHeader)
          .then(({ data }) => {
            if (data.success) {
              navigate(`/question/${questionId}`);
            } else {
              setErrorsMap(data.errors || {});
            }
          });
      } else {
        axios
          .post(`${API_URL}/question`, questionData, authHeader)
          .then(({ data }) => {
            if (data.success) {
              navigate(`/question/${data.questionId}`);
            } else {
              setErrorsMap(data.errors || {});
            }
          });
      }
    });
  };

  return (
    <Container fluid="lg" className="Question-form">
      <h4 className="special-text mb-4">Ask a Question</h4>

      <Form onSubmit={onSubmit} noValidate className="mb-3">
        <Form.Group className="mb-3">
          <Form.Label>Question</Form.Label>
          <Form.Control
            type="text"
            placeholder="What is your question?"
            value={questionData.title}
            name="title"
            onChange={onValueChange}
            isInvalid={!!errorsMap.title}
          />
          <Form.Control.Feedback type="invalid">
            {errorsMap.title}
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group className="mb-3" controlId="desc">
          <Form.Label
            className={classNames("mb-0", {
              "is-invalid": !!errorsMap.description,
            })}
          >
            Description
          </Form.Label>
          <Form.Control.Feedback type="invalid">
            {errorsMap.description}
          </Form.Control.Feedback>
          <Form.Text muted className="mb-3" as="div">
            Description of your question. Mark-down is supported. Switch to
            Preview to be able to see how your post will actually look when
            posting it.
          </Form.Text>
          <FormMarkdown
            placeholder="Write a good description for your question."
            value={questionData.description}
            name="description"
            onChange={onValueChange}
            isInvalid={!!errorsMap.description}
          />
        </Form.Group>
        <div className="form-btns">
          <Button type="submit" variant="primary" className="me-1">
            Submit
          </Button>
          <Link to={questionId ? `/question/${questionId}` : "/"}>
            <Button variant="secondary">Cancel</Button>
          </Link>
        </div>
      </Form>
    </Container>
  );
}

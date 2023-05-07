import axios from "axios";
import React, { useCallback, useEffect, useState } from "react";
import { Badge, Button, Container } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import { API_URL } from "../constants";
import { useAuth } from "../contexts/AuthContext";
import Answers from "./Answers";
import Markdown from "./Markdown";

import "./QuestionPage.scss";
import User from "./User";

export default function QuestionPage() {
  const { currentUser } = useAuth();
  const { questionId } = useParams();
  const [question, setQuestion] = useState(null);
  
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`${API_URL}/question/${questionId}`).then(({ data }) => {
      if (data.success) {
        setQuestion({ ...data.question, date: new Date(data.question.date) });
      } else {
        navigate('/');
      }
    });
  }, [questionId, navigate]);

  const getEditBtn = useCallback(() => {
    if (!currentUser || currentUser.uid !== question.author.uid) {
      return null;
    }

    return (
      <Link to={`/question/edit/${question._id}`}>
        <Button variant="primary">Edit</Button>
      </Link>
    );
  }, [currentUser, question]);

  if (!question) {
    return null;
  }

  return (
    <Container fluid="lg" className="Question-page">
      <div className="header mb-4">
        <div className="title mb-2">
        <h4 className="special-text">{question.title}</h4>
        {getEditBtn()}
        </div>
      <Badge className="align-self-start mb-3">{question.category.name}</Badge>
        <div className="author-details">
          Asked by&nbsp;
          <User user={question.author} />
          , on&nbsp;
          {question.date.toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "numeric",
            minute: "numeric",
          })}
        </div>
      </div>
      <div className="mb-4">
      <Markdown>{question.description}</Markdown>
      </div>
      <div className="separator mb-4" />

      <Answers question={question} />
    </Container>
  );
}

import React, { useCallback, useEffect, useState } from "react";
import { Accordion, Button, Form } from "react-bootstrap";
import classNames from "classnames";
import axios from "axios";

import "./Answers.scss";
import PaginatedList from "./PaginatedList";
import { useAuth } from "../contexts/AuthContext";
import FormMarkdown from "./FormMarkdown";
import { API_URL } from "../constants";
import User from "./User";
import Markdown from "./Markdown";
import BestAnswerIcon from "./BestAnswerIcon";

const PAGE_SIZE = 10;

export default function Answers({ question }) {
  const [answers, setAnswers] = useState([]);
  const [allAnswersCount, setAllAnswersCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [newAnswerContent, setNewAnswerContent] = useState("");
  const [errorsMap, setErrorsMap] = useState({});
  const [loading, setLoading] = useState(true);

  const { currentUser } = useAuth();

  const fetchAnswers = useCallback(() => {
    axios
      .get(`${API_URL}/answers`, {
        params: {
          questionId: question._id,
          currentPage,
          pageSize: PAGE_SIZE,
        },
      })
      .then(({ data }) => {
        if (data.success) {
          setAnswers(data.answers);
          setAllAnswersCount(data.answersCount);
          setLoading(false);
        }
      });
  }, [question, currentPage]);

  useEffect(() => {
    fetchAnswers();
  }, [question, fetchAnswers]);

  const onNewMessageSubmit = useCallback(
    (event) => {
      event.preventDefault();

      currentUser.getIdToken().then((token) => {
        const authHeader = {
          headers: { Authorization: `Bearer ${token}` },
        };

        axios
          .post(
            `${API_URL}/answer`,
            { questionId: question._id, content: newAnswerContent },
            authHeader
          )
          .then(({ data }) => {
            if (data.success) {
              setErrorsMap({});
              setNewAnswerContent("");
              fetchAnswers();

              setTimeout(() => {
                document
                  .getElementById(`answer-${data.answerId}`)
                  ?.scrollIntoView();
              }, 200);
            } else {
              setErrorsMap(data.errors);
            }
          });
      });
    },
    [currentUser, question, newAnswerContent, fetchAnswers]
  );

  const onBestAnswerClick = (answerId) => {
    currentUser.getIdToken().then((token) => {
      const authHeader = {
        headers: { Authorization: `Bearer ${token}` },
      };

      axios
        .post(
          `${API_URL}/best-answer`,
          { questionId: question._id, answerId },
          authHeader
        )
        .then(({ data }) => {
          if (data.success) {
            fetchAnswers();
          }
        });
    });
  };

  const renderAnswer = (answer) => (
    <Answer
      key={answer._id}
      answer={answer}
      question={question}
      onBestAnswerClick={onBestAnswerClick}
      fetchAnswers={fetchAnswers}
    />
  );

  return (
    <div className="Answers">
      <h6 className="title special-text mb-3">
        Answers <span>({allAnswersCount.toLocaleString()})</span>
      </h6>

      <NewAnswerForm
        value={newAnswerContent}
        setValue={setNewAnswerContent}
        onSubmit={onNewMessageSubmit}
        error={errorsMap.content}
      />

      <PaginatedList
        items={answers}
        renderItem={renderAnswer}
        currentPage={currentPage}
        lastPage={Math.ceil(allAnswersCount / PAGE_SIZE) - 1}
        onPageChange={setCurrentPage}
        emptyMessage={"No answers yet."}
        loading={loading}
      />
    </div>
  );
}

function Answer({ answer, question, onBestAnswerClick, fetchAnswers }) {
  const { currentUser } = useAuth();
  const date = new Date(answer.date);

  const [edit, setEdit] = useState(false);
  const [suggestEdit, setSuggestEdit] = useState(false);
  const [newValue, setNewValue] = useState("");
  const [errorsMap, setErrorsMap] = useState({});

  useEffect(() => {
    if (edit || suggestEdit) {
      setNewValue(answer.content);
    } else {
      setNewValue("");
    }
    setErrorsMap({});
  }, [edit, suggestEdit, answer]);

  const onMessageEditSubmit = useCallback(
    (event) => {
      event.preventDefault();

      currentUser.getIdToken().then((token) => {
        const authHeader = {
          headers: { Authorization: `Bearer ${token}` },
        };

        axios
          .put(
            `${API_URL}/answer`,
            { answerId: answer._id, content: newValue },
            authHeader
          )
          .then(({ data }) => {
            if (data.success) {
              setErrorsMap({});
              setEdit(false);
              fetchAnswers();

              setTimeout(() => {
                document
                  .getElementById(`answer-${data.answerId}`)
                  ?.scrollIntoView();
              }, 200);
            } else {
              setErrorsMap(data.errors);
            }
          });
      });
    },
    [currentUser, answer, newValue, fetchAnswers]
  );

  const onSuggestionSubmit = useCallback(
    (event) => {
      event.preventDefault();

      currentUser.getIdToken().then((token) => {
        const authHeader = {
          headers: { Authorization: `Bearer ${token}` },
        };

        axios
          .post(
            `${API_URL}/suggestion`,
            { answerId: answer._id, content: newValue },
            authHeader
          )
          .then(({ data }) => {
            if (data.success) {
              setErrorsMap({});
              setSuggestEdit(false);
              fetchAnswers();

              setTimeout(() => {
                document
                  .getElementById(`answer-${data.answerId}`)
                  ?.scrollIntoView();
              }, 200);
            } else {
              if (data.errors) {
                setErrorsMap(data.errors);
              } else {
                setSuggestEdit(false);
              }
            }
          });
      });
    },
    [currentUser, answer, newValue, fetchAnswers]
  );

  const onAcceptSuggestionClick = useCallback(
    (suggestionId) => {
      currentUser.getIdToken().then((token) => {
        const authHeader = {
          headers: { Authorization: `Bearer ${token}` },
        };

        axios
          .post(`${API_URL}/accept-suggestion`, { suggestionId }, authHeader)
          .then(({ data }) => {
            if (data.success) {
              fetchAnswers();

              setTimeout(() => {
                document
                  .getElementById(`answer-${data.answerId}`)
                  ?.scrollIntoView();
              }, 200);
            }
          });
      });
    },
    [currentUser, fetchAnswers]
  );

  if (edit) {
    return (
      <NewAnswerForm
        value={newValue}
        setValue={setNewValue}
        onSubmit={onMessageEditSubmit}
        onClose={() => setEdit(false)}
        error={errorsMap.content}
      />
    );
  }

  return (
    <div
      key={answer._id}
      className={classNames(
        "Answer",
        { "is-best-answer": answer.isBestAnswer },
        { "mb-3": answer.isBestAnswer }
      )}
      id={`answer-${answer._id}`}
    >
      <div className="author-details mb-4">
        <div className="answer-details">
          <span>
            <User user={answer.author} avatarSize={40} />,
            {answer.appliedSuggestion ? " originally" : ""} answered on&nbsp;
            {date.toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
              hour: "numeric",
              minute: "numeric",
            })}
          </span>
          {answer.appliedSuggestion ? (
            <span>
              <User user={answer.appliedSuggestion.author} avatarSize={40} />
              &nbsp;suggested edit on&nbsp;
              {new Date(answer.appliedSuggestion.date).toLocaleDateString(
                "en-US",
                {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                  hour: "numeric",
                  minute: "numeric",
                }
              )}
            </span>
          ) : null}
        </div>
        <div className="best-answer-section ms-auto">
          {answer.isBestAnswer ? (
            <div className="best-answer">
              <BestAnswerIcon /> Best Answer
            </div>
          ) : null}
          {answer.author.uid !== currentUser?.uid &&
          question.author.uid === currentUser?.uid ? (
            <Button
              variant="outline-primary"
              onClick={() => onBestAnswerClick(answer._id)}
            >
              <BestAnswerIcon />{" "}
              {answer.isBestAnswer
                ? "Remove as Best Answer"
                : "Mark as Best Answer"}
            </Button>
          ) : null}
        </div>
      </div>
      <div className="separator with-tip mb-4" />
      <div className="content">
        <Markdown>
          {answer.appliedSuggestion
            ? answer.appliedSuggestion.content
            : answer.content}
        </Markdown>
      </div>
      {currentUser ? (
        <div className="options">
          {currentUser.uid === answer.author.uid ? (
            <Button className="p-0" variant="link" onClick={() => setEdit(true)}>
              Edit
            </Button>
          ) : !suggestEdit && currentUser.uid !== question.author.uid ? (
            <Button className="p-0" variant="link" onClick={() => setSuggestEdit(true)}>
              Suggest an edit
            </Button>
          ) : null}
        </div>
      ) : null}
      {suggestEdit ? (
        <NewAnswerForm
          value={newValue}
          setValue={setNewValue}
          isSuggestion={true}
          onSubmit={onSuggestionSubmit}
          onClose={() => setSuggestEdit(false)}
          error={errorsMap.content}
        />
      ) : null}
      {answer.suggestions.length > 0 ? (
        <Accordion>
          <Accordion.Item eventKey="show">
            <Accordion.Header>
              {answer.suggestions.length.toLocaleString()} edit suggestions
            </Accordion.Header>
            <Accordion.Body className="suggestions-container">
              {answer.suggestions.map((suggestion) => {
                const date = new Date(suggestion.date);
                return (
                  <div key={suggestion._id} className="Suggestion">
                    <div className="author-details mb-2">
                      <User user={suggestion.author} avatarSize={40} />,
                      suggested an edit on&nbsp;
                      {date.toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        hour: "numeric",
                        minute: "numeric",
                      })}
                      <div className="ms-auto">
                        {suggestion._id !== answer.appliedSuggestion?._id &&
                        (answer.author.uid === currentUser?.uid ||
                          question.author.uid === currentUser?.uid) ? (
                          <Button
                            variant="outline-primary"
                            onClick={() =>
                              onAcceptSuggestionClick(suggestion._id)
                            }
                          >
                            Accept edit
                          </Button>
                        ) : null}
                      </div>
                    </div>
                    <div className="content">
                      <Markdown>{suggestion.content}</Markdown>
                    </div>
                  </div>
                );
              })}
            </Accordion.Body>
          </Accordion.Item>
        </Accordion>
      ) : null}
      {!answer.isBestAnswer ? <div className="separator mt-1" /> : null}
    </div>
  );
}

function NewAnswerForm({
  value = "",
  setValue = () => {},
  onClose,
  onSubmit = () => {},
  error = null,
  isSuggestion = false,
}) {
  const { currentUser } = useAuth();

  return (
    <Form className="new-answer-container mb-5" onSubmit={onSubmit}>
      <Form.Group>
        <Form.Label
          className={classNames("mb-0", {
            "is-invalid": !!error,
          })}
        >
          {isSuggestion ? "Give a suggestion" : "Give an answer"}
        </Form.Label>
        <Form.Control.Feedback type="invalid">{error}</Form.Control.Feedback>
        <Form.Text className="mb-3" as="div">
          {!currentUser
            ? `You must be logged in to leave ${
                isSuggestion ? "a suggestion" : "an answer"
              }! `
            : ""}
          Markdown is supported.
        </Form.Text>
        <FormMarkdown
          placeholder="Write down your answer"
          value={value}
          minHeight="100px"
          disabled={!currentUser}
          onChange={(event) => setValue(event.target.value)}
          isInvalid={!!error}
        />
      </Form.Group>
      {currentUser ? (
        <>
          <Button className="mt-3" type="submit" variant="primary">
            Submit
          </Button>
          {onClose ? (
            <Button
              className="mt-3 ms-3"
              variant="secondary-outline"
              onClick={onClose}
            >
              Cancel
            </Button>
          ) : null}
        </>
      ) : null}
    </Form>
  );
}

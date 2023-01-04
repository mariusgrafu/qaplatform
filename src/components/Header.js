import React, { useCallback } from "react";
import { Button, Container, Nav, Navbar } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import { useMatch, Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import Logo from "./Logo";

import "./Header.scss";
import Avatar from "./Avatar";

export default function Header() {
  const isLoginPage = !!useMatch("/login");
  const isSignupPage = !!useMatch("/signup");
  const { currentUser, logout } = useAuth();

  const getUserNavMenu = useCallback(() => {
    if (!currentUser) {
      return (
        <div className="user-menu">
          <Link to="/login">
            <Button variant="outline-primary">Log in</Button>
          </Link>
          <Link to="/signup">
            <Button variant="primary">Sign up</Button>
          </Link>
        </div>
      );
    }

    return (
      <div className="user-menu no-select blur-avt-trigger ms-4">
        <span className="display-name">{currentUser.displayName}</span>
        <Avatar displayName={currentUser.displayName} size="40" />
        <Button variant="danger" onClick={logout}>
          Logout
        </Button>
      </div>
    );
  }, [currentUser, logout]);

  const getUserLinks = useCallback(() => {
    if (!currentUser) {
      return null;
    }

    return (
      <LinkContainer to="/me/badges">
        <Nav.Link>My badges</Nav.Link>
      </LinkContainer>
    );
  }, [currentUser]);

  if (isLoginPage || isSignupPage) {
    return null;
  }

  return (
    <div className="Header-wrapper mb-4">
      <Container fluid="lg">
        <Navbar variant="light" expand="lg" className="Header">
          <LinkContainer to="/">
            <Navbar.Brand>
              <Logo />
            </Navbar.Brand>
          </LinkContainer>

          <Navbar.Toggle aria-controls="nav-menu" />
          <Navbar.Collapse id="nav-menu" className="justify-content-end">
            <Nav className="align-items-center">
              <LinkContainer to="/">
                <Nav.Link>Questions</Nav.Link>
              </LinkContainer>
              {getUserLinks()}
              {getUserNavMenu()}
            </Nav>
          </Navbar.Collapse>
        </Navbar>
      </Container>
    </div>
  );
}

import React from "react";
import { Col, Container, Row } from "react-bootstrap";

import "./Footer.scss";
import Logo from "./Logo";

export default function Footer() {
  return (
    <footer className="Footer">
      <Container className="footer-container" fluid="lg">
        <Row className="footer-row" md="2" xs="1">
          <Col>
            <Logo size="60" variant="v2" />
          </Col>
          <div className="footer-text">
            <div className="special-text">
              The most curious website on the Internet
            </div>
            <div>© 2023 QAPlatform. All rights reserved.</div>
          </div>
        </Row>
      </Container>
    </footer>
  );
}

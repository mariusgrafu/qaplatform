import React from "react";
import { Container } from "react-bootstrap";

import "./Footer.scss";
import Logo from "./Logo";

export default function Footer() {
  return (
    <footer className="Footer">
      <Container className="footer-container" fluid="lg">
          <Logo size="60" variant="v2" />
          <div className="footer-text">
          <div className="special-text">
            The most curious website on the Internet
          </div>
          <div>© 2023 QAPlatform. All rights reserved.</div>
          </div>
      </Container>
    </footer>
  );
}

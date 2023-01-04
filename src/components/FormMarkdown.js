import React from "react";
import classNames from "classnames";
import { Form, Tab, Tabs } from "react-bootstrap";

import Markdown from "./Markdown";

const EDIT_TAB = "edit-tab";
const PREVIEW_TAB = "preview-tab";

export default function FormMarkdown({
  value,
  onChange,
  minHeight = "50vh",
  ...props
}) {
  return (
    <Tabs default={EDIT_TAB} className="mb-3">
      <Tab disabled={!!props.disabled} eventKey={EDIT_TAB} title="Edit">
        <Form.Control
          as="textarea"
          value={value}
          onChange={onChange}
          style={{ minHeight }}
          {...props}
        />
      </Tab>
      <Tab disabled={!!props.disabled} eventKey={PREVIEW_TAB} title="Preview">
        <Markdown>{value}</Markdown>
      </Tab>
    </Tabs>
  );
}

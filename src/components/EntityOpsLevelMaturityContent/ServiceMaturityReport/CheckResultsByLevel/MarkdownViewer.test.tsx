import React from "react";
import { render, screen } from "@testing-library/react";
import MarkdownViewer from "./MarkdownViewer";

const LONG_TEXT =
  "This is a longer text that **is** long enough so that the component should truncate it if the truncate flag is set to true.";
const SHORT_TEXT = "This is a text **too short** to truncate.";
const MALICIOUS_TEXT =
  "<b>hello </b><script>alert('nag nag nag');</script><i>how are you</i>";
const TRUNCATED_PARSED_LONG_TEXT =
  /long enough so that the component should truncate it if the tr .../;
const PARSED_LONG_TEXT =
  /long enough so that the component should truncate it if the truncate flag is set to true./;
const PARSED_SHORT_TEXT = /to truncate./;
const PARSED_MALICIOUS_TEXT = "how are you";

describe("MarkdownViewer", () => {
  it("with truncate on when there is stuff to truncate", () => {
    render(<MarkdownViewer value={LONG_TEXT} truncate />);

    expect(screen.getByText(TRUNCATED_PARSED_LONG_TEXT)).toBeInTheDocument();
    expect(screen.getByText("(show more)")).toBeInTheDocument();
  });

  it("with truncate on when there is nothing to truncate", () => {
    render(<MarkdownViewer value={SHORT_TEXT} truncate />);

    expect(screen.getByText(PARSED_SHORT_TEXT)).toBeInTheDocument();
    expect(screen.queryByText("(show more)")).not.toBeInTheDocument();
  });

  it("with truncate off when there is stuff to truncate", () => {
    render(<MarkdownViewer value={LONG_TEXT} truncate={false} />);

    expect(screen.getByText(PARSED_LONG_TEXT)).toBeInTheDocument();
    expect(screen.queryByText("(show more)")).not.toBeInTheDocument();
  });

  it("with truncate off when there is nothing to truncate", () => {
    render(<MarkdownViewer value={SHORT_TEXT} truncate={false} />);

    expect(screen.getByText(PARSED_SHORT_TEXT)).toBeInTheDocument();
    expect(screen.queryByText("(show more)")).not.toBeInTheDocument();
  });

  it("when trying to inject a script", () => {
    render(<MarkdownViewer value={MALICIOUS_TEXT} truncate={false} />);

    expect(screen.getByText(PARSED_MALICIOUS_TEXT)).toBeInTheDocument();
    expect(screen.queryByText("script")).not.toBeInTheDocument();
  });
});

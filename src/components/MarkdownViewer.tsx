/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */

import React from 'react';
import { Marked } from '@ts-stack/markdown';
import DOMPurify from "dompurify";
import {truncate} from "lodash";
import { withTheme } from "@material-ui/core/styles";

type Props = {
  value?: string,
  truncate: boolean,
  theme: any,
}

type State = {
  sanitizedValue: string,
  sanitizedTruncatedValue: string,
  shouldTruncate: boolean,
  truncated: boolean,
};

const TRUNCATE_LENGTH = 100;
const NEWLINE_REGEX = /\r\n|\r|\n/;

class MarkdownViewer extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      sanitizedValue: !!props.value ? this.getDisplayValue(props.value, false) : "",
      sanitizedTruncatedValue: !!props.value ? this.getDisplayValue(props.value, true) : "",
      shouldTruncate: props.truncate && this.getCanTruncate(props.value),
      truncated: true,
    };
  }

  componentDidUpdate(prevProps: Props) {
    if(prevProps.value !== this.props.value || prevProps.truncate !== this.props.truncate) {
      this.setState({
        sanitizedValue: !!this.props.value ? this.getDisplayValue(this.props.value, false) : "",
        sanitizedTruncatedValue: !!this.props.value ? this.getDisplayValue(this.props.value, true) : "",
        shouldTruncate: this.props.truncate && this.getCanTruncate(this.props.value),
        truncated: this.state.truncated,
      });
    }
  }

  getDisplayValue(value: string, doTruncate: boolean) {
    const text = doTruncate ? this.getTruncatedText(value) : value;
    return DOMPurify.sanitize(Marked.parse(text), { ADD_ATTR: ["target"] });
  }

  getToggleText() {
    return this.state.truncated ? "show more" : "show less";
  }

  getDisplayText() {
    return this.isTruncated() ? this.state.sanitizedTruncatedValue : this.state.sanitizedValue;
  }

  getCanTruncate(value: string | undefined) {
    if(!value) return false;
    return (value.length > TRUNCATE_LENGTH || value.split(NEWLINE_REGEX).length > 2);
  }

  isTruncated() {
    return this.state.shouldTruncate && this.state.truncated;
  }

  getTruncatedText(value: string) {
    const result = value
      .split(NEWLINE_REGEX)
      .slice(0, 2)
      .join("\n")
      .concat("\n");
    return `${truncate(result, {
      length: TRUNCATE_LENGTH,
      omission: " ...",
      separator: /,? + \r\n|\r|\n/,
    })}`;
  }

  render() {
    const ret = [<span className="span-markdown" key="markup" dangerouslySetInnerHTML={{ __html: this.getDisplayText() }}/>];
    if (this.state.shouldTruncate) {
      ret.push((
        <span
          className="span-toggle-expansion"
          key="markup-toggle-truncate"
          style={{ color: this.props.theme.palette.link, textDecoration: "underline", cursor: "pointer" }}
          onClick={ () => this.setState({ ...this.state, truncated: !this.state.truncated }) }
        >
          ({this.getToggleText()})
        </span>
      ));
    }
    return ret;
  }
}
export default withTheme(MarkdownViewer);

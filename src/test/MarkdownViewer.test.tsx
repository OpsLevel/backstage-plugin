/* eslint-disable jest/no-conditional-expect */

import React from 'react';
import { mount } from 'enzyme';
import MarkdownViewer from '../components/MarkdownViewer';

const LONG_TEXT = "This is a longer text that **is** long enough so that the component should truncate it if the truncate flag is set to true.";
const SHORT_TEXT = "This is a text **too short** to truncate.";
const MALICIOUS_TEXT = "<b>hello </b><script>alert('nag nag nag');</script><i>how are you</i>";
const TRUNCATED_PARSED_LONG_TEXT = "This is a longer text that is long enough so that the component should truncate it if the tr ...\n";
const PARSED_LONG_TEXT = "This is a longer text that is long enough so that the component should truncate it if the truncate flag is set to true.\n";
const PARSED_SHORT_TEXT = "This is a text too short to truncate.\n";
const PARSED_MALICIOUS_TEXT = "hello how are you\n";

describe('MarkdownViewer', () => {
  it('with truncate on when there is stuff to truncate', () => {
    const wrapper = mount(<MarkdownViewer value={ LONG_TEXT } truncate />);
    expect(wrapper.find("span").length).toEqual(2);
    expect(wrapper.find(".span-markdown").text()).toEqual(TRUNCATED_PARSED_LONG_TEXT);
    expect(wrapper.find(".span-toggle-expansion").text()).toEqual("(show more)")
  });

  it('with truncate on when there is nothing to truncate', () => {
    const wrapper = mount(<MarkdownViewer value={ SHORT_TEXT } truncate />);
    expect(wrapper.find("span").length).toEqual(1);
    expect(wrapper.find(".span-markdown").text()).toEqual(PARSED_SHORT_TEXT);
  });

  it('with truncate off when there is stuff to truncate', () => {
    const wrapper = mount(<MarkdownViewer value={ LONG_TEXT } truncate={ false } />);
    expect(wrapper.find("span").length).toEqual(1);
    expect(wrapper.find(".span-markdown").text()).toEqual(PARSED_LONG_TEXT);
  });

  it('with truncate off when there is nothing to truncate', () => {
    const wrapper = mount(<MarkdownViewer value={ SHORT_TEXT } truncate={ false } />);
    expect(wrapper.find("span").length).toEqual(1);
    expect(wrapper.find(".span-markdown").text()).toEqual(PARSED_SHORT_TEXT);
  });

  it('when trying to inject a script', () => {
    const wrapper = mount(<MarkdownViewer value={ MALICIOUS_TEXT } truncate={ false } />);
    expect(wrapper.find("span").length).toEqual(1);
    expect(wrapper.find(".span-markdown").text()).toEqual(PARSED_MALICIOUS_TEXT);
    expect(wrapper.find(".span-markdown").html()).not.toContain("script");
  });
});

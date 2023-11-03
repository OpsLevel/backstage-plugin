import React from 'react';
import { mount } from 'enzyme';
import { CheckResultDetails } from '../components/CheckResultDetails';
import { CheckResult } from '../types/OpsLevelData';

describe('CheckResultDetail', () => { 
  const CHECK_RESULT = {
    "message":"This check has status failed.",
    "warnMessage":"Something went wrong",
    "createdAt":"2023-05-11T20:47:53.869313Z",
    "check":{
      "id":"1",
      "type":"generic",
      "enableOn":null,
      "name":"Status: failed",
      "category":{
        "id": "id_1",
        "name":"Service Ownership"
      },
    },
    "status":"failed"
  };

  const getWrapper = (checkResult: CheckResult, combinedStatus: string) => mount(
    <CheckResultDetails
      checkResult={checkResult}
      combinedStatus={combinedStatus}
    />
  );

  it('expands upcoming failing tests', () => {
    const wrapper = getWrapper(CHECK_RESULT, "upcoming_failed");
    expect(wrapper.find("div.MuiPaper-root.Mui-expanded").length).toBeGreaterThan(0);
  });

  it('expands failing tests', () => {
    const wrapper = getWrapper(CHECK_RESULT, "failed");
    expect(wrapper.find("div.MuiPaper-root.Mui-expanded").length).toBeGreaterThan(0);
  });

  it('does not expand passing tests', () => {
    const wrapper = getWrapper(CHECK_RESULT, "passed");
    expect(wrapper.find("div.MuiPaper-root.Mui-expanded").length).toBe(0);
  });
});

import React from 'react';
import { mount } from 'enzyme';
import { CheckResultsByLevel } from '../components/CheckResultsByLevel';
import { LevelCheckResults } from '../types/OpsLevelData';


describe('OverallMaturityOverview', () => {
  const checkResultsByLevelData = [
    {
      "level":{
        "index":1,
        "name":"Bronze"
      },
      "items":{
        "nodes":[
          {
            "message":"This check has status failed.",
            "warnMessage":"Something went wrong",
            "createdAt":"2023-05-11T20:47:53.869313Z",
            "check":{
              "id":"1",
              "type":"generic",
              "enableOn":null,
              "name":"Status: failed",
              "category":{
                "name":"Service Ownership"
              },
            },
            "status":"failed"
          }
        ]
      }
    },
    {
      "level":{
        "index":3,
        "name":"Gold"
      },
      "items":{
        "nodes":[
          {
            "message":"This check has status pending.",
            "warnMessage":null,
            "createdAt":"2023-05-11T20:47:53.869313Z",
            "check":{
              "id":"2",
              "type":"custom",
              "enableOn":null,
              "name":"Status: pending",
              "category":{
                "name":"Service Ownership"
              },
            },
            "status":"pending"
          },
          {
            "message":"This check has status passed.",
            "warnMessage":null,
            "createdAt":"2023-05-11T20:47:53.869313Z",
            "check":{
              "id":"3",
              "type":"manual",
              "enableOn":null,
              "name":"Status: passed",
              "category": null,
            },
            "status":"passed"
          }
        ]
      }
    },
    {
      "level":{
        "index":4,
        "name":"very long level name"
      },
      "items":{
        "nodes":[
          {
            "message":"This check has status upcoming_failed.",
            "warnMessage":null,
            "createdAt":"2023-05-11T20:47:53.869313Z",
            "check":{
              "id":"4",
              "type":"generic",
              "enableOn":"2023-05-11T20:47:53.869313Z",
              "name":"Status: upcoming_failed",
              "category":{
                "name":"Service Ownership"
              },
            },
            "status":"failed"
          },
          {
            "message":"This check has status upcoming_pending.",
            "warnMessage":null,
            "createdAt":"2023-05-11T20:47:53.869313Z",
            "check":{
              "id":"5",
              "type":"manual",
              "enableOn":"2023-05-11T20:47:53.869313Z",
              "name":"Status: upcoming_pending",
              "category":{
                "name":"Service Ownership"
              },
            },
            "status":"pending"
          },
          {
            "message":"This check has status upcoming_passed.",
            "warnMessage":null,
            "createdAt":"2023-05-11T20:47:53.869313Z",
            "check":{
              "id":"6",
              "type":"manual",
              "enableOn":"2023-05-11T20:47:53.869313Z",
              "name":"Status: upcoming_passed",
              "category":{
                "name":"Service Ownership"
              },
            },
            "status":"passed"
          }
        ]
      }
    },
    {
      "level":{
        "index":5,
        "name":"and another one"
      },
      "items":{
        "nodes":[
             
        ]
      }
    }
  ];

  const getWrapper = (data: Array<LevelCheckResults>, totalChecks: number, passingChecks: number) => mount(
    <CheckResultsByLevel
      checkResultsByLevel={data}
      totalChecks={totalChecks}
      totalPassingChecks={passingChecks}
    />
  );

  it('renders the header check correctly when things make sense', () => {
    const wrapper = getWrapper(checkResultsByLevelData, 4, 2);

    const totalChecksCounter = wrapper.find("div.BackstageInfoCard-subheader-13");
    expect(totalChecksCounter.length).toEqual(1);
    expect(totalChecksCounter.at(0).text()).toEqual("Total Checks Passing: 2 / 4 (50%)")
  });

  it('renders the header check correctly when things do not make sense', () => {
    const wrapper = getWrapper(checkResultsByLevelData, 0, -7);

    const totalChecksCounter = wrapper.find("div.BackstageInfoCard-subheader-13");
    expect(totalChecksCounter.length).toEqual(1);
    expect(totalChecksCounter.at(0).text()).toEqual("Total Checks Passing: -7 / 0 (100%)")
  });

  it('renders the appropriate number of accordion elements', () => {
    const wrapper = getWrapper(checkResultsByLevelData, 4, 2);

    const checkSummaries = wrapper.find("div.MuiAccordionSummary-root");
    expect(checkSummaries.length).toEqual(10); // 4 levels + 6 checks
  });

  it('renders the right level headers', () => {    
    const wrapper = getWrapper(checkResultsByLevelData, 4, 2);

    const checkSummaries = wrapper.find("div.MuiAccordionSummary-root");

    const bronzeLevelHeader = checkSummaries.at(0);
    const bronzeLevelHeaderParagraphs = bronzeLevelHeader.find("p");
    expect(bronzeLevelHeaderParagraphs.length).toEqual(3);
    expect(bronzeLevelHeaderParagraphs.at(0).text()).toEqual("Bronze (1)");
    expect(bronzeLevelHeaderParagraphs.at(1).text()).toEqual("1"); // failed counter
    expect(bronzeLevelHeaderParagraphs.at(2).text()).toEqual("0"); // passed counter

    const goldLevelHeader = checkSummaries.at(2);
    const goldLevelHeaderParagraphs = goldLevelHeader.find("p")
    expect(goldLevelHeaderParagraphs.length).toEqual(4);
    expect(goldLevelHeaderParagraphs.at(0).text()).toEqual("Gold (2)");
    expect(goldLevelHeaderParagraphs.at(1).text()).toEqual("1"); // pending counter
    expect(goldLevelHeaderParagraphs.at(2).text()).toEqual("0"); // failed counter
    expect(goldLevelHeaderParagraphs.at(3).text()).toEqual("1"); // passed counter

    const longLevelHeader = checkSummaries.at(5);
    const longLevelHeaderParagraphs = longLevelHeader.find("p");
    expect(longLevelHeaderParagraphs.length).toEqual(4);
    expect(longLevelHeaderParagraphs.at(0).text()).toEqual("very long level name (3)");
    expect(longLevelHeaderParagraphs.at(1).text()).toEqual("3"); // pending counter
    expect(longLevelHeaderParagraphs.at(2).text()).toEqual("0"); // failed counter
    expect(longLevelHeaderParagraphs.at(3).text()).toEqual("0"); // passed counter

    const anotherLevelHeader = checkSummaries.at(9);
    const anotherLevelHeaderParagraphs = anotherLevelHeader.find("p");
    expect(anotherLevelHeaderParagraphs.length).toEqual(3);
    expect(anotherLevelHeaderParagraphs.at(0).text()).toEqual("and another one (0)");
    expect(anotherLevelHeaderParagraphs.at(1).text()).toEqual("0"); // failed counter
    expect(anotherLevelHeaderParagraphs.at(2).text()).toEqual("0"); // passed counter
  });
    
  it('renders a failing check appropriately', () => {  
    const wrapper = getWrapper(checkResultsByLevelData, 4, 2);
    
    const checkCandidates = wrapper.find("div#accordion-check-1");
    expect(checkCandidates.length).toEqual(1);
    const check = checkCandidates.at(0);
    expect(check.props().style?.backgroundColor).toEqual("#ff000033");
    const checkHeader = check.find("p.MuiTypography-root");
    expect(checkHeader.length).toEqual(1);
    expect(checkHeader.at(0).text()).toEqual("Status: failed • Service Ownership check");
    expect(checkHeader.at(0).props().className).toContain("coloredText");
    const checkSubheader = checkHeader.find("span");
    expect(checkSubheader.length).toEqual(1);
    expect(checkSubheader.at(0).text()).toEqual(" • Service Ownership check");
    expect(checkSubheader.at(0).props().className).toContain("coloredSubtext");
    const checkContents = check.find("div.MuiAccordionDetails-root");
    expect(checkContents.length).toEqual(1);
    expect(checkContents.at(0).find(".p-will-be-enabled").props().hidden).toBe(true);
    expect(checkContents.at(0).find(".p-check-message MarkdownViewer").props().value).toEqual("**Error**:\nThis check has status failed.");
    expect(checkContents.at(0).find(".p-check-message MarkdownViewer").prop<boolean>("truncate")).toBe(false);
    expect(checkContents.at(0).find(".span-warn-message").length).toEqual(1);
    expect(checkContents.at(0).find(".span-warn-message .p-unable-parse").text()).toEqual("We were unable to fully parse the result message due to the following Liquid errors:");
    expect(checkContents.at(0).find(".span-warn-message MarkdownViewer").props().value).toEqual("<code>Something went wrong</code>");
    expect(checkContents.at(0).find(".span-warn-message MarkdownViewer").prop<boolean>("truncate")).toBe(true);
    expect(checkContents.at(0).find(".span-warn-message .p-unable-parse-following").text()).toEqual("We were able to parse the following from the message:");
    expect(checkContents.at(0).find(".p-last-updated").text()).toEqual("Last updated: May 11th 2023, 20:47:53 (UTC)");
  });

  it('renders a pending check appropriately', () => {  
    const wrapper = getWrapper(checkResultsByLevelData, 4, 2);

    const checkCandidates = wrapper.find("div#accordion-check-2");
    expect(checkCandidates.length).toEqual(1);
    const check = checkCandidates.at(0);
    expect(check.props().style?.backgroundColor).toEqual("#ffff0033");
    const checkHeader = check.find("p.MuiTypography-root");
    expect(checkHeader.length).toEqual(1);
    expect(checkHeader.at(0).text()).toEqual("Status: pending • Service Ownership check");
    expect(checkHeader.at(0).props().className).toContain("coloredText");
    const checkSubheader = checkHeader.find("span");
    expect(checkSubheader.length).toEqual(1);
    expect(checkSubheader.at(0).text()).toEqual(" • Service Ownership check");
    expect(checkSubheader.at(0).props().className).toContain("coloredSubtext");
    const checkContents = check.find("div.MuiAccordionDetails-root");
    expect(checkContents.length).toEqual(1);
    expect(checkContents.at(0).find(".p-will-be-enabled").props().hidden).toBe(true);
    expect(checkContents.at(0).find(".p-check-message MarkdownViewer").props().value).toEqual("This is a Custom Check that has not been evaluated yet.  It requires an API request to be sent to our Custom Check API.");
    expect(checkContents.at(0).find(".p-check-message MarkdownViewer").prop<boolean>("truncate")).toBe(false);
    expect(checkContents.at(0).find(".span-warn-message").length).toEqual(0);
    expect(checkContents.at(0).find(".p-last-updated").props().hidden).toBe(true);
  });

  it('renders a passed check appropriately', () => {  
    const wrapper = getWrapper(checkResultsByLevelData, 4, 2);

    const checkCandidates = wrapper.find("div#accordion-check-3");
    expect(checkCandidates.length).toEqual(1);
    const check = checkCandidates.at(0);
    expect(check.props().style?.backgroundColor).toEqual("#00ff0033");
    const checkHeader = check.find("p.MuiTypography-root");
    expect(checkHeader.length).toEqual(1);
    expect(checkHeader.at(0).text()).toEqual("Status: passed • Uncategorized check");
    expect(checkHeader.at(0).props().className).toContain("coloredText");
    const checkSubheader = checkHeader.find("span");
    expect(checkSubheader.length).toEqual(1);
    expect(checkSubheader.at(0).text()).toEqual(" • Uncategorized check");
    expect(checkSubheader.at(0).props().className).toContain("coloredSubtext");
    const checkContents = check.find("div.MuiAccordionDetails-root");
    expect(checkContents.length).toEqual(1);
    expect(checkContents.at(0).find(".p-will-be-enabled").props().hidden).toBe(true);
    expect(checkContents.at(0).find(".p-check-message MarkdownViewer").props().value).toEqual("This check has status passed.");
    expect(checkContents.at(0).find(".p-check-message MarkdownViewer").prop<boolean>("truncate")).toBe(false);
    expect(checkContents.at(0).find(".span-warn-message").length).toEqual(0);
    expect(checkContents.at(0).find(".p-last-updated").props().hidden).toBe(false);
    expect(checkContents.at(0).find(".p-last-updated").text()).toEqual("Last updated: May 11th 2023, 20:47:53 (UTC)");
  });

  it('renders an upcoming_failed check appropriately', () => {  
    const wrapper = getWrapper(checkResultsByLevelData, 4, 2);

    const checkCandidates = wrapper.find("div#accordion-check-4");
    expect(checkCandidates.length).toEqual(1);
    const check = checkCandidates.at(0);
    expect(check.props().style?.backgroundColor).toEqual("#00000033");
    const checkHeader = check.find("p.MuiTypography-root");
    expect(checkHeader.length).toEqual(1);
    expect(checkHeader.at(0).text()).toEqual("Status: upcoming_failed • Service Ownership check");
    expect(checkHeader.at(0).props().className).toContain("coloredText");
    const checkSubheader = checkHeader.find("span");
    expect(checkSubheader.length).toEqual(1);
    expect(checkSubheader.at(0).text()).toEqual(" • Service Ownership check");
    expect(checkSubheader.at(0).props().className).toContain("coloredSubtext");
    const checkContents = check.find("div.MuiAccordionDetails-root");
    expect(checkContents.length).toEqual(1);
    const willBeEnabledP = checkContents.at(0).find(".p-will-be-enabled");
    expect(willBeEnabledP.props().hidden).toBe(false);
    expect(willBeEnabledP.childAt(0).text()).toEqual("This check will be enabled on ");
    expect(willBeEnabledP.childAt(1).text()).toEqual("May 11th 2023, 20:47:53");
    expect(willBeEnabledP.childAt(2).text()).toEqual(" (UTC)");
    expect(willBeEnabledP.find(".span-is-failing").props().hidden).toBe(false);
    expect(willBeEnabledP.find(".span-is-failing").text()).toEqual(", but it is currently failing.");
    expect(willBeEnabledP.find(".span-not-evaluated").props().hidden).toBe(true);
    expect(willBeEnabledP.find(".span-is-passing").props().hidden).toBe(true);
    expect(checkContents.at(0).find(".p-check-message MarkdownViewer").props().value).toEqual("**Error**:\nThis check has status upcoming_failed.");
    expect(checkContents.at(0).find(".p-check-message MarkdownViewer").prop<boolean>("truncate")).toBe(false);
    expect(checkContents.at(0).find(".span-warn-message").length).toEqual(0);
    expect(checkContents.at(0).find(".p-last-updated").props().hidden).toBe(false);
    expect(checkContents.at(0).find(".p-last-updated").text()).toEqual("Last updated: May 11th 2023, 20:47:53 (UTC)");
  });

  it('renders an upcoming_pending check appropriately', () => {  
    const wrapper = getWrapper(checkResultsByLevelData, 4, 2);
    const checkCandidates = wrapper.find("div#accordion-check-5");
    expect(checkCandidates.length).toEqual(1);
    const check = checkCandidates.at(0);
    expect(check.props().style?.backgroundColor).toEqual("#00000033");
    const checkHeader = check.find("p.MuiTypography-root");
    expect(checkHeader.length).toEqual(1);
    expect(checkHeader.at(0).text()).toEqual("Status: upcoming_pending • Service Ownership check");
    expect(checkHeader.at(0).props().className).toContain("coloredText");
    const checkSubheader = checkHeader.find("span");
    expect(checkSubheader.length).toEqual(1);
    expect(checkSubheader.at(0).text()).toEqual(" • Service Ownership check");
    expect(checkSubheader.at(0).props().className).toContain("coloredSubtext");
    const checkContents = check.find("div.MuiAccordionDetails-root");
    expect(checkContents.length).toEqual(1);
    const willBeEnabledP = checkContents.at(0).find(".p-will-be-enabled");
    expect(willBeEnabledP.props().hidden).toBe(false);
    expect(willBeEnabledP.childAt(0).text()).toEqual("This check will be enabled on ");
    expect(willBeEnabledP.childAt(1).text()).toEqual("May 11th 2023, 20:47:53");
    expect(willBeEnabledP.childAt(2).text()).toEqual(" (UTC)");
    expect(willBeEnabledP.find(".span-is-failing").props().hidden).toBe(true);
    expect(willBeEnabledP.find(".span-not-evaluated").props().hidden).toBe(false);
    expect(willBeEnabledP.find(".span-not-evaluated").text()).toEqual(", but it has not been evaluated yet.");
    expect(willBeEnabledP.find(".span-is-passing").props().hidden).toBe(true);
    expect(checkContents.at(0).find(".p-check-message MarkdownViewer").props().value).toEqual("This check has status upcoming_pending.");
    expect(checkContents.at(0).find(".p-check-message MarkdownViewer").prop<boolean>("truncate")).toBe(false);
    expect(checkContents.at(0).find(".span-warn-message").length).toEqual(0);
    expect(checkContents.at(0).find(".p-last-updated").props().hidden).toBe(true);
  });

  it('renders an upcoming_passed check appropriately', () => {  
    const wrapper = getWrapper(checkResultsByLevelData, 4, 2);
    const checkCandidates = wrapper.find("div#accordion-check-6");
    expect(checkCandidates.length).toEqual(1);
    const check = checkCandidates.at(0);
    expect(check.props().style?.backgroundColor).toEqual("#00000033");
    const checkHeader = check.find("p.MuiTypography-root");
    expect(checkHeader.length).toEqual(1);
    expect(checkHeader.at(0).text()).toEqual("Status: upcoming_passed • Service Ownership check");
    expect(checkHeader.at(0).props().className).toContain("coloredText");
    const checkSubheader = checkHeader.find("span");
    expect(checkSubheader.length).toEqual(1);
    expect(checkSubheader.at(0).text()).toEqual(" • Service Ownership check");
    expect(checkSubheader.at(0).props().className).toContain("coloredSubtext");
    const checkContents = check.find("div.MuiAccordionDetails-root");
    expect(checkContents.length).toEqual(1);
    const willBeEnabledP = checkContents.at(0).find(".p-will-be-enabled");
    expect(willBeEnabledP.props().hidden).toBe(false);
    expect(willBeEnabledP.childAt(0).text()).toEqual("This check will be enabled on ");
    expect(willBeEnabledP.childAt(1).text()).toEqual("May 11th 2023, 20:47:53");
    expect(willBeEnabledP.childAt(2).text()).toEqual(" (UTC)");
    expect(willBeEnabledP.find(".span-is-failing").props().hidden).toBe(true);
    expect(willBeEnabledP.find(".span-not-evaluated").props().hidden).toBe(true);
    expect(willBeEnabledP.find(".span-is-passing").props().hidden).toBe(false);
    expect(willBeEnabledP.find(".span-is-passing").text()).toEqual(", but it is currently passing.");
    expect(checkContents.at(0).find(".p-check-message MarkdownViewer").props().value).toEqual("This check has status upcoming_passed.");
    expect(checkContents.at(0).find(".p-check-message MarkdownViewer").prop<boolean>("truncate")).toBe(false);
    expect(checkContents.at(0).find(".span-warn-message").length).toEqual(0);
    expect(checkContents.at(0).find(".p-last-updated").props().hidden).toBe(false);
    expect(checkContents.at(0).find(".p-last-updated").text()).toEqual("Last updated: May 11th 2023, 20:47:53 (UTC)");
  });
});

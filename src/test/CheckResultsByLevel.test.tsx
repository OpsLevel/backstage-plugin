import React from 'react';
import { mount } from 'enzyme';
import { CheckResultsByLevel } from '../components/CheckResultsByLevel';
import { LevelCheckResults } from '../types/OpsLevelData';
import { cloneDeep } from 'lodash';


describe('CheckResultsByLevel', () => {
  const checkResultsByLevelData: Array<LevelCheckResults> = [
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
                "id": "id_1",
                "name":"Service Ownership",
                container: {
                  href: "https://example.com",
                },
              },
              owner: null
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
                "id": "id_1",
                "name":"Service Ownership",
                container: {
                  href: "https://example.com",
                },
              },
              owner: null
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
              owner: null
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
                "id": "id_1",
                "name":"Service Ownership",
                container: {
                  href: "https://example.com"
                },
              },
              owner: null
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
                "id": "id_1",
                "name":"Service Ownership",
                container: {
                  href: "https://example.com"
                },
              },
              owner: null
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
                "id": "id_1",
                "name":"Service Ownership",
                container: {
                  href: "https://example.com",
                },
              },
              owner: null
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
  
  it('automatically expands a level if it has pending checks', () => {
    const data = cloneDeep(checkResultsByLevelData);
    data[0].items.nodes[0].status = "passed";
    const wrapper = getWrapper(data, 4, 2);
    const goldHeader = wrapper.find("div#level-accordion-3.Mui-expanded");
    expect(goldHeader.text()).toContain("Gold");
  });
});

/* eslint-disable jest/no-conditional-expect */

import React from 'react';
import { mount } from 'enzyme';
import Scorecard from '../components/Scorecard';


describe('Scorecard', () => {
  const levels = [
    {index: 5, name: "Amazing"},
    {index: 4, name: "Great"},
    {index: 2, name: "Meh"},
    {index: 1, name: "Slightly better"},
    {index: 0, name: "Not so great"},
  ];
  const levelCategories = [
    {level: {name: "Not so great"}, category: {name: "Ownership"}},
    {level: {name: "Slightly better"}, category: {name: "Reliability"}},
    {level: {name: "Meh"}, category: {name: "Observability"}},
    {level: {name: "Great"}, category: {name: "Security"}},
    {level: {name: "Amazing"}, category: {name: "Quality"}},
  ];

  const wrapper = mount(<Scorecard levels={levels} levelCategories={levelCategories}/>);

  it('ensures the scorecard is rendered appropriately', () => {
    const bodyCells = wrapper.find("tbody tr td");
    expect(bodyCells.at(0 * 6).text()).toEqual("Ownership");
    expect(bodyCells.at(1 * 6).text()).toEqual("Reliability");
    expect(bodyCells.at(2 * 6).text()).toEqual("Observability");
    expect(bodyCells.at(3 * 6).text()).toEqual("Security");
    expect(bodyCells.at(4 * 6).text()).toEqual("Quality");

    for(let col = 1; col <= 5; col++) {
      for(let row = 0; row <= 4; row++) {
        const cell = bodyCells.at(row * 6 + col);
        if(row === 0 && col === 1) {
          expect(cell.html()).toContain("background-color: rgb(191, 191, 191)");
          expect(cell.find("div").prop("aria-label")).toEqual("Not so great");
        }
        else if(row === 1 && col === 2) {
          expect(cell.html()).toContain("background-color: rgb(250, 84, 28)");
          expect(cell.find("div").prop("aria-label")).toEqual("Slightly better");
        }
        else if(row === 2 && col === 3) {
          expect(cell.html()).toContain("background-color: rgb(64, 169, 255)");
          expect(cell.find("div").prop("aria-label")).toEqual("Meh");
        }
        else if(row === 3 && col === 4) {
          expect(cell.html()).toContain("background-color: rgb(255, 197, 61)");
          expect(cell.find("div").prop("aria-label")).toEqual("Great");
        } 
        else if(row === 4 && col === 5) {
          expect(cell.html()).toContain("background-color: rgb(19, 194, 194)");
          expect(cell.find("div").prop("aria-label")).toEqual("Amazing");
        }
        else {
          expect(cell.html()).toContain("inactiveField");
          expect(cell.find("div").prop("aria-label")).toBeUndefined();
        }
      }
    }
  });
});

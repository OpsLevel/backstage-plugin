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
    const headerCells = wrapper.find("td");
    expect(headerCells.at(0).html()).toEqual("<td style=\"width: 25%;\">&nbsp;</td>");
    expect(headerCells.at(1).text()).toEqual("Not so great");
    expect(headerCells.at(2).text()).toEqual("Slightly better");
    expect(headerCells.at(3).text()).toEqual("Meh");
    expect(headerCells.at(4).text()).toEqual("Great");
    expect(headerCells.at(5).text()).toEqual("Amazing");
        
    const bodyCells = wrapper.find("tbody tr td");
    expect(bodyCells.at(0 * 6).text()).toEqual("Ownership");
    expect(bodyCells.at(1 * 6).text()).toEqual("Reliability");
    expect(bodyCells.at(2 * 6).text()).toEqual("Observability");
    expect(bodyCells.at(3 * 6).text()).toEqual("Security");
    expect(bodyCells.at(4 * 6).text()).toEqual("Quality");

    for(let col = 1; col <= 5; col++) {
      for(let row = 0; row <= 4; row++) {
        const cell = bodyCells.at(row * 6 + col);
        if(row === 0 && col === 1) expect(cell.html()).toContain("background-color: rgb(191, 191, 191)");
        else if(row === 1 && col === 2) expect(cell.html()).toContain("background-color: rgb(250, 84, 28)");
        else if(row === 2 && col === 3) expect(cell.html()).toContain("background-color: rgb(64, 169, 255)");
        else if(row === 3 && col === 4) expect(cell.html()).toContain("background-color: rgb(255, 197, 61)");
        else if(row === 4 && col === 5) expect(cell.html()).toContain("background-color: rgb(19, 194, 194)");
        else expect(cell.html()).toContain("inactiveField");
      }
    }
  });
});

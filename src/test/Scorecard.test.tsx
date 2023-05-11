/* eslint-disable jest/no-conditional-expect */

import React from 'react';
import { Scorecard } from "../components/Scorecard";
import { mount } from 'enzyme';


describe('Scorecard', () => {
    const levels = [
        {index: 5, name: "Amazing"},
        {index: 4, name: "Great"},
        {index: 3, name: "Okay"},
        {index: 2, name: "Meh"},
        {index: 1, name: "Slightly better"},
        {index: 0, name: "Not so great"},
    ];
    const levelCategories = [
        {level: {name: "Not so great"}, category: {name: "Ownership"}},
        {level: {name: "Slightly better"}, category: {name: "Reliability"}},
        {level: {name: "Meh"}, category: {name: "Observability"}},
        {level: {name: "Okay"}, category: {name: "Scalability"}},
        {level: {name: "Great"}, category: {name: "Security"}},
        {level: {name: "Amazing"}, category: {name: "Quality"}},
    ];

    const wrapper = mount(<Scorecard levels={levels} levelCategories={levelCategories}/>);

    it('test', () => {
        const headerCells = wrapper.find("td");
        expect(headerCells.at(0).html()).toEqual("<td>&nbsp;</td>");
        expect(headerCells.at(1).text()).toEqual("Not so great");
        expect(headerCells.at(2).text()).toEqual("Slightly better");
        expect(headerCells.at(3).text()).toEqual("Meh");
        expect(headerCells.at(4).text()).toEqual("Okay");
        expect(headerCells.at(5).text()).toEqual("Great");
        expect(headerCells.at(6).text()).toEqual("Amazing");
        
        const bodyCells = wrapper.find("tbody tr td");
        expect(bodyCells.at(0 * 7).text()).toEqual("Ownership");
        expect(bodyCells.at(1 * 7).text()).toEqual("Reliability");
        expect(bodyCells.at(2 * 7).text()).toEqual("Observability");
        expect(bodyCells.at(3 * 7).text()).toEqual("Scalability");
        expect(bodyCells.at(4 * 7).text()).toEqual("Security");
        expect(bodyCells.at(5 * 7).text()).toEqual("Quality");

        for(let col = 1; col <= 6; col++) {
            for(let row = 0; row <= 5; row++) {
                const cell = bodyCells.at(row * 7 + col);
                if(row === 0 && col === 1) expect(cell.html()).toContain("background-color: rgb(191, 191, 191)");
                else if(row === 1 && col === 2) expect(cell.html()).toContain("background-color: rgb(250, 84, 28)");
                else if(row === 2 && col === 3) expect(cell.html()).toContain("background-color: rgb(64, 169, 255)");
                else if(row === 3 && col === 4) expect(cell.html()).toContain("background-color: rgb(255, 197, 61)");
                else if(row === 4 && col === 5) expect(cell.html()).toContain("background-color: rgb(19, 194, 194)");
                else if(row === 5 && col === 6) expect(cell.html()).toContain("background-color: rgb(114, 46, 209)");
                else expect(cell.html()).toContain("background-color: rgb(255, 255, 255)");
            }
        }
    });
});

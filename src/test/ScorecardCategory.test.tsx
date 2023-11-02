import React from 'react';
import {render, screen} from '@testing-library/react'
import ScorecardCategory from '../components/ScorecardCategory';


describe('Scorecard Category', () => {
  it('shows the checkbox, name, level, and pie chart', () => {
    const levels = [
      {index: 0, name: "Not so great"},
      {index: 1, name: "Slightly better"},
      {index: 2, name: "Meh"},
      {index: 4, name: "Great"},
      {index: 5, name: "Amazing"},
    ];
    const levelCategory = {level: {name: "Not so great"}, category: {id: "id", name: "Ownership"}, rollsUp: true};

    render(<ScorecardCategory levels={levels} levelCategory={levelCategory} checked onCheckedChange={() => {}}/>)

    expect(screen.getByTestId("checkbox-id")).toBeInTheDocument();
    expect(screen.getByText('Ownership')).toBeInTheDocument();
    expect(screen.getByLabelText('pie-chart')).toBeInTheDocument();
    expect(screen.getByLabelText('level').children).toHaveLength(5);
  });

  it('does not show the pie chart if the scorecard does not roll up', () => {
    const levels = [
      {index: 0, name: "Not so great"},
    ];
    const levelCategory = {level: {name: "Not so great"}, category: {id: "id", name: "Ownership"}, rollsUp: false};

    render(<ScorecardCategory levels={levels} levelCategory={levelCategory} checked onCheckedChange={() => {}}/>)

    expect(() => screen.getByLabelText('pie-chart')).toThrow();
  });

  it('highlights up to the level of the category', () => {
    const levels = [
      {index: 0, name: "Not so great"},
      {index: 2, name: "Meh"},
      {index: 5, name: "Amazing"},
    ];
    const levelCategory = {level: {name: "Meh"}, category: {id: "id", name: "Ownership"}};

    render(<ScorecardCategory levels={levels} levelCategory={levelCategory} checked onCheckedChange={() => {}}/>)

    expect(screen.getByText('Ownership').closest('li')).not.toHaveAttribute('disabled');
    const expectedLevelColors = ["rgb(64, 169, 255)","rgb(64, 169, 255)","rgb(217, 217, 217)"]
    Array.from(screen.getByLabelText('level').children).forEach((element, index) => {
      expect((element as HTMLElement).style.background).toBe(expectedLevelColors[index])
    })
  });

  it('disables items without a level', () => {
    const levels = [
      {index: 0, name: "Not so great"},
      {index: 2, name: "Meh"},
      {index: 5, name: "Amazing"},
    ];
    const levelCategory = {level: null, category: {id: "id", name: "Ownership"}};

    render(<ScorecardCategory levels={levels} levelCategory={levelCategory} checked onCheckedChange={() => {}}/>)

    expect(screen.getByText('Ownership').closest('li')).toHaveAttribute('disabled');
    Array.from(screen.getByLabelText('level').children).forEach((element) => {
      expect((element as HTMLElement).style.background).toBe("rgb(217, 217, 217)")
    })
  });
});

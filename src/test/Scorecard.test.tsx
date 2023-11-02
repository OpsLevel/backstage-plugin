import React from 'react';
import Scorecard from '../components/Scorecard';
import { render, screen } from '@testing-library/react';

describe('Scorecard', () => {
  it('renders rows for each category', () => {
    const levels = [
      {index: 5, name: "Amazing"},
      {index: 4, name: "Great"},
      {index: 2, name: "Meh"},
      {index: 1, name: "Slightly better"},
      {index: 0, name: "Not so great"},
    ];
    const levelCategories = [
      {level: {name: "Not so great"}, category: {id: "id_1", name: "Ownership"}},
      {level: {name: "Slightly better"}, category: {id: "id_2", name: "Reliability"}},
      {level: {name: "Meh"}, category: {id: "id_3", name: "Observability"}},
      {level: {name: "Great"}, category: {id: "id_4", name: "Security"}},
      {level: {name: "Amazing"}, category: {id: "id_5", name: "Quality"}},
    ];
    const title = "Special Scorecard"

    render(<Scorecard levels={levels} levelCategories={levelCategories} title={title} selectedCategoryIds={[]} onCategorySelectionChanged={() => {}}/>)

    levelCategories.forEach(levelCategory=>{
      expect(screen.getByText(levelCategory.category.name)).toBeInTheDocument();
    })
    expect(screen.getByText(title)).toBeInstanceOf(HTMLHeadingElement);
  });

  it('renders header if there is no data', () => {
    const levels = [
      {index: 5, name: "Amazing"},
      {index: 4, name: "Great"},
      {index: 2, name: "Meh"},
      {index: 1, name: "Slightly better"},
      {index: 0, name: "Not so great"},
    ];
    const title = "Another Rubric"

    render(<Scorecard levels={levels} levelCategories={[]} title={title} selectedCategoryIds={[]} onCategorySelectionChanged={() => {}} />)

    expect(screen.getByText(title)).toBeInstanceOf(HTMLHeadingElement);
  });
});

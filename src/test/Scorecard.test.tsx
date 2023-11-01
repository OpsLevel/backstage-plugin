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
      {level: {name: "Not so great"}, category: {name: "Ownership"}},
      {level: {name: "Slightly better"}, category: {name: "Reliability"}},
      {level: {name: "Meh"}, category: {name: "Observability"}},
      {level: {name: "Great"}, category: {name: "Security"}},
      {level: {name: "Amazing"}, category: {name: "Quality"}},
    ];

    render(<Scorecard levels={levels} levelCategories={levelCategories}/>)

    levelCategories.forEach(levelCategory=>{
      expect(screen.getByText(levelCategory.category.name)).toBeInTheDocument();
    })
  });
});

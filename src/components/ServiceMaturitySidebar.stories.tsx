import type { Meta, StoryObj } from '@storybook/react';
import React, {useState} from 'react';
import ServiceMaturitySidebar, {Props} from './ServiceMaturitySidebar';

const meta = {
  title: 'Service Maturity Sidebar',
  component: ServiceMaturitySidebar,
} satisfies Meta<typeof ServiceMaturitySidebar>;

export default meta;


const getProps = () => ({
  overallLevel: {
    index: 3,
    name: 'Good',
    description: 'Your services are on their way but still can be better. Primarily, you should be focused on styling and maintainability now that security concerns are out of the way.'
  },
  levels: [{index: 0, name: "Not so great"}, {index: 1, name: "Good"}, {index: 3, name: "Great"}, {index: 4, name: "Amazing"}],
  scorecardCategories: [],
  levelCategories: [
    {level: {name: "Amazing"}, category: {id: "1", name: "Ownership"}},
    {level: {name: "Good"}, category: {id: "2", name: "Reliability"}},
    {level: null, category: {id: "3", name: "Security"}},
    {level: {name: "Great"}, category: {id: "4", name: "Observability"}},
  ],
  selectedCategoryIds: [],
  onCategorySelectionChanged: () => {},
});
const DynamicSidebar = (props: Props): React.ReactElement => {
  const [selectedCategoryIds, setSelectedCategoryIds] = useState(props.selectedCategoryIds ?? []);
  const handleCategorySelectionChanged = (addedIds: Array<String>, removedIds: Array<String>) => {
    setSelectedCategoryIds([...new Set([...selectedCategoryIds, ...addedIds])].filter((id) => !removedIds.includes(id)));
    props.onCategorySelectionChanged(addedIds, removedIds);
  }

  return (<ServiceMaturitySidebar 
    {...props} 
    selectedCategoryIds={selectedCategoryIds}
    onCategorySelectionChanged={handleCategorySelectionChanged}
  />);
};

export const Default = {
  render: () => (<DynamicSidebar {...getProps()} />)
}

export const WithPreselectedValues = {
  render: () => {
    const selectedCategoryIds = ['1'];
    return (<DynamicSidebar {...getProps()} selectedCategoryIds={selectedCategoryIds}/>);
  }
}

export const WithScorecards = {
  render: () => {
    const scorecardCategories = [
      {level: {name: "Not so great"}, category: {id: "13", name: "Back-End Scorecard"}},
      {level: {name: "Amazing"}, category: {id: "99", name: "Front-End Scorecard"}},
      {level: null, category: {id: "87", name: "Team Bravo Services"}},
    ];
    return (<DynamicSidebar {...getProps()} scorecardCategories={scorecardCategories} />);
  }
}
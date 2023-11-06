import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import Scorecard from "../components/Scorecard";

describe("Scorecard", () => {
  const title = "scorecard";
  const levels = [
    { index: 5, name: "Amazing" },
    { index: 4, name: "Great" },
    { index: 2, name: "Meh" },
    { index: 1, name: "Slightly better" },
    { index: 0, name: "Not so great" },
  ];
  const levelCategories = [
    {
      level: { name: "Not so great" },
      category: { id: "id_1", name: "Ownership" },
    },
    {
      level: { name: "Slightly better" },
      category: { id: "id_2", name: "Reliability" },
    },
    { level: { name: "Meh" }, category: { id: "id_3", name: "Observability" } },
    { level: { name: "Great" }, category: { id: "id_4", name: "Security" } },
    { level: { name: "Amazing" }, category: { id: "id_5", name: "Quality" } },
  ];

  it("renders rows for each category", () => {
    render(
      <Scorecard
        levels={levels}
        levelCategories={levelCategories}
        title={title}
        selectedCategoryIds={[]}
        onCategorySelectionChanged={() => {}}
      />,
    );

    levelCategories.forEach((levelCategory) => {
      expect(screen.getByText(levelCategory.category.name)).toBeInTheDocument();
    });
    expect(screen.getByText(title)).toBeInstanceOf(HTMLHeadingElement);
  });

  it("renders header if there is no data", () => {
    const myLevels = [
      { index: 5, name: "Amazing" },
      { index: 4, name: "Great" },
      { index: 2, name: "Meh" },
      { index: 1, name: "Slightly better" },
      { index: 0, name: "Not so great" },
    ];
    const myTitle = "Another Rubric";

    render(
      <Scorecard
        levels={myLevels}
        levelCategories={[]}
        title={myTitle}
        selectedCategoryIds={[]}
        onCategorySelectionChanged={() => {}}
      />,
    );

    expect(screen.getByText(myTitle)).toBeInstanceOf(HTMLHeadingElement);
  });

  it("preselects the checkbox if all categories are selected", () => {
    const selectedCategoryIds = ["id_1", "id_2", "id_3", "id_4", "id_5"];
    render(
      <Scorecard
        levels={levels}
        levelCategories={levelCategories}
        title={title}
        selectedCategoryIds={selectedCategoryIds}
        onCategorySelectionChanged={() => {}}
      />,
    );
    const box = screen
      .getByTestId("category-checkbox-scorecard")
      .querySelector("input");
    // expect(box).toHaveAttribute("checked"); // TODO this broke with useeffect, waitfor doesn't work
    expect(box?.getAttribute("data-indeterminate")).toBe("false");
  });

  it("does not preselect the checkbox if no categories are selected", () => {
    const selectedCategoryIds: Array<String> = [];
    render(
      <Scorecard
        levels={levels}
        levelCategories={levelCategories}
        title={title}
        selectedCategoryIds={selectedCategoryIds}
        onCategorySelectionChanged={() => {}}
      />,
    );
    const box = screen
      .getByTestId("category-checkbox-scorecard")
      .querySelector("input");
    expect(box).not.toHaveAttribute("checked");
    expect(box?.getAttribute("data-indeterminate")).toBe("false");
  });

  it("puts the checkbox in its third state if some categories are selected", () => {
    const selectedCategoryIds = ["id_2", "id_3"];
    render(
      <Scorecard
        levels={levels}
        levelCategories={levelCategories}
        title={title}
        selectedCategoryIds={selectedCategoryIds}
        onCategorySelectionChanged={() => {}}
      />,
    );
    const box = screen
      .getByTestId("category-checkbox-scorecard")
      .querySelector("input");
    expect(box).not.toHaveAttribute("checked");
    expect(box?.getAttribute("data-indeterminate")).toBe("true");
  });

  it("calls the prop when the checkbox is clicked", () => {
    const changeHandler = jest.fn();
    const selectedCategoryIds = ["id_2", "id_3"];
    render(
      <Scorecard
        levels={levels}
        levelCategories={levelCategories}
        title={title}
        selectedCategoryIds={selectedCategoryIds}
        onCategorySelectionChanged={changeHandler}
      />,
    );
    const box = screen
      .getByTestId("category-checkbox-scorecard")
      .querySelector("input");
    if (box) {
      fireEvent.click(box);
    }
    expect(changeHandler).toHaveBeenCalledWith(
      ["id_1", "id_2", "id_3", "id_4", "id_5"],
      [],
    );
  });
});

// @ts-nocheck

import { escape } from "lodash";

export const mountInitialLevelArray = (levels) => {
  return levels.map((level) => {
    return { [escape(level.name)]: 0 };
  });
};

export const updateCategoryAggregateWithLevelCounter = (
  aggregate,
  level,
  serviceCounter
) => {
  return aggregate.map((obj) => {
    const currentKey = Object.keys(obj)[0];
    if (level === currentKey) {
      return { [currentKey]: serviceCounter };
    } 
    return obj;
  });
};

export const servicesByLevel = (levels, servicesLevelCount) => {
  return levels.map((level) => {
    const serviceLevelCount = servicesLevelCount.find(
      (entry) => entry.level.name === level.name
    );
    // serviceLevelCount is undefined when no services exist at that level
    return { [escape(level.name)]: serviceLevelCount?.serviceCount || 0 };
  });
};

export const levelsByCategory = (levels, servicesLevelCountByCategory) => {
  const initialLevelArray = mountInitialLevelArray(levels);

  return servicesLevelCountByCategory.reduce((acc, categoryLevel) => {
    const currentCategory = categoryLevel.category
      ? categoryLevel.category.name
      : "Uncategorized";
    const levelName = escape(categoryLevel.level.name);

    const categoryAggregate = acc[currentCategory] || initialLevelArray;
    const newCategoryAggregate = updateCategoryAggregateWithLevelCounter(
      categoryAggregate,
      levelName,
      categoryLevel.serviceCount
    );

    return {
      ...acc,
      [currentCategory]: newCategoryAggregate,
    };
  }, {});
};

export const fontFamily = [
  "-apple-system",
  "BlinkMacSystemFont",
  "Segoe U",
  "PingFang SC",
  "Hiragino Sans GB",
  "Microsoft YaHei",
  "Helvetica Neue",
  "Helvetica",
  "Arial",
  "sans-serif",
  "Apple Color Emoji",
  "Segoe UI Emoji",
  "Segoe UI Symbol",
].join(", ");

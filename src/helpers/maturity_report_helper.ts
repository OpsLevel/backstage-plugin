import { escape } from "lodash";

interface Level {
  name: string;
  index?: number;
}

interface LevelCount {
  level: {
    name: string;
  };
  serviceCount: number;
}

interface CategoryLevelCount {
  category?: {
    id: string;
    name: string;
  } | null;
  level: {
    name: string;
    index?: number;
  };
  serviceCount: number;
}

type LevelCountObject = Record<string, number>;

export const mountInitialLevelArray = (
  levels: Level[],
): LevelCountObject[] => {
  return levels.map((level) => {
    return { [escape(level.name)]: 0 };
  });
};

export const updateCategoryAggregateWithLevelCounter = (
  aggregate: LevelCountObject[],
  level: string,
  serviceCounter: number,
): LevelCountObject[] => {
  return aggregate.map((obj) => {
    const currentKey = Object.keys(obj)[0];
    if (level === currentKey) {
      return { [currentKey]: serviceCounter };
    }
    return obj;
  });
};

export const servicesByLevel = (
  levels: Level[],
  servicesLevelCount: LevelCount[],
): LevelCountObject[] => {
  return levels.map((level) => {
    const serviceLevelCount = servicesLevelCount.find(
      (entry) => entry.level.name === level.name,
    );
    // serviceLevelCount is undefined when no services exist at that level
    return { [escape(level.name)]: serviceLevelCount?.serviceCount || 0 };
  });
};

export const levelsByCategory = (
  levels: Level[],
  categoryLevelCounts: CategoryLevelCount[],
): Record<string, LevelCountObject[]> => {
  const initialLevelArray = mountInitialLevelArray(levels);

  return categoryLevelCounts.reduce(
    (acc, categoryLevel) => {
      const currentCategory = categoryLevel.category
        ? categoryLevel.category.name
        : "Uncategorized";
      const levelName = escape(categoryLevel.level.name);

      const categoryAggregate = acc[currentCategory] || initialLevelArray;
      const newCategoryAggregate = updateCategoryAggregateWithLevelCounter(
        categoryAggregate,
        levelName,
        categoryLevel.serviceCount,
      );

      return {
        ...acc,
        [currentCategory]: newCategoryAggregate,
      };
    },
    {} as Record<string, LevelCountObject[]>,
  );
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

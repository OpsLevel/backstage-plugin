import { escape } from "lodash";

interface Level {
  name: string;
  index?: number;
}

interface LevelEntry {
  [key: string]: number;
}

interface ServiceLevelCount {
  level: {
    name: string;
  };
  serviceCount: number;
}

interface CategoryLevelCount {
  category?: {
    id?: string;
    name: string;
  } | null;
  level: {
    name: string;
    index?: number;
  };
  serviceCount: number;
}

export const mountInitialLevelArray = (levels: Level[]): LevelEntry[] => {
  return levels.map((level) => {
    return { [escape(level.name)]: 0 };
  });
};

export const updateCategoryAggregateWithLevelCounter = (
  aggregate: LevelEntry[],
  level: string,
  serviceCounter: number,
): LevelEntry[] => {
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
  servicesLevelCount: ServiceLevelCount[],
): LevelEntry[] => {
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
): Record<string, LevelEntry[]> => {
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
    {} as Record<string, LevelEntry[]>,
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

import { escape } from "lodash";
import { Level } from "../types/OpsLevelData";

interface LevelCounter {
  [levelName: string]: number;
}

interface ServiceLevelCount {
  level: {
    name: string;
  };
  serviceCount: number;
}

interface CategoryLevelCount {
  category: {
    name: string;
  } | null;
  level: {
    name: string;
  };
  serviceCount: number;
}

interface CategoryAggregate {
  [categoryName: string]: LevelCounter[];
}

export const mountInitialLevelArray = (levels: Level[]): LevelCounter[] => {
  return levels.map((level) => {
    return { [escape(level.name || "")]: 0 };
  });
};

export const updateCategoryAggregateWithLevelCounter = (
  aggregate: LevelCounter[],
  level: string,
  serviceCounter: number
): LevelCounter[] => {
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
  servicesLevelCount: ServiceLevelCount[]
): LevelCounter[] => {
  return levels.map((level) => {
    const serviceLevelCount = servicesLevelCount.find(
      (entry) => entry.level.name === level.name
    );
    // serviceLevelCount is undefined when no services exist at that level
    return { [escape(level.name || "")]: serviceLevelCount?.serviceCount || 0 };
  });
};

export const levelsByCategory = (
  levels: Level[],
  categoryLevelCounts: CategoryLevelCount[]
): CategoryAggregate => {
  const initialLevelArray = mountInitialLevelArray(levels);

  return categoryLevelCounts.reduce((acc, categoryLevel) => {
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
  }, {} as CategoryAggregate);
};

export const fontFamily: string = [
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

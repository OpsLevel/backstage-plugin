import { Entity } from '@backstage/catalog-model';

export type LevelCategory = {
 level: { name: string } | null; category: { name: string } 
}

export type Level = {
  index: number;
  name: string;
};

export type OverallLevel =  {
  description: string,
  index: number,
  name: string,
}

export interface OpsLevelServiceData {
  account: {
    rubric: {
      levels: {
        nodes: Array<{index: number, name: string}>
      }
    },
    service: {
      htmlUrl: string,
      maturityReport?: {
        overallLevel: OverallLevel,
        categoryBreakdown: Array<LevelCategory>,
      },
      serviceStats: {
        rubric: {
          checkResults: {
            byLevel: {
              nodes: Array<LevelCheckResults>
            }
          }
        }
      },
      checkStats: {
        totalChecks: number,
        totalPassingChecks: number
      }
    }
  }
}

export type LevelCheckResults = {
  level: {
    index: number,
    name: string
  },
  items: {
    nodes: Array<CheckResult>,
  }
}

export type CheckResultStatus = 'failed' | 'pending' | 'passed' | 'upcoming_failed' | 'upcoming_pending' | 'upcoming_passed';

export type CheckResult = {
  message: string,
  warnMessage: string | null,
  createdAt: string,
  check: {
    id: string,
    enableOn: string | null,
    name: string,
    type: string,
    category: {
      name: string
    } | null,
    owner: {
      name: string
    } | null,
  },
  status: CheckResultStatus
}

export interface OpsLevelOverallData {
  account: {
    rubric: {
      levels: {
        nodes: Array<{ index: number, name: string, alias: string }>
      },
      categories: {
        nodes: Array<{ id: string, name: string }>
      }
    },
    servicesReport: {
      totalServicesNotEvaluated: number,
      levelCounts: Array<{ level: { name: string }, serviceCount: number }>,
      categoryLevelCounts: Array<{ category: { name: string }, level: { name: string, index: number }, serviceCount: number }>,
    }
  }
}

export type OpsLevelApi = {
  url: string;
  getServiceMaturityByAlias: (serviceAlias: string) => Promise<any>;
  exportEntity: (entity: Entity) => Promise<any>;
  getServicesReport: () => Promise<any>;
}

export type AutoSyncConfiguration = {
  auto_sync_enabled: boolean;
  auto_sync_schedule: string;
}

export type AutoSyncExecution = {
  id: number;
  trigger: string;
  state: string;
  started_at: string;
  completed_at: string | null;
  output: string;
}

export type OpsLevelBackendApi = {
  url: string;
  isPluginAvailable: () => Promise<boolean>;
  getAutoSyncConfiguration: () => Promise<AutoSyncConfiguration | null>;
  setAutoSyncConfiguration: (configuration: AutoSyncConfiguration) => Promise<boolean>;
  getAutoSyncExecution: (index: number) => Promise<{ total_count: number, rows: Array<AutoSyncExecution> }>;
}

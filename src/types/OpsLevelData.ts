import { Entity } from '@backstage/catalog-model';

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
        overallLevel: Object,
        categoryBreakdown: Array<{
          level: { name: string },
          category: { name: string }
        }>,
      },
      serviceStats: {
        rubric: {
          checkResults: {
            byLevel: {
              nodes: Array<LevelCheckResult>
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

export type LevelCheckResult = {
  level: {
    index: number,
    name: string
  },
  items: {
    nodes: Array<CheckResult>,
  }
}

export type CheckResult = {
  message: string,
  createdAt: string,
  check: {
    id: string,
    enableOn: string | null,
    name: string,
    category: {
      name: string
    },
    owner: {
      name: string
    } | null
  },
  status: string
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

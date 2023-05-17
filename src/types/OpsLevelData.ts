import { Entity } from '@backstage/catalog-model';

export interface OpsLevelData {
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
    status: "passed" | "failed" | "pending"
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
    }
  },
  status: string
}

export type OpsLevelApi = {
  url: string;
  getServiceMaturityByAlias: (serviceAlias: string) => Promise<any>;
  exportEntity: (entity: Entity) => Promise<any>;
}


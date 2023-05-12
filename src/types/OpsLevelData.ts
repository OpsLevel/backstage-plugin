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
      }
    },

  }
}

export type OpsLevelApi = {
  url: string;
  getServiceMaturityByAlias: (serviceAlias: string) => Promise<any>;
  exportEntity: (entity: Entity) => Promise<any>;
}


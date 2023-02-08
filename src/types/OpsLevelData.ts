import { Entity } from '@backstage/catalog-model';

export interface OpsLevelData {
  account: {
    rubric: {
      levels: {
        nodes: Array<Object>
      }
    },
    service: {
      htmlUrl: string,
      maturityReport?: {
        overallLevel: Object
      }
    }
  }
}

export type OpsLevelApi = {
  url: string;
  getServiceMaturityByAlias: (serviceAlias: string) => Promise<any>;
  exportEntity: (entity: Entity) => Promise<any>;
  updateService: (entity: Entity) => Promise<any>;
}


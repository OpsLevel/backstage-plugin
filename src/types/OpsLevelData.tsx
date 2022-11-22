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
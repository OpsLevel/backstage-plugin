import { Entity } from "@backstage/catalog-model";

export type CheckResultStatus =
  | "failed"
  | "pending"
  | "passed";

export type CheckResultStatusWithUpcoming =
  | "failed"
  | "pending"
  | "passed"
  | "upcoming_failed"
  | "upcoming_pending"
  | "upcoming_passed";

export type CheckResult = {
  message: string;
  warnMessage: string | null;
  createdAt: string;
  check: {
    id: string;
    enableOn: string | null;
    isScorecardCheck?: boolean;
    name: string;
    type: string;
    category: {
      id: string;
      name: string;
      container: {
        href: string;
      };
    } | null;
    owner: {
      name: string;
      href: string;
    } | null;
  };
  status: CheckResultStatus;
};

export type LevelCategory = {
  id?: string;
  level: { name: string } | null;
  category: { id: string; name: string };
  rollsUp?: boolean;
};

export type Level = {
  index?: number;
  name?: string;
};

export type LevelCheckResults = {
  level: {
    index: number;
    name: string;
  };
  items: {
    nodes: Array<CheckResult>;
  };
};

export type OverallLevel = {
  description: string;
  index: number;
  name: string;
};

export type ScorecardStats = {
  scorecard?: {
    affectsOverallServiceLevels: boolean;
    id: string;
    name: string;
  };
  categories?: {
    edges?: Array<{
      level?: Level;
      node?: {
        id: string;
        name: string;
      };
    }>;
  };
  checkResults?: {
    byLevel?: {
      nodes?: Array<LevelCheckResults>;
    };
  };
};

export type LevelNode = {
  index: number;
  name: string;
};

export type OpsLevelService = {
  id: string;
  htmlUrl: string;
  maturityReport?: {
    overallLevel: OverallLevel;
    categoryBreakdown: Array<LevelCategory>;
  };
  serviceStats?: {
    scorecards?: {
      nodes?: Array<ScorecardStats>;
    };
    rubric: {
      checkResults: {
        byLevel: {
          nodes: Array<LevelCheckResults>;
        };
      };
    };
  };
  checkStats?: {
    totalChecks: number;
    totalPassingChecks: number;
  };
};

export interface OpsLevelServiceData {
  account: {
    rubric: {
      levels: {
        nodes: Array<LevelNode>;
      };
    };
    service: OpsLevelService;
  };
}

export type CampaignStatus = 'in_progress'|'draft'| 'scheduled'|'delayed'|'ended' 
type ChecksByCampaignStatus = 'passing'|'failing'

export interface ChecksByCampaign  {
  campaign?: {
    owner: {
      id: string;
      name: string;
      href: string;
    } | null;
    id: string;
    name: string;
    href: string;
    startDate: string|null;
    targetDate: string|null;
    endedDate: string|null;
    status:CampaignStatus;
  },
  items?: {
    nodes?: Array<CheckResult>,
  },
  status?: ChecksByCampaignStatus;
  };

export interface CampaignsResponse {
  account: {
    service?: {
      campaignReport?: {
        checkResultsByCampaign?: {
          nodes: Array<ChecksByCampaign>;
        }
      },
  }
};
}

export interface OpsLevelOverallData {
  account: {
    rubric: {
      levels: {
        nodes: Array<{ index: number; name: string; alias: string }>;
      };
      categories: {
        nodes: Array<{ id: string; name: string }>;
      };
    };
    servicesReport: {
      totalServicesNotEvaluated: number;
      levelCounts: Array<{ level: { name: string }; serviceCount: number }>;
      categoryLevelCounts: Array<{
        category: { id: string; name: string };
        level: { name: string; index: number };
        serviceCount: number;
      }>;
    };
  };
}

export type OpsLevelApi = {
  url: string;
  getServiceMaturityByAlias: (serviceAlias: string) => Promise<any>;
  exportEntity: (entity: Entity) => Promise<any>;
  getServicesReport: (includeScorecards: boolean) => Promise<any>;
};

export type AutoSyncConfiguration = {
  auto_sync_enabled: boolean;
  auto_sync_schedule: string;
};

export type AutoSyncExecution = {
  id: number;
  trigger: string;
  state: string;
  started_at: string;
  completed_at: string | null;
  output: string;
};

export type OpsLevelBackendApi = {
  url: string;
  isPluginAvailable: () => Promise<boolean>;
  getAutoSyncConfiguration: () => Promise<AutoSyncConfiguration | null>;
  setAutoSyncConfiguration: (
    configuration: AutoSyncConfiguration,
  ) => Promise<boolean>;
  getAutoSyncExecution: (
    index: number,
  ) => Promise<{ total_count: number; rows: Array<AutoSyncExecution> }>;
};

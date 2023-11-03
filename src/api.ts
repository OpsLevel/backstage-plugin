import { Config } from '@backstage/config';
import { createApiRef } from '@backstage/core-plugin-api';
import { Entity, stringifyEntityRef } from '@backstage/catalog-model';
import { GraphQLClient, gql } from 'graphql-request';
import { OpsLevelApi } from './types/OpsLevelData';

export const opslevelApiRef = createApiRef<OpsLevelApi>({
  id: 'plugin.opslevel.service',
});

const CHECK_RESULT_DETAILS_FRAGMENT = gql`
  fragment checkResultDetailsFragment on ServiceCheckResults {
    byLevel {
      nodes {
        level {
          index
          name
        }
        items {
          nodes {
            message
            warnMessage
            createdAt
            check {
              id
              enableOn
              name
              type
              category {
                name
              }
            }
            status
          }
        }
      }
    }
  }
`;

export class OpsLevelGraphqlAPI implements OpsLevelApi {
  static fromConfig(config: Config) {
    return new OpsLevelGraphqlAPI(config.getString('backend.baseUrl'));
  }

  private client;

  constructor(public url: string) {
    this.client = new GraphQLClient(`${this.url}/api/proxy/opslevel/graphql`);
  }

  getServiceMaturityByAlias(serviceAlias: string) {
    const query = gql`
      query getServiceMaturityForBackstage($alias: String!) {
        account {
          rubric {
            levels {
              nodes {
                index
                name
                description
              }
            }
          }
          service(alias: $alias) {
            htmlUrl
            maturityReport {
              overallLevel {
                index
                name
                description
              }
              categoryBreakdown {
                category {
                  name
                }
                level {
                  name
                }
              }
            }
            serviceStats {
              scorecards(affectsOverallServiceLevels: true) {
                nodes {
                  scorecard {
                    id
                    name
                    affectsOverallServiceLevels
                  }
                  categories {
                    edges {
                      level {
                        id
                        index
                        name
                      }
                      node {
                        id
                        name
                      }
                    }
                  }
                  checkResults {
                    ...checkResultDetailsFragment
                  }
                }
              }
              rubric {
                checkResults {
                  ...checkResultDetailsFragment
                }
              }
            }
            checkStats {
              totalChecks
              totalPassingChecks
            }
          }
        }
      }
      ${CHECK_RESULT_DETAILS_FRAGMENT}
    `;

    return this.client.request(query, { alias: serviceAlias }, { "GraphQL-Visibility": "internal" });
  }

  getServicesReport(includeScorecards: boolean) {
    const query = gql`
      query servicesReport(
        $includeScorecards: Boolean
      ) {
        account {
          rubric {
            levels {
              totalCount
              nodes {
                index
                name
                alias
              }
            }
            categories {
              nodes {
                id
                name
              }
            }
          }
          servicesReport {
            levelCounts {
              level {
                name
              }
              serviceCount
            }
            categoryLevelCounts(includeScorecards: $includeScorecards) {
              category {
                name
              }
              level {
                name
                index
              }
              serviceCount
            }
          }
        }
      }    
    `;

    return this.client.request(query, { includeScorecards }, { "GraphQL-Visibility": "internal" });
  }

  exportEntity(entity: Entity) {
    const query = gql`
      mutation importEntityFromBackstage($entityRef: String!, $entity: JSON!) {
        importEntityFromBackstage(entityRef: $entityRef, entity: $entity) {
          errors {
            message
          }
          actionMessage
          htmlUrl
        }
      }
    `;

    const entityRef = stringifyEntityRef(entity);
    return this.client.request(query, { entityRef, entity });
  }
}

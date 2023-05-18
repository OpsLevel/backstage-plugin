import { Config } from '@backstage/config';
import { createApiRef } from '@backstage/core-plugin-api';
import { Entity, stringifyEntityRef } from '@backstage/catalog-model';
import { GraphQLClient, gql } from 'graphql-request';
import { OpsLevelApi } from './types/OpsLevelData';

export const opslevelApiRef = createApiRef<OpsLevelApi>({
  id: 'plugin.opslevel.service',
});

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
              rubric {
                checkResults {
                  byLevel {
                    nodes {
                      level {
                        index
                        name
                      }
                      items {
                        nodes {
                          message
                          createdAt
                          check {
                            id
                            enableOn
                            name
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
              }
            }
            checkStats {
              totalChecks
              totalPassingChecks
            }
          }
        }
      }
    `;

    return this.client.request(query, { alias: serviceAlias }, { "GraphQL-Visibility": "internal" });
  }

  getServicesReport() {
    const query = gql`
      query servicesReport {
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
            categoryLevelCounts {
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

    return this.client.request(query, { }, { "GraphQL-Visibility": "internal" });
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

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
          }
        }
      }
    `;

    return this.client.request(query, { alias: serviceAlias });
  }

  exportEntity(entity: Entity) {
    const importEntity = gql`
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

    const serviceRepository = gql`
      mutation serviceRepositoryCreate($entityAlias: String!, $repositoryAlias: String!) {
        serviceRepositoryCreate(input: {
          service: {alias:$entityAlias},
          repository: {alias:$repositoryAlias},
        }) {
          errors {
            message
          }
        }
      }
    `;

    entity.spec.type = "service";
    const entityRef = stringifyEntityRef(entity);
    const entityAlias = entity.metadata.name;
    const result = this.client.request(importEntity, { entityRef, entity })

    const sourceLocation = entity.metadata.annotations['backstage.io/source-location'].split("/");
    const repositoryAlias = `${sourceLocation[2]}:${sourceLocation[3]}/${sourceLocation[4]}`;
    this.client.request(serviceRepository, { entityAlias, repositoryAlias });

    return result
  }
}

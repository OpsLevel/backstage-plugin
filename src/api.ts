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

    const importEntityFromBackstage = `
    mutation importAndCreate($entityRef: String!, $entity: JSON!, $entityAlias: String!, $repositoryAlias: String!) {
      import: importEntityFromBackstage(entityRef: $entityRef, entity: $entity) {
        errors {
          message
        }
        actionMessage
        htmlUrl
      }
      create: serviceRepositoryCreate(input: {service: {alias: $entityAlias}, repository: {alias: $repositoryAlias}}) {
        serviceRepository {
          id
        }
        errors {
          message
        }
      }
    }
    `;

    if (entity && entity.spec) {
      if (entity.metadata && entity.metadata.tags) {
        entity.metadata.tags.push(`type:${entity.spec.type}`);
      }
      entity.spec.type = "service";
    }

    if (entity && entity.metadata && entity.metadata.annotations) {
      const sourceLocation = entity.metadata.annotations['backstage.io/source-location'];
      if (sourceLocation) {
        const sourceLocationParts = sourceLocation.split("/");
        const input = {
          entityRef: stringifyEntityRef(entity),
          entity: entity,
          entityAlias: entity.metadata.name,
          repositoryAlias: `${sourceLocationParts[2]}:${sourceLocationParts[3]}/${sourceLocationParts[4]}`,
        };
        return this.client.request(importEntityFromBackstage, input);
      }
    }

    return Promise.resolve(null)
  }

  updateServiceLanguage(entity: Entity) {
    const getServiceLanguage = `
      query getServiceLanguage($alias: String!) {
        account {
          service(alias: $alias) {
            name
            repos {
              edges {
                node {
                  languages {
                    name
                    usage
                  }
                }
              }
            }
          }
        }
      }
    `;

    const serviceUpdate = `
      mutation serviceUpdate($alias: String!, $language: String!) {
        serviceUpdate(input: {alias: $alias, language: $language}) {
          errors {
            message
          }
        }
      }
    `;

    const entityAlias = entity.metadata.name

    this.client.request(getServiceLanguage, { alias: entityAlias }).then((result) => {
      let serviceLanguage = result.account.service.repos.edges[0].node.languages[0];
      for (let i = 1; i < result.account.service.repos.edges[0].node.languages.length; i++) {
        if (result.account.service.repos.edges[0].node.languages[i].usage > serviceLanguage.usage) {
          serviceLanguage = result.account.service.repos.edges[0].node.languages[i];
        }
      }
      return this.client.request(serviceUpdate, { alias: entityAlias, language: serviceLanguage.name })
    });

    return Promise.resolve(null)

  }

}

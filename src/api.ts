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
    return new OpsLevelGraphqlAPI(config.getString('backend.baseUrl'),
                                 config.getOptionalStringArray('opslevel.frameworks') ?? ['']);
  }

  private client;

  constructor(public url: string, public frameworks: string[]) {
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

    let response = Promise.resolve(null)

    entity.metadata.tags?.push(`type:${entity.spec?.type}`);
    if (entity.spec) {
      entity.spec.type = "service";
    }

    if (entity.metadata && entity.metadata.annotations) {
      const sourceLocation = entity.metadata.annotations['backstage.io/source-location'];
      if (sourceLocation) {
        const sourceLocationParts = sourceLocation.split("/");
        const input = {
          entityRef: stringifyEntityRef(entity),
          entity: entity,
          entityAlias: entity.metadata.name,
          repositoryAlias: `${sourceLocationParts[2]}:${sourceLocationParts[3]}/${sourceLocationParts[4]}`,
        };
        response =  this.client.request(importEntityFromBackstage, input);
      }
    }

    return response
  }

  updateService(entity: Entity) {
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
      mutation serviceUpdate($alias: String!, $language: String!, $tierAlias: String, $framework: String) {
        serviceUpdate(input: {alias: $alias, language: $language, tierAlias: $tierAlias, framework: $framework}) {
          errors {
            message
          }
        }
      }
    `;

    const entityAlias = entity.metadata.name

    let response = Promise.resolve(null)
    let tierAlias: string | undefined;
    let framework: string | undefined;

    this.client.request(getServiceLanguage, { alias: entityAlias }).then((result) => {

      const repos = result.account.service.repos.edges[0].node;
      const languages: {name: string, usage: number}[] = repos.languages;

      const primaryLanguage = languages.reduce((prev, curr) =>
                                               curr.usage > prev.usage ? curr : prev, languages[0]);

      framework = entity.metadata.annotations?.["opslevel.com/framework"]
      if (framework === undefined) {
        framework = entity.metadata.tags?.find(tag => this.frameworks.includes(tag));
      }

      tierAlias = entity.metadata.annotations?.["opslevel.com/tier"]

      response = this.client.request(serviceUpdate, { alias: entityAlias,
                                                      language: primaryLanguage.name,
                                                      tierAlias: tierAlias,
                                                      framework: framework,
                                                      })
    });

    return response

  }

}

import { Config } from '@backstage/config';
import { createApiRef } from '@backstage/core-plugin-api';
import { Entity, stringifyEntityRef } from '@backstage/catalog-model';
import { GraphQLClient, gql } from 'graphql-request';
import { OpsLevelApi } from './types/OpsLevelData';

export const opslevelApiRef = createApiRef<OpsLevelApi>({
  id: 'plugin.opslevel.service',
});

const frameworkList = ["django"];

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

    let response = Promise.resolve(null)

    if (entity.spec) {
      if (entity.metadata && entity.metadata.tags) {
        entity.metadata.tags.push(`type:${entity.spec.type}`);
      }
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
      let serviceLanguage = repos.languages[0];

      for (let i = 1; i < repos.languages.length; i++) {
        const currentLanguage = repos.languages[i];
        if (currentLanguage.usage > serviceLanguage.usage) {
          serviceLanguage = currentLanguage;
        }
      }

      const tags = entity.metadata?.tags;

      if (tags) {
        framework = tags.find(tag => frameworkList.includes(tag));
      }

      if (entity.metadata.annotations) {
        if (entity.metadata.annotations["opslevel.com/tier"]) {
          tierAlias = entity.metadata.annotations["opslevel.com/tier"]
        }
        if (entity.metadata.annotations["opslevel.com/framework"]) {
          framework = entity.metadata.annotations["opslevel.com/framework"]
        }
      }
      response = this.client.request(serviceUpdate, { alias: entityAlias,
                                                      language: serviceLanguage.name,
                                                      tierAlias: tierAlias,
                                                      framework: framework,
                                                      })
    });

    return response

  }

}

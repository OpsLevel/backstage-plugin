[![Overall](https://img.shields.io/endpoint?style=flat&url=https%3A%2F%2Fapp.opslevel.com%2Fapi%2Fservice_level%2FSX_5tBBV3PXtQcTEe4j6kGw_Sm0ys-piO0swtoWKCwo)](https://app.opslevel.com/services/backstage_plugin/maturity-report)
[![npm](https://img.shields.io/npm/v/@opslevel/backstage-maturity)](https://www.npmjs.com/package/@opslevel/backstage-maturity)

# OpsLevel Maturity Plugin

This plugin helps you leverage OpsLevel's powerful maturity features with your existing Backstage catalog. An OpsLevel API Key is required to use this plugin.

![](docs/rubric.png)

![](docs/maturity-on-service.png)

![](docs/maturity-report.png)

[OpsLevel](https://www.opslevel.com/) gives platform engineers and DevOps leaders the tools to drive service maturity for their teams. We understand that maturity features alongside your software catalog are critical to a culture of service ownership. Which is why we’ve made our maturity features available to Backstage users within their existing service catalog.

OpsLevel uses [Checks](https://www.opslevel.com/docs/getting-started-with-checks) to measure Service Maturity. Checks let you explicitly define how you want your services to be built and operated.
With OpsLevel Checks, you can verify that services:
* Are using a particular version of a library or framework
* Have migrated to a new third-party tool (e.g., all services use Splunk)
* Meet certain operational requirements (e.g., all Tier-1 services have an on-call schedule)

And a whole lot more.

Paired with our [Rubric](https://www.opslevel.com/docs/getting-started-with-rubrics), Checks allow you to get a holistic view of the health of your software ecosystem. This allows you to not just catalog and create new services but also take action to prevent outages and vulnerabilities.

With the plugin, you can view maturity progress in context with the rest of your service information in Backstage. If you want to dig deeper, you can toggle back to OpsLevel from Backstage to see more health metrics through our Rubric or Check Reports.



## Install Plugin

```bash
yarn add --cwd packages/app @opslevel/backstage-maturity
```

Setting up this plugin requires the following changes to the `app-config.yaml` file:

### Set Up Proxy Configuration

Add a proxy configuration for OpsLevel. Replace `<your_OpsLevel_API_token>` with a token from https://app.opslevel.com/api_tokens (or, if you're running a self-hosted OpsLevel instance, the `/api_tokens` page on your OpsLevel instance).

```yaml
proxy:
  endpoints:
    '/opslevel':
      target: 'https://app.opslevel.com'
      headers:
        X-Custom-Source: backstage
        Authorization: Bearer <your_OpsLevel_API_token>
      allowedHeaders: ['GraphQL-Visibility']
```

If you're running Self-Hosted OpsLevel, replace `target` with your URL.

> :warning: **If you are using an authentication solution with Backstage**: Ensure that it does not interfere with the HTTP headers going through this proxy. If requests to OpsLevel seemingly inexplicably fail with a HTTP 401 (Unauthorized) response, but you have confirmed that your API token is valid, this is one possible root cause. Due to the customizable nature of Backstage, the support we will be able to offer in such cases will be limited.

### Set Up the Base OpsLevel URL

```yaml
opslevel:
  baseUrl: 'https://app.opslevel.com'
```

If you're running Self-Hosted OpsLevel, replace `baseUrl` with your URL.

### Add Route & Global nav

Update `packages/app/src/App.tsx`

```jsx
import { OpslevelMaturityPage } from '@opslevel/backstage-maturity';
```
```jsx
    <Route path="/opslevel-maturity" element={<OpslevelMaturityPage />}/>
```


Update `packages/app/src/components/Root/Root.tsx`

```tsx
import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline';

```
```tsx
        <SidebarItem
          icon={CheckCircleOutlineIcon}
          to="opslevel-maturity"
          text="Maturity"
        />
```


### Add Tab for Maturity to Services

In `packages/app/src/components/catalog/EntityPage.tsx` import the plugin and add it to `serviceEntityPage`

```tsx
import { EntityOpsLevelMaturityContent } from '@opslevel/backstage-maturity';
```
```tsx
    <EntityLayout.Route path="/maturity" title="Service Maturity">
      <EntityOpsLevelMaturityContent />
    </EntityLayout.Route>
```

### Next Steps

Visit the Maturity tab in Backstage to get started. Once you have synced data from Backstage to OpsLevel, you will likely want to set up auto-syncing of data using the [backend-plugin](https://github.com/OpsLevel/backstage-plugin-backend).


## Troubleshooting

### 403 API Requests

Please validate that you do not have any middleware set up in Backstage that could be removing cookies or headers from the request by the Backstage proxy.

### 404 API Requests

If you are receiving 404s, it is possible that there is a network firewall preventing Backstage from accessing the OpsLevel instance.

You can validate this by using [Postman](https://www.postman.com/downloads/) or another tool to simulate the request from the machine running Backstage.

Sometimes it can be hard to set up a tool in environments running Backstage, in which was you can retrieve headers and cookies from a browser logged into OpsLevel and simulate the request with `curl`.

You will need:

1. `[[CSRF_token]]` - retrieved from `<meta name="csrf-token" content="[THIS VALUE]" />`
1. `[[Session_token]]` - retrieved from browser cookies `_opslevel_com_session`


```sh
curl 'http://app.opslevel.com/graphql' -X POST -H 'content-type: application/json' -H 'graphql-visibility: internal' -H 'x-csrf-token: [[CSRF_token]]' -H 'Cookie: _opslevel_com_session=[[Session_token]]' --data-raw '{"operationName":"requestApplicationConfigs","variables":{},"query":"query requestApplicationConfigs {\n  elasticsearchEnabled\n  environment\n}"}'
```
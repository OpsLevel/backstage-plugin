# OpsLevel Maturity Plugin

This plugin helps you leverage OpsLevel's powerful maturity features with your existing Backstage catalog. An OpsLevel API Key is required to use this plugin.

## Install Plugin


Update `app-config.yaml` to add a proxy for OpsLevel. Replace `<your_OpsLevel_API_token>` with a token from https://app.opslevel.com/api_tokens.

```yaml
proxy:
  '/opslevel':
    target: 'https://app.opslevel.com'
    headers:
      X-Custom-Source: backstage
      Authorization: Bearer <your_OpsLevel_API_token>
```



## Self-hosted OpsLevel

If you're using a self-hosted OpsLevel instance, replace proxy `target` with your own domain.


## Adding Plugin Components

TODO - add routes, custom components etc.

import {
  createPlugin,
  createRoutableExtension,
  createApiFactory,
  configApiRef,
} from '@backstage/core-plugin-api';
import { opslevelApiRef, OpsLevelGraphqlAPI } from './api';
import { opslevelPluginApiRef, OpsLevelPluginAPI } from './backend_api';

import { rootRouteRef } from './routes';

export const opslevelMaturityPlugin = createPlugin({
  id: 'opslevel-maturity',
  routes: {
    root: rootRouteRef,
  },
  apis: [
    createApiFactory({
      api: opslevelApiRef,
      deps: { configApi: configApiRef },
      factory: ({ configApi }) => OpsLevelGraphqlAPI.fromConfig(configApi),
    }),
    createApiFactory({
      api: opslevelPluginApiRef,
      deps: { configApi: configApiRef },
      factory: ({ configApi }) => OpsLevelPluginAPI.fromConfig(configApi),
    }),
  ],
});

export const OpslevelMaturityPage = opslevelMaturityPlugin.provide(
  createRoutableExtension({
    name: 'OpslevelMaturityPage',
    component: () =>
      import('./components/OverallMaturity').then(m => m.OverallMaturity),
    mountPoint: rootRouteRef,
  }),
);

export const EntityOpsLevelMaturityContent = opslevelMaturityPlugin.provide(
  createRoutableExtension({
    name: 'EntityOpsLevelMaturityContent',
    component: () =>
      import('./components/EntityOpsLevelMaturityContent').then(
        m => m.EntityOpsLevelMaturityContent,
      ),
    mountPoint: rootRouteRef,
  }),
);

import { Config } from '@backstage/config';
import { createApiRef } from '@backstage/core-plugin-api';
import { AutoSyncConfiguration, OpsLevelBackendApi } from './types/OpsLevelData';

export const opslevelPluginApiRef = createApiRef<OpsLevelBackendApi>({
  id: 'plugin.opslevel.backend.service',
});

export class OpsLevelPluginAPI implements OpsLevelBackendApi {
  static fromConfig(config: Config) {
    return new OpsLevelPluginAPI(config.getString('backend.baseUrl'));
  }

  constructor(public url: string) {
    this.url = `${this.url}/api/opslevel`;
  }

  public async isPluginAvailable() {
    try {
      const response = await fetch(`${this.url}/ping`);
      return response.status === 200;
    } catch {
      return false;
    }
  }

  public async getAutoSyncConfiguration() {
    return fetch(`${this.url}/auto_sync`)
      .then((response) => response.json())
      .then((data) => {
        return data;
      })
      .catch(() => {
        return null;
      });
  }

  public async setAutoSyncConfiguration(configuration: AutoSyncConfiguration) {
    return await fetch(`${this.url}/auto_sync`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(configuration)
    })
      .then((response) => response.json())
      .then((data) => {
        return data.status === "ok";
      })
      .catch(() => {
        return false;
      });
  }

  public async getAutoSyncExecution(index: number) {
    return await fetch(`${this.url}/auto_sync/runs`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ page_size: 1, page_number: index })
    })
      .then((response) => response.json())
      .then((data) => {
        return data;
      })
      .catch(() => {
        return { total_count: 0, rows: [] };
      });
  }
}

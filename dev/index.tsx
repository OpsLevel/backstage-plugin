import React from 'react';
import { createDevApp } from '@backstage/dev-utils';
import { opslevelMaturityPlugin, OpslevelMaturityPage } from '../src/plugin';

createDevApp()
  .registerPlugin(opslevelMaturityPlugin)
  .addPage({
    element: <OpslevelMaturityPage />,
    title: 'Root Page',
    path: '/opslevel-maturity'
  })
  .render();

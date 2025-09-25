#!/bin/bash

# Run ESLint and search for any eslint-disable comments
npx eslint . --ext .ts,.tsx | grep -E 'eslint-disable|eslint-disable-line|eslint-disable-next-line'
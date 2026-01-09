import * as core from '@actions/core';
import { run } from './run';
import { Result } from './result';

run()
  .then((result) => {
    core.info(`Action finished with result: ${Result[result]}`);
  })
  .catch((e) => {
    core.setFailed(e.message);
  });

// model objects
import TestApp from './models/TestApp';
import ControllerFor from './models/local/ControllerFor';
import LocalAppController from './models/local/LocalAppController';
import LocalLibController from './models/local/LocalLibController';
import NetworkAppController from './models/network/NetworkAppController';
import NetworkLibController from './models/network/NetworkLibController';

// module information
const version = 'v' + require('../package.json').version;

export {
  version,
  TestApp,
  ControllerFor,
  LocalAppController,
  LocalLibController,
  NetworkAppController,
  NetworkLibController,
};

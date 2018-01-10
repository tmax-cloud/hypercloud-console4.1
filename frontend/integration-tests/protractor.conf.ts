/* eslint-disable no-undef, no-unused-vars */

import { Config, browser, logging } from 'protractor';
import { execSync } from 'child_process';
import * as HtmlScreenshotReporter from 'protractor-jasmine2-screenshot-reporter';
import * as _ from 'lodash';
import { Set as ImmutableSet } from 'immutable';
import { TapReporter } from 'jasmine-reporters';
import * as failFast from 'protractor-fail-fast';

// FIXME: Remove once https://github.com/angular/protractor/pull/4068 is merged
require('protractor/built/logger').Logger.setWrite(3);

export const appHost = `${process.env.BRIDGE_BASE_ADDRESS || 'http://localhost:9000'}${(process.env.BRIDGE_BASE_PATH || '/').replace(/\/$/, '')}`;
export const testName = `test--${Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 5)}`;

const htmlReporter = new HtmlScreenshotReporter({dest: './gui_test_screenshots', inlineImages: true, captureOnlyFailedSpecs: true, filename: 'test-gui-report.html'});
const browserLogs: logging.Entry[] = [];

export const config: Config = {
  framework: 'jasmine',
  directConnect: true,
  skipSourceMapSupport: true,
  jasmineNodeOpts: {print: () => null},
  plugins: [failFast.init()],
  capabilities: {
    browserName: 'chrome',
    chromeOptions: {
      args: [
        '--disable-gpu',
        '--headless',
        '--no-sandbox',
        '--start-fullscreen',
        '--window-size=1400,1050',
        '--disable-background-timer-throttling',
        '--disable-renderer-backgrounding',
        '--disable-raf-throttling'
      ],
      prefs: {
        'profile.password_manager_enabled': false,
        'credentials_enable_service': false,
        'password_manager_enabled': false
      }
    }
  },
  beforeLaunch: () => new Promise(resolve => htmlReporter.beforeLaunch(resolve)),
  onPrepare: () => {
    browser.waitForAngularEnabled(false);
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
    jasmine.getEnv().addReporter(htmlReporter);
    jasmine.getEnv().addReporter(new TapReporter());
  },
  onComplete: async() => {
    console.log('BEGIN BROWSER LOGS');
    browserLogs.forEach(log => {
      const {level, message} = log;
      const messageStr = _.isArray(message) ? message.join(' ') : message;
      switch (level.name) {
        case 'DEBUG':
          console.log(level, messageStr);
          break;
        case 'SEVERE':
          console.warn(level, messageStr);
          break;
        case 'INFO':
        default:
          console.info(level, messageStr);
      }
    });
    console.log('END BROWSER LOGS');

    await browser.close();
    execSync(`kubectl delete --cascade ns ${testName}`);
  },
  afterLaunch: (exitCode) => {
    failFast.clean();
    return new Promise(resolve => htmlReporter.afterLaunch(resolve.bind(this, exitCode)));
  },
  suites: {
    crud: ['tests/base.scenario.ts', 'tests/crud.scenario.ts'],
    alm: ['tests/base.scenario.ts', 'tests/alm/**/*.scenario.ts'],
    all: ['tests/base.scenario.ts', 'tests/crud.scenario.ts', 'tests/alm/**/*.scenario.ts'],
  }
};

const ignoredErrors = ImmutableSet<string>()
  .add('Error during WebSocket handshake: Unexpected response code: 502')
  .add('Warning: react-modal: App element is not defined')
  .add('Warning: Failed prop type: Invalid prop `query` of type `array` supplied to `Line`')
  .add('shouldComponentUpdate should not be used when extending React.PureComponent')
  .add('Error: <path> attribute d: Expected number')
  .add('Error: <text> attribute transform: Expected number')
  .add('/api/tectonic/certs - Failed to load resource: the server responded with a status of 500');

export const checkLogs = async() => (await browser.manage().logs().get('browser'))
  .map(log => {
    browserLogs.push(log);
    return log;
  })
  .filter(log => log.level.name === 'SEVERE' && !ignoredErrors.some(msg => log.message.includes(msg)))
  .forEach(log => fail(`Console error: ${log.message}`));
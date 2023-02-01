# serverless-loggroup-deletion-policy

[![Build Status][build-badge]][build]
[![npm package][npm-badge]][npm]
[![Coverage Status][coveralls-badge]][coveralls]

> Set a deletion policy on your serverless service log groups

## Install

```
$ npm install --save-dev serverless-loggroup-deletion-policy
```

## Usage

Add the plugin to your serverless config:

```yaml
plugins:
  - serverless-loggroup-deletion-policy
  - ...any other plugins
```

Then configure the plugin as follows:

```yaml
custom:
  logGroupDeletionPolicy:
    keepLambdaLogs: true # or false
```

## Credits

This plugin is based off of [xoeye/serverless-log-keeper](https://github.com/xoeye/serverless-log-keeper).
Due to the number of changes that were required for this plugin to work as I needed, it would be closer to a rewrite than a PR. Therefore, I decided to fork it.
The original work was very useful in getting this plugin up and running.

## License

See the [LICENSE](LICENSE.md) file for license rights and limitations (MIT).

[build-badge]: https://github.com/dotcore64/serverless-loggroup-deletion-policy/actions/workflows/test.yml/badge.svg?event=push
[build]: https://github.com/dotcore64/serverless-loggroup-deletion-policy/actions
[npm-badge]: https://img.shields.io/npm/v/serverless-loggroup-deletion-policy.svg
[npm]: https://www.npmjs.org/package/serverless-loggroup-deletion-policy
[coveralls-badge]: https://img.shields.io/coveralls/dotcore64/serverless-loggroup-deletion-policy/master.svg
[coveralls]: https://coveralls.io/r/dotcore64/serverless-loggroup-deletion-policy

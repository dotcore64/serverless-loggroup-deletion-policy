> [!WARNING]
>
> `serverless-loggroup-deletion-policy` is no longer actively developed. I do no longer use the serverless framework and despite best efforts on my part, they made it too cumbersome to develop plugins by requiring access and license keys, which don't seem to work randomly. If someone is interested in taking over please contact me, thanks!

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

[build-badge]: https://img.shields.io/github/actions/workflow/status/dotcore64/serverless-loggroup-deletion-policy/test.yml?event=push&style=flat-square
[build]: https://github.com/dotcore64/serverless-loggroup-deletion-policy/actions
[npm-badge]: https://img.shields.io/npm/v/serverless-loggroup-deletion-policy.svg?style=flat-square
[npm]: https://www.npmjs.org/package/serverless-loggroup-deletion-policy
[coveralls-badge]: https://img.shields.io/coveralls/dotcore64/serverless-loggroup-deletion-policy/master.svg?style=flat-square
[coveralls]: https://coveralls.io/r/dotcore64/serverless-loggroup-deletion-policy

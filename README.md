# Kankyō

環境, かんきょう

An configurable and environment aware .env alternative.

[![forthebadge](https://forthebadge.com/images/badges/check-it-out.svg)](https://forthebadge.com)
[![forthebadge](https://forthebadge.com/images/badges/uses-js.svg)](https://forthebadge.com)

## Getting started

### Adding to your project

`npm install --save kankyo`

Kankyo can now be used in npm scripts

```json
{
  ...
  "scripts": {
    "start": "kankyo exec -- node app.js"
  }
}
```

### Installed globally

`npm install -g kankyo`

### With npx

`npx kankyo --help`

## Usage

### From the command line

By using the cli's `exec` command, followed by your own shell command, Kankyō will load the environment and run the specified command with it.

e.g

`npx kankyo exec -- command arg1 arg2 arg3`

### Programatically

At the earliest stage possible, you can require Kankyō and call its `inject` method to load up the environment file into the current environment. As you would traditional `.env` files

e.g

```javascript
require('kankyo').inject();

console.log(process.env);
```

## Environment file

Kankyo is configured using a custom [TOML](https://toml.io) file

The default file name is `.kankyo.toml`

However it also supports the following names as alternatives:

- `.kankyo.toml'`
- `.environment.toml'`
- `.env.toml'`
- `kankyo.toml'`
- `environment.toml'`
- `env.toml'`

## Generating the file

A file can be generated inside your project using the following command:

`npx kankyo init`

### Default Variables

Start by setting the default variables of your environment

```toml
[defaults]

hostname      = "hello"
database_name = "my_db"
```

### Configurable Environments

You can set any number of custom environments, here's an example of us setting a `staging` environment

```toml
...

[env.staging]

database_name = "my_staging_db"
```

When run in staging mode, the default `database_name` will be overridden by the value set under the staging block

### Options

* `env_var` - Set the variable name that defines which environment is used. Defaults to `NODE_ENV`
* `uppercase` - If set, will uppercase all environment variable names. Defaults to `true`

## String interpolation

Variables defined in the Kankyō file support string interpolation using the `"${...}"` format.

Example:

```toml
[defaults]

word_a    = "foo"
word_b    = "bar"
sentence  = "${word_a} ${word_b}"
```

## Full file example

```toml
[options]

env_key     = "NODE_ENV"
uppercase   = true

[defaults]

word_a    = "foo"
word_b    = "bar"
sentence  = "${word_a} ${word_b}"

[env.production]

word_a = "hello"
word_b = "world"
```

## License

MIT License

Copyright (c) 2021 Patrick R

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

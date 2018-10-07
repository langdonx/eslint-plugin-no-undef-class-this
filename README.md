# eslint-plugin-no-undef-class-this

A single rule, `no-undef-class-this`, [described here](docs/rules/no-undef-class-this.md).

## Installation

You'll first need to install [ESLint](http://eslint.org):

```
$ npm i eslint --save-dev
```

Next, install `eslint-plugin-no-undef-class-this`:

```
$ npm install eslint-plugin-no-undef-class-this --save-dev
```

**Note:** If you installed ESLint globally (using the `-g` flag) then you must also install `eslint-plugin-no-undef-class-this` globally.

## Usage

Add `no-undef-class-this` to the plugins section of your `.eslintrc` configuration file. You can omit the `eslint-plugin-` prefix:

```json
{
    "plugins": [
        "no-undef-class-this"
    ]
}
```


Then configure the rules you want to use under the rules section.

```json
{
    "rules": {
        "no-undef-class-this/no-undef-class-this": "error"
    }
}
```

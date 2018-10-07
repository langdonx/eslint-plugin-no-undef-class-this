# Requires strict use of `this` inside classes (no-undef-class-this)

Properties referenced on `this` inside of a `class` should be defined ahead of time, either inside the `constructor` or as a `ClassMethod`.

## Rule Details

Similar to [no-undef](https://eslint.org/docs/rules/no-undef), this will detect usage of undeclared class properties.  While declaring class properties in the constructor isn't a requirement of using classes, it feels like a good idea, especially when coupled with this plugin.

Examples of **incorrect** code for this rule:

```js
class Person {
    constructor() {
        this.FirstName = '';
        this.LastName = '';
    }

    get FullName() {
        return `${this.firstNam} ${this.lastName}`; // firstName has a typo
    }
}
```

## Further Reading

This is being used in [angular-2017-starter repo](https://github.com/langdonx/angularjs-2017-starter), where there's no real funny business going on with classes, meaning each component, directive, and service gets its own class and there's no inheritance or class instances passed around.

## TODO

- Add support for `class-fields` (https://github.com/tc39/proposal-class-fields)
- Add support (if even possible with static analysis) for `extends`

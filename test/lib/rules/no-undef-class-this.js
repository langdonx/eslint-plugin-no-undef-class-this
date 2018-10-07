/**
 * @fileoverview Tests for no-undef-class-this
 * @author Langdon Oliver
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var rule = require("../../../lib/rules/no-undef-class-this"),

  RuleTester = require("eslint").RuleTester;


//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

var ruleTester = new RuleTester({ parser: 'babel-eslint' });
ruleTester.run("no-undef-class-this", rule, {

  // tests that won't produce errors
  valid: [
    // testing properties referenced in class methods
    `class Person {
      constructor() {
        this.firstName = '';
        this.lastName = '';
      }

      doSomething() {
        this.firstName = 'Langdon';
        this.firstName = 'Oliver';
      }
    }`,
    // testing methods referenced in the constructor
    `class Person {
      constructor() {
        this.firstName = '';
        this.lastName = '';

        this.initialize();
      }

      initialize() {
        console.log(\`initializing $\{this.firstName} $\{this.lastName}\`);
      }
    }`,
    // testing properties (method in this case), assigned via Object.assign
    `class Person {
      constructor(TestService) {
        'ngInject';

        Object.assign(this, { TestService });

        this.firstName = '';
        this.lastName = '';
        this.birthDate = new Date();
      }

      doSomething() {
        this.firstName = 'Langdon';
        this.firstName = 'Oliver';
        this.birthDate = new Date(Date.parse('1/1/2018'));

        this.TestService(this.firstName, true);
      }
    }`,
    // testing getters referenced in methods
    `class Person {
      constructor(firstName, lastName) {
        this.firstName = firstName
        this.lastName = lastName;

        this.initialize();
      }

      get fullName() {
        return \`$\{this.firstName} $\{this.lastName}\`;
      }

      initialize() {
        console.log(\`initializing $\{this.fullName}\`);
      }
    }`,
  ],

  // test with expected errors
  invalid: [
    {
      // detect typos
      code: `class Person {
    constructor() {
        this.firstName = '';
        this.lastName = '';
    }

    doSomething() {
        // typo
        this.firstNam = 'Langdon';
    }
}`,
      errors: [{
        message: "Unknown this property: firstNam",
        type: "ThisExpression"
      }]
    },
    {
      // detect dependencies never assigned
      code: `class Person {
    constructor($root, $window, TestService) {
      Object.assign(this, { $root, $window });
    }

    doSomething() {
        // TestService never assigned
        this.TestService();
    }
}`,
      errors: [{
        message: "Unknown this property: TestService",
        type: "ThisExpression"
      }]
    },
    {
      // detect properties never declared
      code: `class Person {
    doSomething() {
      // never declared, no good
      this.firstName = 'Langdon';
    }
}`,
      errors: [
        {
          message: 'Unknown this property: firstName',
          type: 'ThisExpression'
        }
      ]
    },
    {
      // detect static types referenced through this
      code: `class Person {
    constructor() {
        this.firstName = '';
        this.lastName = '';

        this.initialize();
    }

    static getTypes() {
        return [];
    }

    initialize() {
        const types = this.getTypes(); // should be Person.getTypes()
    }
}`,
      errors: [
        {
          message: `Static property cannot be referenced through the instance: getTypes`,
          type: 'ThisExpression'
        }
      ]
    }
  ]
});

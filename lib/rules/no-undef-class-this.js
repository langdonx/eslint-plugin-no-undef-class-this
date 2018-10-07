/**
 * @fileoverview Rule implementation for no-undef-class-this
 * @author Langdon Oliver
 */
"use strict";

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = {
  meta: {
    docs: {
      description: "Properties referenced on this inside of a class should be defined ahead of time.",
      category: "Best Practices",
      recommended: false
    },
    fixable: null,
    schema: []
  },

  create: function (context) {
    const validPropertyNames = [];
    const staticPropertyNames = [];

    return {
      ClassBody(node) {
        node.body.some((classNode) => {
          if (classNode.type === 'MethodDefinition') {
            // extract all valid property names from constructor
            if (classNode.kind === 'constructor' && classNode.value.type === 'FunctionExpression' && classNode.value.body.type === 'BlockStatement' && Array.isArray(classNode.value.body.body) === true) {
              // we've found a valid constructor, look for properties
              classNode.value.body.body.forEach((constructorNode) => {
                // handle this.x = y;
                if (constructorNode.type === 'ExpressionStatement'
                  && constructorNode.expression.type === 'AssignmentExpression'
                  && constructorNode.expression.left.type === 'MemberExpression'
                  && constructorNode.expression.left.object.type === 'ThisExpression') {
                  // keep track of all "valid" property names
                  validPropertyNames.push(constructorNode.expression.left.property.name);
                }

                // handle Object.assign(this, { x, y, z });
                if (constructorNode.type === 'ExpressionStatement'
                  && constructorNode.expression.type === 'CallExpression'
                  && constructorNode.expression.callee.object.name === 'Object'
                  && constructorNode.expression.callee.property.name === 'assign'
                  && constructorNode.expression.arguments[0].type === 'ThisExpression'
                  && constructorNode.expression.arguments[1].type === 'ObjectExpression') {
                  constructorNode.expression.arguments[1].properties.forEach((property) => {
                    // keep track of all "valid" property names
                    validPropertyNames.push(property.key.name);
                  });
                }
              });
            }
            // extract all defined methods and getters
            else if (classNode.kind === 'method' || classNode.kind === 'get') {
              if (classNode.static === false) {
                validPropertyNames.push(classNode.key.name);
              }
              else {
                staticPropertyNames.push(classNode.key.name);
              }
            }
          }

          return false;
        });
      },

      ThisExpression(node) {
        // for all ThisExpressions, verify the property being used is in our list of valid properties
        if (node.parent.type === 'MemberExpression' && validPropertyNames.indexOf(node.parent.property.name) === -1) {
          if (staticPropertyNames.indexOf(node.parent.property.name) > -1) {
            context.report(node, `Static property cannot be referenced through the instance: ${node.parent.property.name}`);
          }
          else {
            context.report(node, `Unknown this property: ${node.parent.property.name}`);
          }
        }
      }
    };
  }
};

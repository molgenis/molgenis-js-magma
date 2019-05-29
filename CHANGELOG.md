### 1.0.0

- Replaced gulp build with webpack 4
- Rename repository to `magma-script-js`
- Rename file `MagmaScript.js` to `magma-script-evaluator.js`
- Merge test files due to mocha-webpack not running wildcards
- Set moment and mathjs to external dependencies, reducing library size
- Rename library to @molgenis/magma-script-js

### 0.0.9
- Move Molgenis MagmaScript evaluator to npm module
- Let `MagmaScript.value()` method return wrapped value unchanged
- Rename `evalScript` to `evaluator`
- Let `evaluator` replace objects in the result with their id value
- Pick up bugfix and unit tests from forms library

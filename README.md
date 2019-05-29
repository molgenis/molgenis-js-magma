# molgenis-magma

Magmascript evaluator in JavaScript.

## Development
`yarn dev` to run dev server during development.

`yarn test` to run tests.

`yarn build` to create new production build.

### How to commit
We use conventional commits to generate changelogs and release notes. Please check: https://www.conventionalcommits.org/

**Example**
```
git commit file.ext -m "fix(file.ext): fixes something"
```

### How to publish
Each time a PR is merged a release will be done to NPM. The CHANGELOG.md and GitHub release will be ammended. 

The version of the package is based upon convential commits. Check: http://commitizen.github.io/cz-cli/.

# sparql-builder
SPARQL query builder written in TypeScript. Can be used from both TypeScript and JavaScript, although type-safety is lost in JavaScript.

It [exposes the following classes](dist/index.d.ts):

* `QueryBuilder` - builder base class
    * `SelectBuilder` - `SELECT` query builder
    * `DescribeBuilder` - `DESCRIBE` query builder

## Build

The [`build-dist.sh`](build-dist.sh) script does the following:
* compiles the TypeScript code using `tsc`
* runs unit tests using `npm test`
* packages the library with `webpack`
  - for use in the browser (`window` target, output in `dist/window`)
  - for use with Node.js (`commonjs2` target, output in `dist/node`)

## Usage

The builder is published as [`sparql-builder`](https://www.npmjs.com/package/sparql-builder) package on npm. Import it into your `package.json`:

```json
    "dependencies": {
        "sparql-builder": "^1.0.6"
    }
```

## Example:

Code in `test.ts`:
```typescript
import { SelectBuilder } from 'sparql-builder';

let query = "SELECT ?s { ?s ?p ?o }";

let builder = SelectBuilder.fromString(query).
    limit(42).
    offset(66).
    orderBy(SelectBuilder.ordering(SelectBuilder.var("s"), true)).
    orderBy(SelectBuilder.ordering(SelectBuilder.var("p")));

console.log(builder.toString());
```

Output of `tsc && node test.js`:
```sparql
SELECT ?s WHERE { ?s ?p ?o. }
ORDER BY DESC (?s) (?p)
OFFSET 66
LIMIT 42
```
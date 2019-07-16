# SPARQLBuilder
SPARQL query builder written in TypeScript

## Example:

Code:
```typescript
let query = "SELECT ?s { ?s ?p ?o }";
SelectBuilder.fromString(query).limit(42).offset(66).orderByExpression(SelectBuilder.var("s"), true).orderByExpression(SelectBuilder.var("p")).toString()
```

Output:
```sparql
SELECT ?s { ?s ?p ?o } ORDER BY DESC(?s) ?p LIMIT 42 OFFSET 66
```
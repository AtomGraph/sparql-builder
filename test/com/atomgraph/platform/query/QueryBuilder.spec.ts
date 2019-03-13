import { QueryBuilder } from '../../../../../src/com/atomgraph/platform/query/QueryBuilder';
import { Parser } from 'sparqljs';
import { expect } from 'chai';
import 'mocha';

describe('filterRegex()', () => {

  it('should build an equivalent query', () => {
    let query = "SELECT ?s { ?s ?p ?o }";
    let expected = "SELECT ?s { ?s ?p ?o FILTER (regex(?s, \"test\")) }";
    let actual = QueryBuilder.fromString(query).filterRegex("s", "test").build();

    expect(actual).to.deep.equal(new Parser().parse(expected));
  });

});
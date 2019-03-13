import { QueryBuilder } from '../../../../../src/com/atomgraph/platform/query/QueryBuilder';
import { Parser, Term } from 'sparqljs';
import { expect } from 'chai';
import 'mocha';

describe('should build an equivalent query', () => {

  it('filterRegex()', () => {
    let query = "SELECT ?s { ?s ?p ?o }";
    let expected = "SELECT ?s { ?s ?p ?o FILTER (regex(?s, \"test\")) }";
    let actual = QueryBuilder.fromString(query).filterRegex("s", "test").build();

    expect(actual).to.deep.equal(new Parser().parse(expected));
  });

  it('filterIn()', () => {
    let query = "SELECT ?s { ?s ?p ?o }";
    let expected = "SELECT ?s { ?s ?p ?o FILTER (?s IN (<http://a>, \"b\", \"c\")) }";
    let actual = QueryBuilder.fromString(query).filterIn("s", [<Term>"http://a", QueryBuilder.escapeLiteral("b"), QueryBuilder.escapeLiteral("c")]).build();

    expect(actual).to.deep.equal(new Parser().parse(expected));
  });


});
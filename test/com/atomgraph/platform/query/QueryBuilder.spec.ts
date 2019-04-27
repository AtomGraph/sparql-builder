import { QueryBuilder } from '../../../../../src/com/atomgraph/platform/query/QueryBuilder';
import { Parser, Term } from 'sparqljs';
import { expect } from 'chai';
import 'mocha';

describe('QueryBuilder', () => {

  it('bgp()', () => {
    let query = "SELECT ?s { ?s ?p ?o }";
    let expected = "SELECT ?s { ?s ?p ?o . ?s ?x \"y\" }";
    let actual = QueryBuilder.fromString(query).bgpTriple({ subject: QueryBuilder.var("s"), predicate: QueryBuilder.var("x"), object: QueryBuilder.literal("y") }).build();

    expect(actual).to.deep.equal(new Parser().parse(expected));
  });

  it('filterRegex()', () => {
    let query = "SELECT ?s { ?s ?p ?o }";
    let expected = "SELECT ?s { ?s ?p ?o FILTER (regex(?s, \"test\")) }";
    let actual = QueryBuilder.fromString(query).filterRegex("s", "test").build();

    expect(actual).to.deep.equal(new Parser().parse(expected));
  });

  it('filterIn()', () => {
    let query = "SELECT ?s { ?s ?p ?o }";
    let expected = "SELECT ?s { ?s ?p ?o FILTER (?s IN (<http://a>, \"b\", \"c\")) }";
    let actual = QueryBuilder.fromString(query).filterIn("s", [<Term>"http://a", QueryBuilder.literal("b"), QueryBuilder.literal("c")]).build();

    expect(actual).to.deep.equal(new Parser().parse(expected));
  });


});
import { QueryBuilder } from '../../../../../src/com/atomgraph/linkeddatahub/query/QueryBuilder';
import { Parser, OperationExpression } from 'sparqljs';
import { expect } from 'chai';
import 'mocha';

describe('QueryBuilder', () => {

  it('bgpTriple()', () => {
    let query = "SELECT ?s { ?s ?p ?o }";
    let expected = "SELECT ?s { ?s ?p ?o . ?s ?x \"y\" }";
    let actual = QueryBuilder.fromString(query).bgpTriple({ subject: QueryBuilder.var("s"), predicate: QueryBuilder.var("x"), object: QueryBuilder.literal("y") }).build();

    expect(actual).to.deep.equal(new Parser().parse(expected));
  });

  it('filter()', () => {
    let query = "SELECT ?s { ?s ?p ?o }";
    let expected = "SELECT ?s { ?s ?p ?o FILTER (?o > 42) }";
    let actual = QueryBuilder.fromString(query).where(QueryBuilder.filter(QueryBuilder.operation(">", [ QueryBuilder.var("o"), QueryBuilder.typedLiteral("42", "http://www.w3.org/2001/XMLSchema#integer") ]))).
    build();

    expect(actual).to.deep.equal(new Parser().parse(expected));
  });

  it('regex()', () => {
    let query = "SELECT ?s { ?s ?p ?o }";
    let expected = "SELECT ?s { ?s ?p ?o FILTER (regex(?s, \"test\")) }";
    let actual = QueryBuilder.fromString(query).where(QueryBuilder.filter(QueryBuilder.regex(QueryBuilder.var("s"), QueryBuilder.term("test")))).build();

    expect(actual).to.deep.equal(new Parser().parse(expected));
  });

  it('regex("i")', () => {
    let query = "SELECT ?s { ?s ?p ?o }";
    let expected = "SELECT ?s { ?s ?p ?o FILTER (regex(?s, \"test\", \"i\")) }";
    let actual = QueryBuilder.fromString(query).where(QueryBuilder.filter(QueryBuilder.regex(QueryBuilder.var("s"), QueryBuilder.term("test"), true))).build();

    expect(actual).to.deep.equal(new Parser().parse(expected));
  });

  it('operation()', () => {
    let query = "SELECT ?s { ?s ?p ?o }";
    let expected = "SELECT ?s { ?s ?p ?o FILTER (?s IN (<http://a>, \"b\", \"c\")) }";
    let actual = QueryBuilder.fromString(query).where(QueryBuilder.filter(QueryBuilder.operation("in", [ QueryBuilder.var("s"), [ QueryBuilder.uri("http://a"), QueryBuilder.literal("b"), QueryBuilder.literal("c") ] ]))).build();

    expect(actual).to.deep.equal(new Parser().parse(expected));
  });

  it('in()', () => {
    let query = "SELECT ?s { ?s ?p ?o }";
    let expected = "SELECT ?s { ?s ?p ?o FILTER (?s IN (<http://a>, \"b\", \"c\")) }";
    let actual = QueryBuilder.fromString(query).where(QueryBuilder.filter(QueryBuilder.in(QueryBuilder.var("s"), [ QueryBuilder.uri("http://a"), QueryBuilder.literal("b"), QueryBuilder.literal("c") ]))).build();

    expect(actual).to.deep.equal(new Parser().parse(expected));
  });

  it('eq()', () => {
    let query = "SELECT ?s { ?s ?p ?o }";
    let expected = "SELECT ?s { ?s ?p ?o FILTER (?o = \"x\") }";
    let actual = QueryBuilder.fromString(query).where(QueryBuilder.filter(QueryBuilder.eq(QueryBuilder.var("o"), QueryBuilder.literal("x")))).build();

    expect(actual).to.deep.equal(new Parser().parse(expected));
  });

  it('str()', () => {
    let query = "SELECT ?s { ?s ?p ?o }";
    let expected = "SELECT ?s { ?s ?p ?o FILTER (STR(?o) = \"x\") }";
    let actual = QueryBuilder.fromString(query).where(QueryBuilder.filter(QueryBuilder.eq(QueryBuilder.str(QueryBuilder.var("o")), QueryBuilder.literal("x")))).build();

    expect(actual).to.deep.equal(new Parser().parse(expected));
  });

});
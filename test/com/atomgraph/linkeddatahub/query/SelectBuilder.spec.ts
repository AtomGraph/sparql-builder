import { SelectBuilder } from '../../../../../src/com/atomgraph/linkeddatahub/query/SelectBuilder';
import { Parser } from 'sparqljs';
import { expect } from 'chai';
import 'mocha';

describe('SelectBuilder', () => {

  it('from()', () => {
    let query = "SELECT ?s { ?s ?p ?o }";
    let expected = SelectBuilder.fromString(query).build();
    let actual = SelectBuilder.fromQuery(expected).build();

    expect(actual).to.deep.equal(expected);
  });

  it('inherited bgpTriple()', () => {
    let query = "SELECT ?s { ?s ?p ?o }";
    let expected = "SELECT ?s { ?s ?p ?o . ?s ?x \"y\" }";
    let actual = SelectBuilder.fromString(query).bgpTriple({ subject: SelectBuilder.var("s"), predicate: SelectBuilder.var("x"), object: SelectBuilder.literal("y") }).build();

    expect(actual).to.deep.equal(new Parser().parse(expected));
  });

  it('orderBy()', () => {
    let query = "SELECT ?s { ?s ?p ?o }";
    let expected = "SELECT ?s { ?s ?p ?o } ORDER BY ?s";
    let actual = SelectBuilder.fromString(query).orderBy(SelectBuilder.ordering(SelectBuilder.var("s"))).build();

    expect(actual).to.deep.equal(new Parser().parse(expected));
  });

  it('orderBy(ASC ASC)', () => {
    let query = "SELECT ?s { ?s ?p ?o }";
    let expected = "SELECT ?s { ?s ?p ?o } ORDER BY ?s ?p";
    let actual = SelectBuilder.fromString(query).orderBy(SelectBuilder.ordering(SelectBuilder.var("s"), false)).orderBy(SelectBuilder.ordering(SelectBuilder.var("p"))).build();

    expect(actual).to.deep.equal(new Parser().parse(expected));
  });

  it('orderBy(DESC ASC)', () => {
    let query = "SELECT ?s { ?s ?p ?o }";
    let expected = "SELECT ?s { ?s ?p ?o } ORDER BY DESC(?s) ?p";
    let actual = SelectBuilder.fromString(query).orderBy(SelectBuilder.ordering(SelectBuilder.var("s"), true)).orderBy(SelectBuilder.ordering(SelectBuilder.var("p"))).build();

    expect(actual).to.deep.equal(new Parser().parse(expected));
  });

  it('limit()', () => {
    let query = "SELECT ?s { ?s ?p ?o }";
    let expected = "SELECT ?s { ?s ?p ?o } LIMIT 42";
    let actual = SelectBuilder.fromString(query).limit(42).build();

    expect(actual).to.deep.equal(new Parser().parse(expected));
  });

  it('offset()', () => {
    let query = "SELECT ?s { ?s ?p ?o }";
    let expected = "SELECT ?s { ?s ?p ?o } OFFSET 66";
    let actual = SelectBuilder.fromString(query).offset(66).build();

    expect(actual).to.deep.equal(new Parser().parse(expected));
  });

  it('limit().offset().orderBy(DESC ASC)', () => {
    let query = "SELECT ?s { ?s ?p ?o }";
    let expected = "SELECT ?s { ?s ?p ?o } ORDER BY DESC(?s) ?p LIMIT 42 OFFSET 66";
    let actual = SelectBuilder.fromString(query).limit(42).offset(66).orderBy(SelectBuilder.ordering(SelectBuilder.var("s"), true)).orderBy(SelectBuilder.ordering(SelectBuilder.var("p"))).build();

    expect(actual).to.deep.equal(new Parser().parse(expected));
  });

  it('variablesAll()', () => {
    let query = "SELECT ?s { ?s ?p ?o }";
    let expected = "SELECT * { ?s ?p ?o }";
    let actual = SelectBuilder.fromString(query).variablesAll().build();

    expect(actual).to.deep.equal(new Parser().parse(expected));
  });

  it('variables()', () => {
    let query = "SELECT ?s { ?s ?p ?o }";
    let expected = "SELECT ?x ?y { ?s ?p ?o }";
    let actual = SelectBuilder.fromString(query).variables([ SelectBuilder.var("x"), SelectBuilder.var("y") ]).build();

    expect(actual).to.deep.equal(new Parser().parse(expected));
  });

  it('variable()', () => {
    let query = "SELECT ?s { ?s ?p ?o }";
    let expected = "SELECT ?s ?x ?y { ?s ?p ?o }";
    let actual = SelectBuilder.fromString(query).variable(SelectBuilder.var("x")).variable(SelectBuilder.var("y")).build();

    expect(actual).to.deep.equal(new Parser().parse(expected));
  });

  it('isVariable()', () => {
    let query = "SELECT ?s { ?s ?p ?o }";

    expect(SelectBuilder.fromString(query).isVariable(SelectBuilder.var("s"))).to.equal(true);
  });

  it('!isVariable()', () => {
    let query = "SELECT ?s { ?s ?p ?o }";

    expect(SelectBuilder.fromString(query).isVariable(SelectBuilder.var("x"))).to.equal(false);
  });

});
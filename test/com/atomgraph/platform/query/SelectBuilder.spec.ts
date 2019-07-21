import { SelectBuilder } from '../../../../../src/com/atomgraph/platform/query/SelectBuilder';
import { Parser } from 'sparqljs';
import { expect } from 'chai';
import 'mocha';

describe('SelectBuilder', () => {

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

  it('isProjected()', () => {
    let query = "SELECT ?s { ?s ?p ?o }";

    expect(SelectBuilder.fromString(query).isProjected(SelectBuilder.var("s"))).to.equal(true);
  });

  it('!isProjected()', () => {
    let query = "SELECT ?s { ?s ?p ?o }";

    expect(SelectBuilder.fromString(query).isProjected(SelectBuilder.var("x"))).to.equal(false);
  });

});
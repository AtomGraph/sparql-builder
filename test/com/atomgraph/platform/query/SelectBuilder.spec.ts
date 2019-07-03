import { SelectBuilder } from '../../../../../src/com/atomgraph/platform/query/SelectBuilder';
import { Parser, Term } from 'sparqljs';
import { expect } from 'chai';
import 'mocha';

describe('SelectBuilder', () => {

  it('orderByExpression()', () => {
    let query = "SELECT ?s { ?s ?p ?o }";
    let expected = "SELECT ?s { ?s ?p ?o } ORDER BY ?s";
    let actual = SelectBuilder.fromString(query).orderByExpression(SelectBuilder.var("s")).build();

    expect(actual).to.deep.equal(new Parser().parse(expected));
  });

  it('orderByExpression(false)', () => {
    let query = "SELECT ?s { ?s ?p ?o }";
    let expected = "SELECT ?s { ?s ?p ?o } ORDER BY ?s ?p";
    let actual = SelectBuilder.fromString(query).orderByExpression(SelectBuilder.var("s"), false).orderByExpression(SelectBuilder.var("p")).build();

    expect(actual).to.deep.equal(new Parser().parse(expected));
  });

  it('orderByExpression(true)', () => {
    let query = "SELECT ?s { ?s ?p ?o }";
    let expected = "SELECT ?s { ?s ?p ?o } ORDER BY DESC(?s) ?p";
    let actual = SelectBuilder.fromString(query).orderByExpression(SelectBuilder.var("s"), true).orderByExpression(SelectBuilder.var("p")).build();

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

  it('limit().offset().orderByExpression(true)', () => {
    let query = "SELECT ?s { ?s ?p ?o }";
    let expected = "SELECT ?s { ?s ?p ?o } ORDER BY DESC(?s) ?p LIMIT 42 OFFSET 66";
    let actual = SelectBuilder.fromString(query).limit(42).offset(66).orderByExpression(SelectBuilder.var("s"), true).orderByExpression(SelectBuilder.var("p")).build();

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
import { SelectBuilder } from '../../../../../src/com/atomgraph/platform/query/SelectBuilder';
import { Parser, Term } from 'sparqljs';
import { expect } from 'chai';
import 'mocha';

describe('should build an equivalent query', () => {

  it('orderByVar()', () => {
    let query = "SELECT ?s { ?s ?p ?o }";
    let expected = "SELECT ?s { ?s ?p ?o } ORDER BY DESC(?s) ?p";
    let actual = SelectBuilder.fromString(query).orderByVar("s", true).orderByVar("p").build();

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

});
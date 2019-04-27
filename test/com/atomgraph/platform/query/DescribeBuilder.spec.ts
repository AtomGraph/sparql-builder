import { DescribeBuilder } from '../../../../../src/com/atomgraph/platform/query/DescribeBuilder';
import { SelectBuilder } from '../../../../../src/com/atomgraph/platform/query/SelectBuilder';
import { Parser, Term } from 'sparqljs';
import { expect } from 'chai';
import 'mocha';

describe('DescribeBuilder', () => {

  it('new()', () => {
    let expected = "DESCRIBE *";
    let actual = DescribeBuilder.new().build();

    expect(actual).to.deep.equal(DescribeBuilder.fromString(expected).build());
  });

  it('projectAll()', () => {
    let query = "DESCRIBE ?x { ?x ?y ?z }";
    let expected = "DESCRIBE * { ?x ?y ?z }";
    let actual = DescribeBuilder.fromString(query).projectAll().build();

    expect(actual).to.deep.equal(DescribeBuilder.fromString(expected).build());
  });

  it('project()', () => {
    let query = "DESCRIBE * { ?x ?y ?z }";
    let expected = "DESCRIBE ?x <http://a> { ?x ?y ?z }";
    let actual = DescribeBuilder.fromString(query).projection([]).project(DescribeBuilder.var("x")).project(DescribeBuilder.uri("http://a")).build();

    expect(actual).to.deep.equal(DescribeBuilder.fromString(expected).build());
  });

  it('isProjected()', () => {
    let query = "SELECT ?s { ?s ?p ?o }";

    expect(SelectBuilder.fromString(query).isProjected(SelectBuilder.var("s"))).to.equal(true);
  });

  it('!isProjected()', () => {
    let query = "SELECT ?s { ?s ?p ?o }";

    expect(SelectBuilder.fromString(query).isProjected(SelectBuilder.var("x"))).to.equal(false);
  });

  it('where(SelectBuilder.limit().offset().build())', () => {
    let query = "DESCRIBE * { ?x ?y ?z }";
    let subQuery = "SELECT * { ?a ?b ?c }";
    let expected = "DESCRIBE * { ?x ?y ?z { " + subQuery + " LIMIT 10 OFFSET 20 } }";

    // prefixes don't match when compared as JSON objects
    //let actual = DescribeBuilder.fromString(query).where(SelectBuilder.fromString(subQuery).limit(10).offset(20).build()).build();
    //expect(actual).to.deep.equal(DescribeBuilder.fromString(expected).build());

    // compare as strings insted
    let actual = DescribeBuilder.fromString(query).where(SelectBuilder.fromString(subQuery).limit(10).offset(20).build()).toString();
    expect(actual).to.equal(DescribeBuilder.fromString(expected).toString());
  });

  it('toString()', () => {
    let expected = "DESCRIBE * WHERE { ?x ?y ?z. }";
    let actual = DescribeBuilder.fromString(expected).toString();

    expect(actual).to.equal(expected);
  });

});
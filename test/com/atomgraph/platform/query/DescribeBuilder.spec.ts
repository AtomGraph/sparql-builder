import { DescribeBuilder } from '../../../../../src/com/atomgraph/platform/query/DescribeBuilder';
import { SelectBuilder } from '../../../../../src/com/atomgraph/platform/query/SelectBuilder';
import { Parser, Term } from 'sparqljs';
import { expect } from 'chai';
import 'mocha';

describe('should build an equivalent query', () => {

  it('project()', () => {
    let query = "DESCRIBE * { ?x ?y ?z }";
    let expected = "DESCRIBE ?x <http://a> { ?x ?y ?z }";
    let actual = DescribeBuilder.fromString(query).projection([]).project(DescribeBuilder.var("x")).project(DescribeBuilder.uri("http://a")).build();

    expect(actual).to.deep.equal(DescribeBuilder.fromString(expected).build());
  });

  it('where(SelectBuilder.limit().offset().build())', () => {
    let query = "DESCRIBE * { ?x ?y ?z }";
    let subQuery = "SELECT * { ?a ?b ?c }";
    let expected = "DESCRIBE * { ?x ?y ?z { " + subQuery + " LIMIT 10 OFFSET 20 } }";
    let actual = DescribeBuilder.fromString(query).where(SelectBuilder.fromString(subQuery).limit(10).offset(20).build()).build();

    expect(actual).to.deep.equal(DescribeBuilder.fromString(expected).build());
  });

});
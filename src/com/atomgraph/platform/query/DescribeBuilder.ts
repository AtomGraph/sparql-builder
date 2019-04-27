import { Parser, DescribeQuery, Variable, VariableExpression, Term } from 'sparqljs';
import { QueryBuilder } from './QueryBuilder';

export class DescribeBuilder extends QueryBuilder
{

    constructor(describe: DescribeQuery)
    {
        super(describe);
    }

    public static fromString(queryString: string, prefixes?: { [prefix: string]: string; } | undefined, baseIRI?: string | undefined): DescribeBuilder
    {
        let query = new Parser(prefixes, baseIRI).parse(queryString);
        if (!<DescribeQuery>query) throw new Error("Only DESCIBE is supported");

        return new DescribeBuilder(<DescribeQuery>query);
    }

    public static new(): DescribeBuilder
    {
        return new DescribeBuilder({
          "queryType": "DESCRIBE",
          "variables": [
            "*"
          ],
          "type": "query",
          "prefixes": {}
        });
    }

    public projectAll(): DescribeBuilder
    {
        this.getQuery().variables = [ "*" ];

        return this;
    }

    public projection(variables: Variable[]): DescribeBuilder
    {
        this.getQuery().variables = variables;

        return this;
    }

    public project(term: Term): DescribeBuilder
    {
        this.getQuery().variables.push(<Term & "*">term);

        return this;
    }

    public isProjected(term: Term): boolean
    {
        return this.getQuery().variables.includes(<Term & "*">term);
    }

    protected getQuery(): DescribeQuery
    {
        return <DescribeQuery>super.getQuery();
    }

    public build(): DescribeQuery
    {
        return <DescribeQuery>super.build();
    }

}
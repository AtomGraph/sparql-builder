import { Parser, Query, BaseQuery, Pattern, Expression, FilterPattern, OperationExpression, Term } from 'sparqljs';

export class QueryBuilder
{

    private query: BaseQuery;

    constructor(query: Query)
    {
        this.query = query;
    }

    public static fromString(queryString: string, prefixes?: { [prefix: string]: string; } | undefined, baseIRI?: string | undefined): QueryBuilder
    {
        let query = new Parser(prefixes, baseIRI).parse(queryString);
        if (!<Query>query) throw new Error("SPARQL updates are not supported");

        return new QueryBuilder(<Query>query);
    }

    public where(pattern: Pattern): QueryBuilder
    {
        if (!this.query.where) this.query.where = [];
        this.query.where.push(pattern);

        return this;
    }

    public filter(filter: FilterPattern): QueryBuilder
    {
        this.where(filter);

        return this;
    }

    public filterRegex(varName: string, pattern: string, caseInsensitive?: boolean): QueryBuilder
    {
        let expression: OperationExpression = {
            "type": "operation",
            "operator": "regex",
            "args": [ <Term>("?" + varName), <Term>("\"" + pattern + "\"")]
        };

        if (caseInsensitive) expression.args.push(<Term>"\"i\"");

        let filter: FilterPattern = {
            "type": "filter",
            "expression": expression
        };

        this.filter(filter);

        return this;
    }

    public filterIn(varName: string, list: Term[]): QueryBuilder
    {
        let expression: OperationExpression = {
            "type": "operation",
            "operator": "in",
            "args": [<Term>("?" + varName), list]
        };

        let filter: FilterPattern = {
            "type": "filter",
            "expression": expression
        };

        this.filter(filter);

        return this;
    }

    public build(): Object
    {
        return this.query;
    }

    public static escapeLiteral(value: string): Term
    {
        return <Term>("\"" + value + "\"");
    }

}
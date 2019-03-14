import { Parser, Query, BaseQuery, Pattern, Expression, FilterPattern, BgpPattern, OperationExpression, Triple, Term } from 'sparqljs';

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
        if (!<Query>query) throw new Error("Only SPARQL queries are supported, not updates");

        return new QueryBuilder(<Query>query);
    }

    public where(pattern: Pattern): QueryBuilder
    {
        if (!this.getQuery().where) this.getQuery().where = [];
        this.getQuery().where!.push(pattern);

        return this;
    }

    public bgp(bgp: BgpPattern): QueryBuilder
    {
        return this.where(bgp);
    }

    public bgpTriples(triples: Triple[]): QueryBuilder
    {
        let bgp: BgpPattern = {
          "type": "bgp",
          "triples": triples
        };

        // if the last pattern is BGP, append triples to it instead of adding new BGP
        if (this.getQuery().where)
        {
            let lastPattern = this.getQuery().where![this.getQuery().where!.length - 1];
            if (lastPattern.type === "bgp")
            {
                lastPattern.triples = lastPattern.triples.concat(triples);
                return this;
            }
        }

        return this.bgp(bgp);
    }

    public bgpTriple(triple: Triple): QueryBuilder
    {
        return this.bgpTriples([triple]);
    }

    public filter(filter: FilterPattern): QueryBuilder
    {
        return this.where(filter);
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

        return this.filter(filter);
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

        return this.filter(filter);
    }

    protected getQuery(): BaseQuery
    {
        return this.query;
    }

    public build(): Object
    {
        return this.getQuery();
    }

    public static variable(varName: string): Term
    {
        return <Term>("?" + varName);
    }

    public static literal(value: string): Term
    {
        return <Term>("\"" + value + "\"");
    }

}
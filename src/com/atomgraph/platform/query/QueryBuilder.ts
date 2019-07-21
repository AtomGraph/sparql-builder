import { Parser, Query, BaseQuery, Pattern, Expression, FilterPattern, BgpPattern, GroupPattern, OperationExpression, Triple, Term, Generator, SparqlGenerator } from 'sparqljs';

export class QueryBuilder
{

    private readonly query: Query;
    private readonly generator: SparqlGenerator;

    constructor(query: Query)
    {
        this.query = query;
        this.generator = new Generator();
        if (!this.query.prefixes) this.query.prefixes = {};
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

    public bgpTriples(triples: Triple[]): QueryBuilder
    {
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

        return this.where(QueryBuilder.bgp(triples));
    }

    public bgpTriple(triple: Triple): QueryBuilder
    {
        return this.bgpTriples([triple]);
    }

    protected getQuery(): Query
    {
        return this.query;
    }

    protected getGenerator(): SparqlGenerator
    {
        return this.generator;
    }

    public build(): Query
    {
        return this.getQuery();
    }

    public toString(): string
    {
        return this.getGenerator().stringify(this.getQuery());
    }

    public static var(varName: string): Term
    {
        return <Term>("?" + varName);
    }

    public static literal(value: string): Term
    {
        return <Term>("\"" + value + "\"");
    }

    public static uri(value: string): Term
    {
        return <Term>value;
    }

    public static bgp(triples: Triple[]): BgpPattern
    {
        return {
          "type": "bgp",
          "triples": triples
        };
    }

    public static group(patterns: Pattern[]): GroupPattern
    {
        return {
            "type": "group",
            "patterns": patterns
        }
    }

    public static filter(expression: Expression): FilterPattern
    {
        return {
            "type": "filter",
            "expression": expression
        }
    }

    public static in(varName: string, list: Term[]): OperationExpression
    {
        return {
            "type": "operation",
            "operator": "in",
            "args": [ QueryBuilder.var(varName), list]
        };
    }

    public static regex(varName: string, pattern: string, caseInsensitive?: boolean): OperationExpression
    {
        let expression: OperationExpression = {
            "type": "operation",
            "operator": "regex",
            "args": [ <Term>("?" + varName), <Term>("\"" + pattern + "\"")]
        };

        if (caseInsensitive) expression.args.push(<Term>"\"i\"");

        return expression;
    }

}
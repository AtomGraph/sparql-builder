import { Parser, Query, BaseQuery, Pattern, Expression, BlockPattern, FilterPattern, BgpPattern, GraphPattern, GroupPattern, OperationExpression, Triple, Term, PropertyPath, Generator, SparqlGenerator } from 'sparqljs';

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

    public static fromQuery(query: Query): QueryBuilder
    {
        return new QueryBuilder(query);
    }

    public static fromString(queryString: string, prefixes?: { [prefix: string]: string; } | undefined, baseIRI?: string | undefined): QueryBuilder
    {
        let query = new Parser(prefixes, baseIRI).parse(queryString);
        if (!<Query>query) throw new Error("Only SPARQL queries are supported, not updates");

        return new QueryBuilder(<Query>query);
    }

    public where(pattern: Pattern[]): QueryBuilder
    {
        this.getQuery().where = pattern;

        return this;
    }

    public wherePattern(pattern: Pattern): QueryBuilder
    {
        if (!this.getQuery().where) this.where([]);
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

        return this.wherePattern(QueryBuilder.bgp(triples));
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

    public static term(value: string): Term
    {
        return <Term>value;
    }

    public static var(varName: string): Term
    {
        return <Term>("?" + varName);
    }

    public static literal(value: string): Term
    {
        return <Term>("\"" + value + "\"");
    }

    public static typedLiteral(value: string, datatype: string): Term
    {
        return <Term>("\"" + value + "\"^^" + datatype);
    }

    public static uri(value: string): Term
    {
        return <Term>value;
    }

    public static triple(subject: Term, predicate: PropertyPath | Term, object: Term): Triple
    {
        return {
            "subject": subject,
            "predicate": predicate,
            "object": object
        };
    }

    public static bgp(triples: Triple[]): BgpPattern
    {
        return {
          "type": "bgp",
          "triples": triples
        };
    }

    public static graph(name: string, patterns: Pattern[]): GraphPattern
    {
        return {
            "type": "graph",
            "name": <Term>name,
            "patterns": patterns
        }
    }

    public static group(patterns: Pattern[]): GroupPattern
    {
        return {
            "type": "group",
            "patterns": patterns
        }
    }

    public static union(patterns: Pattern[]): BlockPattern
    {
        return {
            "type": "union",
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

    public static operation(operator: string, args: Expression[]): OperationExpression
    {
        return {
            "type": "operation",
            "operator": operator,
            "args": args
        };
    }

    public static in(term: Term, list: Term[]): OperationExpression
    {
        return QueryBuilder.operation("in", [ term, list ]);
    }

    public static regex(term: Term, pattern: Term, caseInsensitive?: boolean): OperationExpression
    {
        let expression: OperationExpression = {
            "type": "operation",
            "operator": "regex",
            "args": [ term, <Term>("\"" + pattern + "\"") ]
        };

        if (caseInsensitive) expression.args.push(<Term>"\"i\"");

        return expression;
    }

    public static eq(arg1: Expression, arg2: Expression): OperationExpression
    {
        return QueryBuilder.operation("=", [ arg1, arg2 ]);
    }

    public static str(arg: Expression): OperationExpression
    {
        return QueryBuilder.operation("str", [ arg ]);
    }

}
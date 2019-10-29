import { Parser, SelectQuery, Ordering, Term, Variable, Expression } from 'sparqljs';
import { QueryBuilder } from './QueryBuilder';

export class SelectBuilder extends QueryBuilder
{

    constructor(select: SelectQuery)
    {
        super(select);
    }

    public static fromString(queryString: string, prefixes?: { [prefix: string]: string; } | undefined, baseIRI?: string | undefined): SelectBuilder
    {
        let query = new Parser(prefixes, baseIRI).parse(queryString);
        if (!<SelectQuery>query) throw new Error("Only SELECT is supported");

        return new SelectBuilder(<SelectQuery>query);
    }

    public projectAll(): SelectBuilder
    {
        this.getQuery().variables = [ "*" ];

        return this;
    }

    public projection(variables: Variable[]): SelectBuilder
    {
        this.getQuery().variables = variables;

        return this;
    }

    public project(term: Term): SelectBuilder
    {
        this.getQuery().variables.push(<Term & "*">term);

        return this;
    }

    public isProjected(term: Term): boolean
    {
        return this.getQuery().variables.includes(<Term & "*">term);
    }

    public orderBy(ordering: Ordering): SelectBuilder
    {
        if (!this.getQuery().order) this.getQuery().order = [];
        this.getQuery().order!.push(ordering);

        return this;
    }

    public offset(offset: number): SelectBuilder
    {
        this.getQuery().offset = offset;

        return this;
    }

    public limit(limit: number): SelectBuilder
    {
        this.getQuery().limit = limit;

        return this;
    }

    protected getQuery(): SelectQuery
    {
        return <SelectQuery>super.getQuery();
    }

    public build(): SelectQuery
    {
        return <SelectQuery>super.build();
    }

    public static ordering(expr: Expression, desc?: boolean): Ordering
    {
        let ordering: Ordering = {
          "expression": expr,
        };

        if (desc !== undefined && desc == true) ordering.descending = desc;

        return ordering;
    }

}
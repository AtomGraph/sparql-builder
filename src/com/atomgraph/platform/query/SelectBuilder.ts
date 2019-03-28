import { Parser, SelectQuery, Ordering } from 'sparqljs';
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

    public orderBy(ordering: Ordering): SelectBuilder
    {
        if (!this.getQuery().order) this.getQuery().order = [];
        this.getQuery().order!.push(ordering);

        return this;
    }

    public orderByVar(varName: string, desc?: boolean): SelectBuilder
    {
        let ordering: Ordering = {
          "expression": SelectBuilder.var(varName),
        };
        if (desc !== undefined) ordering.descending = desc;

        return this.orderBy(ordering);
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

}
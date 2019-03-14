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
        if (!this.getSelectQuery().order) this.getSelectQuery().order = [];
        this.getSelectQuery().order!.push(ordering);

        return this;
    }

    public orderByVar(varName: string, desc?: boolean): SelectBuilder
    {
        let ordering: Ordering = {
          "expression": SelectBuilder.variable(varName),
        };
        if (desc !== undefined) ordering.descending = desc;

        return this.orderBy(ordering);
    }

    public offset(offset: number): SelectBuilder
    {
        this.getSelectQuery().offset = offset;

        return this;
    }

    public limit(limit: number): SelectBuilder
    {
        this.getSelectQuery().limit = limit;

        return this;
    }

    private getSelectQuery(): SelectQuery
    {
        return <SelectQuery>this.getQuery();
    }

}
import { Parser } from 'sparqljs';
import { QueryBuilder } from './QueryBuilder';
export class SelectBuilder extends QueryBuilder {
    constructor(select) {
        super(select);
    }
    static fromString(queryString, prefixes, baseIRI) {
        let query = new Parser(prefixes, baseIRI).parse(queryString);
        if (!query)
            throw new Error("Only SELECT is supported");
        return new SelectBuilder(query);
    }
    orderBy(ordering) {
        if (!this.getSelectQuery().order)
            this.getSelectQuery().order = [];
        this.getSelectQuery().order.push(ordering);
        return this;
    }
    orderByVar(varName, desc) {
        let ordering = {
            "expression": SelectBuilder.variable(varName),
        };
        if (desc !== undefined)
            ordering.descending = desc;
        return this.orderBy(ordering);
    }
    offset(offset) {
        this.getSelectQuery().offset = offset;
        return this;
    }
    limit(limit) {
        this.getSelectQuery().limit = limit;
        return this;
    }
    getSelectQuery() {
        return this.getQuery();
    }
}

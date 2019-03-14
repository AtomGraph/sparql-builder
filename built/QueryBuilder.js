import { Parser } from 'sparqljs';
export class QueryBuilder {
    constructor(query) {
        this.query = query;
    }
    static fromString(queryString, prefixes, baseIRI) {
        let query = new Parser(prefixes, baseIRI).parse(queryString);
        if (!query)
            throw new Error("Only SPARQL queries are supported, not updates");
        return new QueryBuilder(query);
    }
    where(pattern) {
        if (!this.getQuery().where)
            this.getQuery().where = [];
        this.getQuery().where.push(pattern);
        return this;
    }
    filter(filter) {
        this.where(filter);
        return this;
    }
    filterRegex(varName, pattern, caseInsensitive) {
        let expression = {
            "type": "operation",
            "operator": "regex",
            "args": [("?" + varName), ("\"" + pattern + "\"")]
        };
        if (caseInsensitive)
            expression.args.push("\"i\"");
        let filter = {
            "type": "filter",
            "expression": expression
        };
        this.filter(filter);
        return this;
    }
    filterIn(varName, list) {
        let expression = {
            "type": "operation",
            "operator": "in",
            "args": [("?" + varName), list]
        };
        let filter = {
            "type": "filter",
            "expression": expression
        };
        this.filter(filter);
        return this;
    }
    getQuery() {
        return this.query;
    }
    build() {
        return this.getQuery();
    }
    static variable(varName) {
        return ("?" + varName);
    }
    static literal(value) {
        return ("\"" + value + "\"");
    }
}

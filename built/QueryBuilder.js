export class QueryBuilder {
    constructor(query) {
        this.test = {
            "type": "query",
            "prefixes": {
                "dbpedia-owl": "http://dbpedia.org/ontology/"
            },
            "queryType": "SELECT",
            "variables": ["?p", "?c"],
            "where": [
                {
                    "type": "bgp",
                    "triples": [
                        {
                            "subject": "?p",
                            "predicate": "http://www.w3.org/1999/02/22-rdf-syntax-ns#type",
                            "object": "http://dbpedia.org/ontology/Artist"
                        },
                        {
                            "subject": "?p",
                            "predicate": "http://dbpedia.org/ontology/birthPlace",
                            "object": "?c"
                        },
                        {
                            "subject": "?c",
                            "predicate": "http://xmlns.com/foaf/0.1/name",
                            "object": "\"York\"@en"
                        }
                    ]
                }
            ]
        };
        this.query = query;
    }
    static fromString() {
    }
    where(element) {
        return this;
    }
    filter(varName, filter) {
        this.query["where"].push(filter);
        return this;
    }
    filterRegex(varName, pattern, caseInsensitive) {
        var expression = {
            "type": "operation",
            "operator": "regex",
            "args": [
                {
                    "termType": "Variable",
                    "value": varName
                },
                {
                    "termType": "Literal",
                    "value": pattern,
                    "language": "",
                    "datatype": {
                        "termType": "NamedNode",
                        "value": "http://www.w3.org/2001/XMLSchema#string"
                    }
                }
            ]
        };
        if (caseInsensitive === true)
            expression.args.push({
                "termType": "Literal",
                "value": "\"i\"",
                "language": "",
                "datatype": {
                    "termType": "NamedNode",
                    "value": "http://www.w3.org/2001/XMLSchema#string"
                }
            });
        var filter = {
            "type": "filter",
            "expression": expression
        };
        this.filter(varName, filter);
        return this;
    }
    build() {
        return this.query;
    }
}

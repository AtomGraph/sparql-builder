tsc --declaration # output in "build" folder
npm test
dts-bundle --name SPARQLBuilder --main "./build/src/com/atomgraph/platform/query/SPARQLBuilder.d.ts" --baseDir "build" --out "index.d.ts"
webpack # output in "dist" folder
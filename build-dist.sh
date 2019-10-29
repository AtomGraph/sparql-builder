tsc --declaration # output in "build" folder
npm test
webpack # output in "dist" folder
# dts-bundle --name SPARQLBuilder --main "./build/src/com/atomgraph/linkeddatahub/query/SPARQLBuilder.d.ts" --baseDir "build" --out "../dist/index.d.ts" --outputAsModuleFolder
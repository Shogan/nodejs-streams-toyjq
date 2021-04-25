# nodejs-streams-toyjq

A 'toy' version of jq as a demonstration of Node.js streams for processing data from stdin.

It is then possible to pipe the output of toyjq through to other command line tools, as you'll see in the examples below.

Relevant blog post with more details: [Node.js streams toyjq blog post](https://www.shogan.co.uk/development/using-node-js-streams-to-create-a-toy-version-of-jq/)

## Run straight from Node.js

`node src/toyjq.js`

or

`cat example.json | node src/toyjq.js`

## Build using vercel pkg

```
npm install -g pkg
pkg .\src\toyjq.js
```

## Examples

Assuming you're on a Linux platform and have built the source with the **pkg** command, you'll have the **toyjq-linux** binary at hand:

Pretty print input JSON

`cat ./example.json | toyjq-linux`

```
{
  name: 'directoryobject',
  path: '/path/to/directoryobject',
  type: 'Directory',
  children: [ { foo: 'bar' }, { foo: 'bar1' } ]
}
```

Output the `type` field only from input JSON:

`cat ./example.json | toyjq-linux '.type'`

```
"Directory"
```

Output just the `name` and `children` fields in the input JSON:

`cat ./example.json | toyjq-linux '{name, children}'`

```
{
  name: 'directoryobject',
  children: [ { foo: 'bar' }, { foo: 'bar1' } ]
}
```

Select the items in the `children` array only:

`cat ./example.json | toyjq-linux '.children[]`

```
{
  "foo": "bar"
}
{
  "foo": "bar1"
}
```

## Passing through more pipelines

Assuming now the Windows platform, and using a PowerShell cmdlet for this example:

Select the children array, convert it to an object in PowerShell and then select the last item in that object array:

`(cat .\example.json | .\toyjq-win.exe '.children' | ConvertFrom-Json).foo | Select -Last 1`

```
bar1
```

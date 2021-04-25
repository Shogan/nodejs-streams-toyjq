// 'Toy' version of jq to process and filter JSON input from the command-line.
// This is hacked together quickly, and purely used as an example of using Transform streams in Node.js.

const {Transform} = require('stream')
const TransformStream = new Transform;
TransformStream._transform = (chunk, encoding, callback) => {

    let filter = process.argv[2] || "";
    if (filter.startsWith(".")) filter = filter.substring(1, filter.length);
    const chunkString = chunk.toString();
    const filterFields = filter.startsWith("{") && filter.endsWith("}");
    let returnObject = {};
    if (filterFields) {
        let fields = filter
            .substring(1, filter.length - 1)
            .split(",")
            .map((fieldItem => { return fieldItem.trim(); }));

        fields.forEach((field) => {
            const selectedItem = JSON.parse(chunkString)[field];
            returnObject[field] = selectedItem;
        });

        console.log(returnObject);
    } else {
        
        let itemIsArray = filter.endsWith("[]") ? true : false;
        if (itemIsArray) {
            filter = filter.substring(0, filter.length - 2);
        }

        const selectedItem = JSON.parse(chunkString)[filter];
        if (itemIsArray && Array.isArray(selectedItem)) {
            selectedItem.forEach(i => { 
                const result = JSON.stringify(i, null, 2);
                console.log(result);
            });
        } else if (filter === "") {
            console.log(JSON.parse(chunkString));
        }
        else {
            const result = JSON.stringify(selectedItem, null, 2);
            console.log(result);
        }
    }

    callback();
}

process.stdin.pipe(TransformStream);
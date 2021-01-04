# schemodo

A library for validating and processing data structures with a focus on 
versatility, immutability and support for `async`/`await`. Inspired by
[validate](https://www.npmjs.com/package/validate) and
[mongoose](https://mongoosejs.com/) - but altogether a little different.

## Installation

Install with `npm`:

```bash
npm i schemodo --save
```

Then use it in your project:

```javascript
const sm = require('schemodo');
```

## Create a Schema

First, define a `Schema`:

```javascript
const schema = new sm.Schema({
    name: String,
    age: {
        type: Number,
        size: { max: 100, },
    },
    options: {
        darkMode: Boolean,
        showImages: {
            type: Boolean,
            $default: true,
        }
    },
});
```

Then, `validate` or `normalize` a data structure:

```javascript
// Validate:
const result = schema.validate( input );

if( result.ok() ){ 
    console.log( result.value );
}
else {
    const numErrors = result.errors.length;
    console.log( `Error count: ${numErrors}` );
}

// Normalize:
try {
    const output = schema.normalize( input );
    console.log( output );
} 
catch( err ){

    const result = err.result,
          numErrors = result.errors.length;
    
    console.log( `Error count: ${numErrors}` );

}
```

If no errors are encountered, the output matches the schema format and some
values have been `typecast`:

```javascript
const input = {
    name: 'Matt',
    age: '40',
    options: {
        darkMode: 'false',
    },
};

const output = schema.normalize( input );

// output:
{
    name: 'Matt',
    age: 40,
    options: {
        darkMode: false,
        showImages: true,
    },
}
```

## Register a Model

A model is a named schema that you register on the main **schemodo** object:

```javascript
const sm = require('schemodo');
const myschema = new sm.Schema({ /* ... */ });

sm.model( 'myschema', myschema );
```

After which you can reference it using:

```javascript
const myschema = sm.model('myschema');
```

or:

```javascript
const myschema = sm('myschema');
```
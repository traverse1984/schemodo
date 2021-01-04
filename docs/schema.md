# Schema

A `Schema` is a re-usable construct comprised of **props** (short for 
properties). With a schema you can validate and process data based
on a pre-defined format. Common validation patterns are built in, and
adding your own validation and processing methods is easy.

## Props

Props are the building blocks of a schema. There is an entire section devoted
to [props](/props) and their various options; but here is a brief overview.
Define a prop by creating an object with a `type` key:

```javascript
const schema = new sm.Schema({
    name: {
        type: String,
    },
    age: {
        type: Number,
    },
});
```

When working with simple props, you can use a shorthand definition:

```javascript
const schema = new sm.Schema({
    name: String,
    age: Number,
});
```

In this example we want to use the **type** key in our data format, so we
must use a full definition:

```javascript
const schema = new sm.Schema({
    type: Object,
    props: {
        name: String,
        age: Number,
        type: String,
    },
});
```

In the last example that we defined the schema with a prop. Every schema has
a **root prop** which is the entry-point to processing. It's just like any 
other prop but is always `required`. This means you can create a schema that validates something other than an object:

```javascript
// An Array of Strings
const arr = new sm.Schema([String]);
arr.validate([ 'a', 'b', 'c', ]);

// A Set of Numbers
const set = new sm.Schema({
    type: Set,
    each: Number,
});
set.validate( new Set([ 1, 2, 3, ]) );

// A String
const str = new sm.Schema({ type: String, });
str.validate('Hello World');
```

## Schema Options

These options let you describe behaviour, set error messages and add
new validation patterns on a per-schema basis. Provide these options
when defining the schema. In this simple schema, all props are required:

```javascript
const schema = new sm.Schema({
    name: String,
    age: Number,
    $required: true,
});
```

It works with full prop definitions too - the following is functionally
the same:

```javascript
const schema = new sm.Schema({
    type: Object,
    props: {
        name: String,
        age: Number,
    },
    $required: true,
});
```

### $root

Use the value of `$root` as the basis for generating the root prop:

```javascript
const format = {
    name: String,
    age: Number,
};

const schema = new sm.Schema({
    $root: format,
    $required: true,
});
```
> If you pass a value to the `Schema` constructor containing a `$root` key, 
then any other keys which are not valid schema options will be disregarded. 
In this sense, the presence of a `$root` key takes precedence over a `type`
key.


### $name

Set the `$name` of the root prop. See [$name](/).

```javascript
const schema = new sm.Schema({
    name: String,
    age: Number,
    $name: 'user',
});
```

> If you use `$name` and `$root` together, you could set `$name` for the root
prop in two places. If you do this, an `Error` thrown even if the value of
`$name` is the same in both places.

### $typecast

Set the default `typecast` for props which have a default typecaster; expects
`Boolean`. See [typecast](/).

```javascript
const schema = new sm.Schema({
    name: String,
    age: Number,
    $typecast: false,
});
```

### $required

Set the default for `required` across the schema; expects `Boolean`. See 
[required](/).

```javascript
const schema = new sm.Schema({
    name: String,
    age: Number,
    $required: true,
});
```

### $async

Set the sync/async nature of `validate`, `normalize` and `process` on 
the schema; expects `Boolean`:

```javascript
const schema = new sm.Schema({
    name: String,
    age: Number,
    $async: true,
});

const result = await schema.validate({ /* ... */ });
const output = await schema.normalize({ /* ... */ });
```

### $validators

Define or overwrite `validators` that are available to all props in the
schema; expects `Object`. See [validators](/).

```javascript
const schema = new sm.Schema({
    name: {
        type: String,
        names: 2,
    },
    friends: [
        { type: String, names: 1, }
    ],
    $validators: {
        names( prop, value ){
            return value.split(' ').length === prop.names;
        },
    },
});

// valid input:
{
    name: 'Richard Wright',
    friends: [ 'Roger', 'David', 'Nick', ],
}
```

### $messages

Define or overwrite `messages` that are available to all props in the schema;
expects `Object`. See [messages](/).

```javascript
const schema = new sm.Schema({
    name: String,
    age: {
        type: Number,
        size: { max: 100, },
    },
    $required: true,
    $messages: {
        required: 'You need to give us something to work with!',
        size( prop ){
            return `I don't believe you are over ${prop.size.max} years old!`;
        },
    },
});
```

### $result

Specify a constructor to be used for validation results. See
[custom classes](/).

```javascript
class MyResult extends sm.ValidationResult {
    errorCount(){
        return this.errors.length;
    }
}

const schema = new sm.Schema({
    name: String,
    age: Number,
    $result: MyResult,
});

const input = {
    name: {
        first: 'Richard', 
        last: 'Wright', 
    },
    age: 'Sixty',
};

// Wrong input types
const result = schema.validate(input);

assert( result.errorCount() === 2 );
```

### $error

Specify a constructor to be used for validation errors. See
[custom classes](/).

```javascript
class MyError extends sm.ValidationError {
    isRootProp(){
        return this.prop === this.prop._schema.root;
    },
}

const schema = new sm.Schema({
    name: String,
    age: Number,
    $error: MyError,
});

// Wrong type
const result = schema.validate('Hello World');

assert( result.error.isRootProp() );
```

## Schema Defaults

All schema options (except for `$root`) can be set on `Schema.defaults`:

```javascript
sm.Schema.defaults.$required = true;

sm.Schema.defaults = {
    ...sm.Schema.defaults,
    $required: true,
    $typecast: false,
};
```

> Changes to defaults will not affect schemas that have already been created.

## Methods

### validateSync

**Arguments:**
* **value:** Input value to validate
* **afterStack:** Also execute the `after` middleware stack *(default=false)*

**Usage:**
```javascript
// With 'before' and 'use' middleware:
const result = schema.validateSync( value );

// With 'before, 'use' and 'after' middleware:
const result = schema.validateSync( value, true );
```

**Returns:** A validation result (see [results](/)).


### normalizeSync

**Arguments:**
* **value:** Input value to normalize
* **firstError:** Stop validating as soon as the first error is encountered *(default=true)*

**Usage:**
```javascript
// Throw after first error:
const value = schema.normalizeSync( value );

// Complete full validation
const value = schema.normalizeSync( value, false );
```

**Returns:** The processed value, or throws `NormalizeError`

### processSync

`validateSync` and `normalizeSync` are translated calls to `processSync`.

**Arguments:**
* **value:** Input value to process
* **before:** Execute the `before` middleware stack *(default=true)*
* **after:** Execute the `after` middleware stack *(default=true)*
* **firstError:** Stop processing as soon as the first error is encountered *(default=false)*

**Usage:**
```javascript
const result = schema.processSync( value, true, true, true );
```

**Returns:** A validation result (see [results](/)).

### validateAsync

Same as `validateSync`, but returns a Promise.

**Usage:**
```javascript
const result = await schema.validateAsync( value );
```

### normalizeAsync

Same as `normalizeAsync`, but returns a promise.

**Usage:**
```javascript
const value = await schema.normalizeAsync( value );
```

### processAsync

Same as `processAsync`, but returns a promise.

**Usage:**
```javascript
const result = await schema.processAsync( value, true, true, true );
```

### validate, normalize, process

Calls either the sync or async method, depending on the schema `$async`
setting.

```javascript
const syncSchema = new sm.Schema({
    test: String,
    $async: false,
});

const result = syncSchema.validate( value );
const value = syncSchema.normalize( value );

const asyncSchema = new sm.Schema({
    test: String,
    $async: true,
});

const result = await asyncSchema.validate( value );
const value = await asyncSchema.normalize( value );
```
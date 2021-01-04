# Props

Props are the building blocks of a schema. Think of a prop as a single unit of
validation and processing based upon a `type`. Common options are available on
all props. Depending on the type, additional options may be available. Where
available, shorthand syntax allows you to keep your schema more readable.

## Common Options

### type

Specifies the prop type. This option is **required** on every prop:

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

When no other options are required, you can typically use a shorthand 
definition:

```javascript
const schema = new sm.Schema({
    name: String,
    age: Number,
});
```

> `Object` and `Array` have additional shorthand definitions available. The
examples anbove have both used a shorthand `Object` definition. See [Object](/)
and [Array](/).

### $name

This meta-data option is to provide a more meaningful name to a prop than the
computed path. It doesn't affect functionality. The default `ValidationResult`
uses this option when generating an error map.

### required

Whether or not this prop is required when validating input. Defaults to the
schema's `$required` setting. See [validation](/).

### typecast

Whether or not to typecast this prop. Influenced by the schema's `$typecast`
setting. If you provide a function,
that function will be used as the typecaster for this prop only.

```javascript
const schema = new sm.Schema({
    name: {
        type: String,
        typecast: false,
    },
    age: {
        type: Number,
        typecast: true,
    },
    interests: {
        type: Array,
        each: String,
        typecast( prop, value ){
            // custom typecast
        },
    },
});
```

## Types

### Array

* `csv`: Convert comma separated string to array, default `false`

### BigInt

### Boolean

* `parse`: Parse common strings to their truthy/falsey values, default `true`
* `strict`: Fail typecast on values that are not boolean or boolean-like, dependant on strict setting.

### Date

### Function

### Map

Javascript map. If object is provided, it will be typecast to Map.

### null

Type check always succeeds

### Number

### Object

### RegExp

### Set

* `csv`: Convert comma separated string to set, default `false`

### String

* `trim`: Trim whitespace from start and end
* `upper`: Convert to upper-case
* `lower`: Convert to lower-case

### Symbol
# Props

Props are the building blocks of a schema. Think of a prop as a single unit of
validation and processing based upon a `type`. Common options are usable on
all props, and some prop types have additional options. Where available, 
shorthand syntax can help to keep your schema readable.

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
examples above have both used a shorthand `Object` definition. See [Object](/)
and [Array](/).

### required

Whether or not this prop is required when validating input. Defaults to the
schema's `$required` setting. Props which are not required are *skipped*.
See [validation](/validation).

```javascript
const schema = new sm.Schema({
    name: {
        type: String,
        required: true, // Required
    },
    age: {
        type: Number,
        required: false, // Not required
    },
    email: {
        type: String,
        // Not specified - use the schema's $required setting
    },
});
```

### typecast

Whether or not to typecast this prop. Defaults to the schema's `$typecast`
setting. If you provide a function, it will be used as the typecaster for
that prop:

```javascript
const schema = new sm.Schema({
    name: {
        type: String,
        typecast: false, // Do not typecast
    },
    age: {
        type: Number,
        typecast: true, // Typecast this prop
    },
    email: {
        type: String,
        // Not specified - use the schema's $typecast setting
    },
    interests: {
        type: Array,
        each: String,
        // Use custom typecast function. The default typecaster for
        // this prop type is passed as the third argument:
        typecast( prop, value, defaultTypecaster ){
            // If value is an object, return it's keys
            if( ! Array.isArray( value ) && typeof value === 'object' ){
                return Object.keys( value );
            }
            // Otherwise use the default typecaster
            return defaultTypecaster( prop, value );
        },
    },
});
```

> Typecast is always called `synchronously`.

> Typecast will never be called with `undefined`, `null` or `NaN` as a value.

### $default

A default value; used when no input is provided. Has no effect if the
prop is `required`. If input is provided for the prop, then it is
validated as normal.

```javascript
const schema = new sm.Schema({
    darkMode: {
        type: Boolean,
        required: true,
        $default: false, // No effect, input value is required
    },
    theme: {
        type: String,
        enum: [ 'dark', 'light', 'colourful', ],
        $default: 'light',
    },
});

const opts = schema.normalize({ darkMode: true, });
// opts = { darkMode: true, theme: 'light', }

const opts = schema.normalize({ theme: 'dark', });
// Error: Value required for darkMode

const opts = schema.normalize({ darkMode: true, theme: 'rainbow', });
// Error: Value not allowed for theme
```

### $name

Specify a more meaningful name to a prop than the computed path. It doesn't
affect how the schema functions. The default `ValidationResult` uses this
option when generating an error map:

```javascript
const schema = new sm.Schema({
    $name: 'survey',
    pets: {
        type: Array,
        each: {
            type: String,
            $name: 'pet',
            lower: true,
            trim: true,
            enum: [ 'cat', 'dog', 'hamster', 'goldfish', ],
        },
    },
});

// Expected object 
const errors = schema.validate( [] ).map(); 
// Without $name: { '': 'Must be of type Object' }
//    With $name: { survey: 'Must be of type Object' }

// Invalid array input:
const my_pets = [ 'cat', 'horse', ];
const errors = schema.validate( { pets: my_pets, } );
// Without $name: { 'pets.$': 'Value not allowed' }
//    With $name: { pet: 'Value not allowed' }
```

## Types

### Array

* `csv`: Convert comma separated string to array, default `false`
* `list`: Convert newline separated string to array, default `false`
* `split`: Convert string to array based on custom separator.
* `trim`: Before any of above options, trim input string.
* `trimEntries`: Before any of above options, trim values in output array.

An array of arrays of strings:

```javascript
const schema = new sm.Schema({
    items: [[String]]
});
```

Equivalents:

```javascript
const schema = new sm.Schema({
    items: Array,
});

const schema = new sm.Schema({
    items: [],
});
```

Equivalents:

```javascript
const schema = new sm.Schema({
    items: {
        type: Array,
        each: String,
    },
    pets: {
        type: Array,
        each: {
            type: String,
            enum: [ 'dog', 'cat', 'hamster', 'goldfish', ],
        },
    },
});

const schema = new sm.Schema({
    items: [String],
    pets: [{
        type: String,
        enum: [ 'dog', 'cat', 'hamster', 'goldfish', ],
    }],
});
```

Equivalents:

```javascript
const schema = new sm.Schema({
    data: {
        type: Array,
        each: {
            $or: [ Array, Object, String, ],
        },
    },
});

const schema = new sm.Schema({
    data: [ Array, Object, String, ],
});
```

### BigInt

### Boolean

* `parse`: Parse common strings to their truthy/falsey values, default `true`
* `strict`: Fail typecast on values that are not boolean or boolean-like, dependant on parse setting.

### Date

### Function

### Map

Javascript map. If object is provided, it will be typecast to Map.

### null

Type check always succeeds

### Number

### Object

Equivalents:

```javascript
const schema = new sm.Schema({
    items: Object,
});

const schema = new sm.Schema({
    items: {},
});
```

### RegExp

### Set

* `csv`: Convert comma separated string to set, default `false`
* `list`: Convert newline separated string to set, default `false`
* `split`: Convert string to set based on custom separator.
* `trim`: Before any of above options, trim input string.
* `trimEntries`: Before any of above options, trim values in output set.

### String

* `trim`: Trim whitespace from start and end
* `upper`: Convert to upper-case
* `lower`: Convert to lower-case

### Symbol
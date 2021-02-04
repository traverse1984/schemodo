# $or

## Notes

When specifying a conditional group, you can't use the shorthand definitions
for unvalidated `Object` or `Array`, e.g.

```javascript
// Is okay:
const schema = new sm.Schema({
    data: {
        $or: [ Array, Object, String, ],
    },
});

// Will throw an error:
const schema = new sm.Schema({
    data: {
        $or: [ [], {}, String, ],
    },
});
```

When specifying an `Array` with multiple possible entry types, you can use
the shorthand for unvalidated `Array` only:

```javascript
// Is okay:
const schema = new sm.Schema({
    data: [ Array, Object, String, ],
});

// Is still okay:
const schema = new sm.Schema({
    data: [ [], Object, String, ],
});

// Will throw an error:
const schema = new sm.Schema({
    data: [ [], {}, String, ],
});
```
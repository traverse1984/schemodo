# Validation

Schemodo validates input using a combination of in-built sequences and 
*middleware*. When the entire sequence completes for a prop it is considered
validated. One prop at a time, the structure of your schema is re-built
from the validated input values. The original input is not modified.

## Validation Failure

When a prop fails to validate, one of two things will happen:

* The validation error is registered and validation continues; or
* Processing stops immediately, the validation result has a single error.

This behaviour is determined by the `firstError` argument to `process`
or `normalize` and their explicit Sync/Async variants (see 
[Schema](/schema)). A call to `validate` will always validate
every reachable prop.

## Passable Values

A value is considered *passable* if it is anything other than `null`,
`undefined` or `NaN`. This paradigm is used throughout validation to determine
if a value was provided or should be modified.

## Validation Sequence

This sequence executes for each reachable prop. If a step fails, the rest of
the steps are ignored and the prop has failed to validate.

1. Perform `typecast` if value is *passable*
2. Run `before` middleware stack;
3. Validate `required`;
4. Validate `type`;
5. Run `use` middleware stack;
    * *If prop has child props, process these*
6. Run `after` middleware stack.

> Props become unreachable when an input fails to validate before reaching
it's child props.

## Child Props

Props which contain child props (e.g. `Object`) are processed recursively.
Schemodo recognizes **set-like** (e.g. `Array`, `Set`) and **map-like**
(e.g. `Object`, `Map`) props as having children. They share some traits:

* If the parent fails to validate (or is skipped) before processing it's 
child props, those children become *unreachable* on the current cycle. No 
attempt is made to validate those props.

* Child props which 

## Middleware

## Skipping Props

The third argument to a middleware function is `skip`. Calling this within your
middleware interrupts the validation sequence.

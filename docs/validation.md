# Validation

Schemodo validates input using a combination of in-built sequencing and
*middleware*. It's probably easier to show you:


## Advanced Breakdown 

1. Typecast input
2. Execute the `before` middleware
3. Execute `required` validation
4. Execute `type` validation
5. Execute `validators` on the prop
6. Execute the `use` middleware
7. If prop has sub-elements, process these elements
8. Execute the `after` middleware

## Middleware Execution 

1. Typecast input
1. * If typecast fails, throw error
2. Execute the `before` middleware
2. * Update value if function returns non null-like
2. * Register validation error if error is thrown
2. * Skip this prop if skip is used
3. Execute `required` validation
3. * Register validation error if prop was required and not provided
4. Execute `type` validation
4. * Register validation error if prop does not pass type matching
5. Execute `validators` on the prop
5. * Actually just prepended to the `use` stack, so same rules
6. Execute the `use` middleware
6. * Register validation error if error is thrown
6. * Skip this prop if skip is used
7. If prop has sub-elements, process these elements
8. Execute the `after` middleware
8. * Update value if function returns non null-like
8. * Register validation error if error is thrown
8. * Skip this prop if skip is used

## Skipping Props
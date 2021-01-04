const assert = require('assert'),
      sm = require('../../src/schemodo');

describe( 'Basic Schemas', function(){

    // Setup

    const types = [
        [ Array,    [1],                  ], 
        [ BigInt,   BigInt(1),            ],
        [ Boolean,  true                  ],
        [ Date,     new Date(),           ],
        [ Map,      new Map([['a', 1]]),  ],
        [ null,     'any',                ],
        [ Number,   1                     ],
        [ Object,   { a: 1, },            ],
        [ Function, () => {},             ],
        [ RegExp,   /a-z/,                ],
        [ Set,      new Set([1]),         ],
        [ String,   'string',             ],
        [ Symbol,   Symbol('test'),       ],
    ];

    const schema = {},
        test = {};

    for( let [type, value] of types ){

        const name = type === null ? 'null' : type.name,
            key = `type_${name}`;

        schema[key] = {
            type,
            required: true,
        };

        test[key] = value;

    }

    // Tests

    it( 'Should be able to build a schema from native types', function(){
        const model = new sm.Schema( schema );
    } );

    it( 'Should validate input from native types', function(){

        const model = new sm.Schema( schema );
        
        assert.doesNotThrow( () => model.normalize( test ) );

    } );

    it( 'Should accept different inputs for null-type', function(){

        const model = new sm.Schema({
            test: {
                type: null,
                required: true,
            },
        });

        function test( value ){
            return model.normalize({ test: value, });
        }

        assert.doesNotThrow( () => test(true) );
        assert.doesNotThrow( () => test([]) );
        assert.doesNotThrow( () => test({}) );
        assert.doesNotThrow( () => test(1) );

        assert.throws( () => test(null) );

    } );

    it( 'Should be possible to support the type object key in a full definition', function(){

        const schema = {
            type: Object,
            props: {
                type: {
                    type: String,
                },
            },
        };

        assert.doesNotThrow( () => new sm.Schema(schema) );

        const model = new sm.Schema(schema),
              result = model.validate({ type: 'test', });

        assert( result.ok() );

    } );

} );
const assert = require('assert'),
      sm = require('../../src/schemodo');

describe( 'Multiple-choice ($or)', function(){

    it( 'Should allow multiple type options', function(){

        const $or = [
            { type: Object, },
            { type: Array, },
            { type: String, },
        ];

        assert.doesNotThrow( () => {
            new sm.Schema({ $or, });
        } );

        const model = new sm.Schema({ $or, });

        assert.deepStrictEqual( 
            model.normalize({ test: true, }), 
            { test: true, } 
        );

        assert.deepStrictEqual(
            model.normalize([ 1, 2, 3, ]),
            [ 1, 2, 3, ]
        );

        assert.deepStrictEqual( model.normalize('test'), 'test' );

    } );

    it( 'Should merge and overwrite options from the base prop', function(){

        const model = new sm.Schema({
            type: String,
            required: true,
            $or: [
                { length: 4, },
                { required: false, length: 8, },
            ],
        });

        const props = model.root.$or;

        assert( props[0].required );
        assert.strictEqual( props[0].type, String );
        assert.strictEqual( props[0].length, 4 );

        assert.strictEqual( props[1].required, false );
        assert.strictEqual( props[1].type, String );
        assert.strictEqual( props[1].length, 8 );

    } );

    it( 'Should treat a multi-element array as an array of multiple types', function(){

        const model = new sm.Schema({
            type: Array,
            each: {
                $or: [
                    { type: Object, },
                    { type: Array, },
                    { type: String, },
                ],
            },
        });

        const short = new sm.Schema([Object, Array, String]);

        assert.deepStrictEqual( short, model );

    } );

    it( 'Should support nesting', function(){

        const schema = {
            $or: [
                {
                    type: String,
                    $or: [ { length: 4, }, { length: 8, }, ],
                },
                {
                    size: 4,
                    $or: [ Number, Set, ],
                },
            ],
        };

        assert.doesNotThrow( () => new sm.Schema(schema) );

        const model = new sm.Schema(schema);

        model.normalize( 'test' );
        model.normalize( 'testtest' );
        model.normalize( 4 );
        model.normalize( new Set([1,2,3,4,]) );

    } );

    it( 'Should support shorthand nesting', function(){

        // Each element either an array of Strings and Symbols or an Object
        const schema = [ [ String, Symbol, ], Object, ];

        assert.doesNotThrow( () => new sm.Schema(schema) );

        const model = new sm.Schema(schema);

        model.normalize([
            [ 'test', Symbol('test'), ],
            [ 'test', 'test', 'test', ],
            { test: true, },
            [],
            [ Symbol('test'), ],
            { test: false, },
        ]);

    } );

} );
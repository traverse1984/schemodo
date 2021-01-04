const assert = require('assert'),
      tObject = require('../../src/types/Object');

describe( 'Object', function(){

    describe( 'init', function(){

        const { init, set, get } = tObject;

        it( 'Should create an empty Object', function(){
            
            const obj = init({});

            assert.strictEqual( typeof obj, 'object' );
            assert.strictEqual( obj.constructor, Object );
            assert.strictEqual( Object.keys(obj).length, 0 );

        } );

        it( 'Should create a null-prototype object if one is passed', function(){

            const nullproto = Object.create(null),
                  obj = init(nullproto);

            assert.strictEqual( typeof obj, 'object' );
            assert.strictEqual( obj.constructor, undefined );
            assert.strictEqual( Object.keys(obj).length, 0 );

        } );

        it( 'Should be possible to get values', function(){

            const obj = { a: 1, b: 2, };

            assert.strictEqual( get( obj, 'a' ), 1 );
            assert.strictEqual( get( obj, 'b' ), 2 );

        } );

        it( 'Should be possible to set values', function(){

            const obj = {};

            set( obj, 'a', 1 );
            set( obj, 'b', 2 );

            assert.strictEqual( obj.a, 1 );
            assert.strictEqual( obj.b, 2 );
            
        } );

    } );

    describe( 'normalize', function(){

        const { normalize } = tObject;

        it( 'Should return a copy when the object contains a type key', function(){

            const defn = {
                type: String,
                required: true,
                length: { min: 3, max: 6, },
            };

            assert.deepStrictEqual( normalize(defn), defn );

        } );

        it( 'Should return an Object definition when no type key is present', function(){

            const defn = normalize({
                a: String,
                b: Number,
            });

            const target = {
                type: Object,
                props: {
                    a: String,
                    b: Number,
                },
            };

            assert.deepStrictEqual( defn, target );

        } );

    } );

} );
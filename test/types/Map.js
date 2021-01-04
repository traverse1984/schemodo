const assert = require('assert'),
      tMap = require('../../src/types/Map');

describe( 'Map', function(){

    describe( 'init', function(){

        const { init, set, get } = tMap;

        it( 'Should create an empty Map', function(){
            
            const map = init(new Map());

            assert( map instanceof Map );
            assert.strictEqual( map.size, 0 );

        } );

        it( 'Should be possible to get values', function(){

            const map = new Map().set('a', 1).set('b', 2);

            assert.strictEqual( get( map, 'a' ), 1 );
            assert.strictEqual( get( map, 'b' ), 2 );

        } );

        it( 'Should be possible to set values', function(){

            const map = new Map();

            set( map, 'a', 1 );
            set( map, 'b', 2 );

            assert.strictEqual( map.get('a'), 1 );
            assert.strictEqual( map.get('b'), 2 );
            
        } );

    } );

    describe( 'typecast', function(){

        const prop = { type: Map, };
        const { typecast } = tMap;

        it( 'Should create a map from an object', function(){

            const obj = { a: 1, b: 2, },
                  target = new Map().set('a', 1).set('b', 2),
                  cast = typecast( prop, obj );

            assert.deepStrictEqual( cast, target );

        } );

        it( 'Should throw if casting fails', function(){
            assert.throws( () => typecast( prop, 'string' ) );
        } );

    } );


} );
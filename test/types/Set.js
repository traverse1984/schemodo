const assert = require('assert'),
      tSet = require('../../src/types/Set');

describe( 'Set', function(){

    describe( 'init', function(){

        const { init, add } = tSet;

        it( 'Should create an empty set', function(){
            
            const set = init(new Set());

            assert( set instanceof Set );
            assert.strictEqual( set.size, 0 );

        } );

        it( 'Should be possible to add entries', function(){

            const set = new Set();

            add( set, 1 );
            add( set, 2 );

            assert.strictEqual( set.size, 2 );
            assert( set.has(1) );
            assert( set.has(2) );

        } );

    } );

    describe( 'typecast', function(){

        const { typecast } = tSet;
        const prop = { type: Set, };
        
        it( 'Parses CSV when required', function(){

            const value = '1, 2, 3',
                  expected = new Set([ '1', '2', '3', ]),
                  csv = { ...prop, csv: true, };
        
            assert.deepStrictEqual( typecast( csv, value ), expected );

        } );

        it( 'Should throw when casting fails', function(){
            assert.throws( () => typecast(1) );
        } );

    } );

    describe( 'normalize', function(){

        const { normalize } = tSet;

        it( 'Should not include an each definition unless provided', function(){

            const prop = normalize({ type: Set, });
            
            assert.strictEqual( 'each' in prop, false );

        } );

        it( 'Should set an Array type for entries if an empty array is provided', function(){

            const prop = normalize({
                type: Set,
                each: [],
            });

            assert.strictEqual( prop.each.type, Array );

        } );

        it( 'Should should set the each definition for a single element array', function(){

            const defn = { type: Number, };
            const prop = normalize({
                type: Set,
                each: [defn],
            });

            assert.deepStrictEqual( prop.each, defn );

        } );

        it( 'Should create an OR case for a multi element array', function(){

            const types = [String, Number];
            const prop = normalize({
                type: Set,
                each: types,
            });

            assert.deepStrictEqual( prop.each.$or, types );

        } );

    } );


} );
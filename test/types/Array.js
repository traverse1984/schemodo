const assert = require('assert'),
      tArray = require('../../src/types/Array');

describe( 'Array', function(){

    describe( 'init', function(){

        const { init, add } = tArray;

        it( 'Should create an empty array', function(){
            
            const arr = init([]);

            assert( Array.isArray(arr) );
            assert.strictEqual( arr.length, 0 );

        } );

        it( 'Should be possible to add entries', function(){

            const arr = [];

            add( arr, 1 );
            add( arr, 2 );

            assert.strictEqual( arr.length, 2 );
            assert.strictEqual( arr[0], 1 );
            assert.strictEqual( arr[1], 2 );

        } );

    } );

    describe( 'typecast', function(){

        const { typecast } = tArray;
        const prop = { type: Array, };
        
        it( 'Parses CSV with csv option', function(){

            const value = '1, 2, 3',
                  expected = [ '1', '2', '3', ],
                  csv = { ...prop, csv: true, };
        
            assert.deepStrictEqual( typecast( csv, value ), expected );

        } );
        
        it( 'Parses lists with list option', function(){

            const value = 'One \n Two \r\n Three \n',
                  expected = [ 'One', 'Two', 'Three', ],
                  list = { ...prop, list: true, };
        
            assert.deepStrictEqual( typecast( list, value ), expected );

        } );
        
        it( 'Parses strings based on a custom separator with split option', function(){

            const value = 'One|Two|Three',
                  expected = [ 'One', 'Two', 'Three', ],
                  split = { ...prop, split: '|', },
                  regex = { ...prop, split: /\|/, };
        
                  assert.deepStrictEqual( typecast( split, value ), expected );
                  assert.deepStrictEqual( typecast( regex, value ), expected );

        } );
        
        it( 'Does not trim input strings when trim option is false', function(){

            const value = 'One \n Two \r\n Three \n',
                  expected = [ 'One', 'Two', 'Three', '', ],
                  list = { ...prop, trim: false, list: true, };
        
            assert.deepStrictEqual( typecast( list, value ), expected );

        } );
        
        it( 'Does not trim entries from input strings when trimEntries option is false', function(){

            const value = 'One \n Two \r\n Three \n',
                  expected = [ 'One ', ' Two ', ' Three', ],
                  list = { ...prop, trimEntries: false, list: true, };
        
            assert.deepStrictEqual( typecast( list, value ), expected );

        } );

        it( 'Should throw when casting fails', function(){
            assert.throws( () => typecast(1) );
        } );

    } );

    describe( 'normalize', function(){

        const { normalize } = tArray;

        it( 'Should set a loose Array type when an empty array is provided', function(){

            const prop = normalize([]);

            assert.strictEqual( prop.type, Array );
            assert.strictEqual( 'each' in prop, false );

        } );

        it( 'Should should set the each definition for a single element array', function(){

            const defn = { type: Number, };
            const prop = normalize([defn]);

            assert.deepStrictEqual( prop.each, defn );

        } );

        it( 'Should create an OR case for a multi element array', function(){

            const types = [String, Number];
            const prop = normalize(types);

            assert.deepStrictEqual( prop.each.$or, types );

        } );

    } );


} );
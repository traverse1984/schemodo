const assert = require('assert'),
      tDate = require('../../src/types/Date');

describe( 'Date', function(){

    describe( 'typecast', function(){

        const prop = { type: Date, };
        const { typecast } = tDate;

        it( 'Should return a new Date', function(){
        
            const now = new Date(),
                  cast = typecast( prop, now );

            assert( cast instanceof Date );
            assert.strictEqual( now.valueOf(), cast.valueOf() );
            assert.notStrictEqual( cast, now );

        } );

        it( 'Should throw when casting fails', function(){
            assert.throws( () => typecast( prop, 'string' ) );
        } );

    } );

} );
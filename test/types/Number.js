const assert = require('assert'),
      tNumber = require('../../src/types/Number');

describe( 'Number', function(){

    describe( 'typecast', function(){

        const prop = { type: Number, };
        const { typecast } = tNumber;

        it( 'Should return a number', function(){
            assert.strictEqual( typeof typecast( prop, 1 ), 'number' );
        } );

        it( 'Should throw when casting fails', function(){
            assert.throws( () => typecast( prop, 'string' ) );
        } );

    } );

} );
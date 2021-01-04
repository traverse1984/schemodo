const assert = require('assert'),
      tBigInt = require('../../src/types/BigInt');

describe( 'BigInt', function(){

    describe( 'typecast', function(){

        const prop = { type: BigInt, };
        const { typecast } = tBigInt;

        it( 'Should return a BigInt', function(){
            assert.strictEqual( typeof typecast( prop, 1 ), 'bigint' );
        } );

        it( 'Should throw when casting fails', function(){
            assert.throws( () => typecast( prop, 'string' ) );
        } );

    } );

} );
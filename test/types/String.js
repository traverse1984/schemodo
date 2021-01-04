const assert = require('assert'),
      tString = require('../../src/types/String');

describe( 'String', function(){

    describe( 'typecast', function(){

        const { typecast } = tString;

        it( 'Should return a string', function(){

            const prop = { type: String, };

            assert.strictEqual( typeof typecast( prop, 'string' ), 'string' );
            assert.strictEqual( typeof typecast( prop, 1 ), 'string' );
            assert.strictEqual( typeof typecast( prop, BigInt(1) ), 'string' );
            assert.strictEqual( typeof typecast( prop, new Date() ), 'string' );

        } );

        it( 'Should throw when casting fails', function(){
            assert.throws( () => typecast( prop, {} ) );
        } );

        it( 'Should trim strings with trim option', function(){

            const prop = {
                type: String,
                trim: true,
            };

            assert.strictEqual( typecast( prop, ' test ' ), 'test' );

        } );

        it( 'Should make strings upper-case with upper option', function(){
        
            const prop = {
                type: String,
                upper: true,
            };

            assert.strictEqual( typecast( prop, 'test' ), 'TEST' );

        } );

        it( 'Should make strings lower-case with lower option', function(){

            const prop = {
                type: String,
                lower: true,
            };

            assert.strictEqual( typecast( prop, 'TEST' ), 'test' );

        } );

    } );

} );
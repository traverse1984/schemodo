const assert = require('assert'),
      tBoolean = require('../../src/types/Boolean');

describe( 'Boolean', function(){

    describe( 'typecast', function(){

        const prop = { type: Boolean, };
        const { typecast } = tBoolean;

        it( 'Should return a boolean', function(){
            assert.strictEqual( typeof typecast( prop, 1 ), 'boolean' );
        } );

        it( 'Should parse common falsey strings', function(){

            assert.strictEqual( typecast( prop, 'no' ), false );
            assert.strictEqual( typecast( prop, 'false' ), false );
            assert.strictEqual( typecast( prop, '0' ), false );

        } );

        it( 'Should not parse common falsey strings if parse=false', function(){

            const prop = {
                type: Boolean,
                parse: false,
            };

            assert( typecast( prop, 'no' ) );
            assert( typecast( prop, 'false' ) );
            assert( typecast( prop, '0' ) );

        } );

        it( 'Should parse common strings and numbers when strict=true', function(){

            const prop = {
                type: Boolean,
                strict: true,
            };

            assert( typecast( prop, 'yes' ) );
            assert( typecast( prop, 'true' ) );
            assert( typecast( prop, '1' ) );
            assert( typecast( prop, 1 ) );

            assert.strictEqual( typecast( prop, 'no' ), false );
            assert.strictEqual( typecast( prop, 'false' ), false );
            assert.strictEqual( typecast( prop, '0' ), false );
            assert.strictEqual( typecast( prop, 0 ), false );

        } );

        it( 'Should accept only true and false if strict=true and parse=false', function(){

            const prop = {
                type: Boolean,
                strict: true,
                parse: false,
            };

            assert( typecast( prop, true ) );
            assert.strictEqual( typecast( prop, false ), false );

            assert.throws( () => typecast( prop, 1 ) );
            assert.throws( () => typecast( prop, 0 ) );
            assert.throws( () => typecast( prop, '1' ) );
            assert.throws( () => typecast( prop, '0' ) );

        } );

    } );

} );
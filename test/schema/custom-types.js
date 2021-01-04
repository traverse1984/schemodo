const assert = require('assert'),
      sm = require('../../src/schemodo');

describe( 'Custom Types', function(){

    // Setup

    class ArrayObject extends Array {}

    const ArrayObject_type = {

        validators: {
            combinedSize( prop, value, skip ){
                const target = prop.combinedSize;
                if( Object.keys(value).length === target ){
                    return true;
                }
            },
        },

        messages: {
            combinedSize( prop ){
                return `Requires combined size of ${prop.combinedSize}`;
            },
        },

        init( value ){
            return new ArrayObject();
        },

        add( target, value ){
            target.push( value );
        },

        set( target, key, value ){
            target[key] = value;
        },

        get( target, key ){
            return target[key];
        },

        assert( value ){
            return Array.isArray(value);
        },
        
        normalize( defn ){

            if( defn instanceof ArrayObject ){

                const each = defn;

                defn = {
                    type: ArrayObject,
                    __callNormalize: true,
                };

                if( each.length ){
                    defn.each = each[0];
                }

            }

            return defn;

        },
        
        typecast( prop, value ){

            prop.__callTypecast = true;

            if( value && typeof value === 'object' ){

                const arr = new ArrayObject();
                Object.assign( arr, value );

                return arr;

            } else {

                throw new Error( 'typecast: Unable to cast to ArrayObject' );

            }

        },

        prepare( prop, name, path ){

            prop.__callPrepare = true;

            const pset = sm.types.get(Set).prepare,
                  pmap = sm.types.get(Map).prepare;

            prop = pset.call( this, prop, name, path );
            return pmap.call( this, prop, name, path );

        },

    };
    
    sm.types.set( ArrayObject, ArrayObject_type );

    // Tests

    it( 'Should be possible to create a schema using the custom type', function(){

        assert.doesNotThrow( () => {
            new sm.Schema({
                test: {
                    type: ArrayObject,
                },
            });
        } );

    } );

    it( 'Should call prepare when a full definition or constructor is passed', function(){

        // Definition-type
        {
            const model = new sm.Schema({
                test: {
                    type: ArrayObject,
                },
            });

            const prop = model.root.props[0];

            assert( ! prop.__callNormalize );
            assert( prop.__callPrepare );

            assert.strictEqual( prop.type, ArrayObject );
        }

        // Constructor-type
        {
            const model = new sm.Schema({
                test: ArrayObject,
            });

            const prop = model.root.props[0];

            assert( ! prop.__callNormalize );
            assert( prop.__callPrepare );

            assert.strictEqual( prop.type, ArrayObject );
        }

    } );

    it( 'Should call normalize and prepare when an instance is passed', function(){

        const model = new sm.Schema({
            test: new ArrayObject(String),
        });

        const prop = model.root.props[0];

        assert( prop.__callNormalize );
        assert( prop.__callPrepare );
        assert( 'each' in prop );

        assert.strictEqual( prop.type, ArrayObject );
        assert.strictEqual( prop.each.type, String );

    } );

    it( 'Should call typecast on provided values', function(){

        const model = new sm.Schema({
            test: ArrayObject,
        });

        const test = new ArrayObject( 1, 2, 3 );
        test.key = 4;

        const prop = model.root.props[0],
              result = model.validate({ test, });

        assert( result.ok() );
        assert( prop.__callTypecast );
        assert( result.value.test instanceof ArrayObject );

        assert.notStrictEqual( result.value.test, test );
        assert.deepStrictEqual( result.value.test, test );

    } );

    it( 'Should fail with a type error if value is the wrong type', function(){

        const modelA = new sm.Schema({
            test: ArrayObject,
        });

        const modelB = new sm.Schema({
            test: {
                type: ArrayObject,
                typecast: false,
            },
        });

        {
            const prop = modelA.root.props[0],
                  message = sm.types.get(ArrayObject).messages.type( prop ),
                  result = modelA.validate({ test: 'string', });

            assert.strictEqual( result.errors.length, 1 );
            assert.strictEqual( result.error.message, message );
        }

        {
            const prop = modelB.root.props[0],
                  message = sm.types.get(ArrayObject).messages.type( prop ),
                  result = modelA.validate({ test: 'string', });

            assert.strictEqual( result.errors.length, 1 );
            assert.strictEqual( result.error.message, message );
        }

    } );

    it( 'Should run custom validators', function(){

        const model = new sm.Schema({
            test: {
                type: ArrayObject,
                combinedSize: 4,
            },
        });

        {
            const test = [ 1, 2, 3, 4, ],
                  result = model.validate({ test, }),
                  expected = ArrayObject_type.typecast( {}, test );

            assert( result.ok() );
            assert( result.value.test instanceof ArrayObject );
            assert.deepStrictEqual( result.value.test, expected );
        }

        {
            const test = [ 1, 2, ];
            test.keyA = 3;
            test.keyB = 4;

            const expected = ArrayObject_type.typecast( {}, test ),
                  result = model.validate({ test, });

            assert( result.ok() );
            assert( result.value.test instanceof ArrayObject );
            assert.deepStrictEqual( result.value.test, expected );
        }

        {
            const test = [ 1, ];
            test.keyA = 2;

            const result = model.validate({ test, });

            assert( result.failed() );
        }

    } );

    it( 'Should traverse both entries and properties using provided methods', function(){

        const model = new sm.Schema({
            test: {
                type: ArrayObject,
                each: Number,
                props: {
                    keyA: {
                        type: Number,
                        required: true,
                    },
                    keyB: {
                        subA: String,
                        subB: Boolean,
                    },
                },
            },
        });

        {
            const test = [ 1, 2, 3, ];
            test.keyA = 4;

            const expected = ArrayObject_type.typecast( {}, test ),
                  result = model.validate({ test, });

            assert( result.ok() );
            assert.deepStrictEqual( result.value.test, expected );
        }

        {
            const test = [ 1, 2, 3, ];
            test.keyA = 4;
            test.keyB = { subA: 'string', subB: true, };

            const expected = ArrayObject_type.typecast( {}, test ),
                  result = model.validate({ test, });

            assert( result.ok() );
            assert.deepStrictEqual( result.value.test, expected );
        }

        {
            // keyA required but not present
            const test = [ 1, 2, 3, ],
                  result = model.validate({ test, });

            assert( result.failed() );
        }

        {
            // Array contains wrong types and keyA not present
            const test = [ 1, 2, 3, 'string', ],
                  result = model.validate({ test, });

            assert( result.failed() );
            assert.strictEqual( result.errors.length, 2 );

        }


    } );

} );
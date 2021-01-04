const assert = require('assert'),
      sm = require('../../src/schemodo');

describe( 'Function Stacks (before, use, after)', function(){

    it( 'Should be possible to specify a single function', function(){

        const fn = () => {};

        const model = new sm.Schema({
            type: String,
            before: fn,
            use: fn,
            after: fn,
        });

        assert.deepStrictEqual( model.root.before, [ fn ] );
        assert.deepStrictEqual( model.root.use, [ fn ] );
        assert.deepStrictEqual( model.root.after, [ fn ] );

    } );

    it( 'Should be possible to specify an array of functions', function(){

        const fns = [ () => {}, () => {}, ];

        const model = new sm.Schema({
            type: String,
            before: fns,
            use: fns,
            after: fns,
        });

        assert.deepStrictEqual( model.root.before, fns );
        assert.deepStrictEqual( model.root.use, fns );
        assert.deepStrictEqual( model.root.after, fns );

    } );

    it( 'Should throw if the value is not a function or array of functions', function(){

        function brokenStack( key, value ){
            return new sm.Schema({
                type: String,
                [key]: value,
            });
        }

        assert.throws( () => brokenStack( 'before', true ) );
        assert.throws( () => brokenStack( 'use', true ) );
        assert.throws( () => brokenStack( 'after', true ) );

        assert.throws( () => brokenStack( 'before', [ () => {}, true ] ) );
        assert.throws( () => brokenStack( 'use', [ () => {}, true ] ) );
        assert.throws( () => brokenStack( 'after', [ () => {}, true ] ) );

    } );

    it( 'Should update working values on before and after stacks', function(){

        const model = new sm.Schema({
            type: String,
            before( prop, value, skip ){
                return 'new-value-before';
            },
            after( prop, value, skip ){
                return 'new-value-after';
            },
        });

        const before = model.process( 'test', true, false ),
              after = model.process( 'test', false, true );

        assert.strictEqual( before.value, 'new-value-before' );
        assert.strictEqual( after.value, 'new-value-after' );

    } );

    it( 'Should not update working values if undefined is returned', function(){

        const model = new sm.Schema({
            type: String,
            before(){},
            after(){},
        });

        const before = model.process( 'test', true, false ),
              after = model.process( 'test', false, true );

        assert.strictEqual( before.value, 'test' );
        assert.strictEqual( after.value, 'test' );

    } );

    it( 'Should be possible to skip a value from any stack (even when required)', function(){

        const skipper = (prop, value, skip) => skip();

        const beforeModel = new sm.Schema({
            test: { required: true, type: String, before: skipper, },
        });

        const useModel = new sm.Schema({
            test: { required: true, type: String, use: skipper, },
        });

        const afterModel = new sm.Schema({
            test: { required: true, type: String, after: skipper, },
        });

        const input = { test: 'test-value', };

        const before = beforeModel.normalize( input ),
              use = useModel.normalize( input ),
              after = afterModel.normalize( input );

        assert( ! ('test' in before) );
        assert( ! ('test' in use) );
        assert( ! ('test' in after) );

    } );

    it( 'Should run stacks in the correct order', function(){

        const sequence = [];

        const expect = [
            'typecast',
            'before',
            'required',
            'type',
            'custom',
            'use',
            'after',
        ];

        const model = new sm.Schema({
            type: String,
            custom: true,
            required: true,
            typecast( value ){
                sequence.push( 'typecast' );
                return 'output';
            },
            validators: {
                required(){
                    sequence.push( 'required' );
                    return true;
                },
                type(){
                    sequence.push( 'type' );
                    return true;
                },
                custom(){
                    sequence.push( 'custom' );
                    return true;
                },
            },
            before( prop, value, skip ){
                sequence.push( 'before' );
                return value + '-before';
            },
            use(){
                sequence.push( 'use' );
            },
            after( prop, value, skip ){
                sequence.push( 'after' );
                return value + '-after';
            },
        });

        const output = model.normalize( 1 );

        assert.strictEqual( output, 'output-before-after' );
        assert.deepStrictEqual( sequence, expect );

    } );

} );
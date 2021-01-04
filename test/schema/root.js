const assert = require('assert'),
      sm = require('../../src/schemodo');

describe( 'Root Prop', function(){

    it( 'Should accept an object with specified $root', function(){
        
        assert.doesNotThrow( () => {
            new sm.Schema({ 
                $root: { prop: String, }, 
            });
        } );

        const model = new sm.Schema({ prop: String, });

        const rooted = new sm.Schema({
            $root: { prop: String, },
        });

        assert.deepStrictEqual( rooted, model );

    } );

    it( 'Should accept a native type only when $root specified', function(){

        assert.doesNotThrow( () => new sm.Schema({ $root: String, }) );

        const model = new sm.Schema({ type: String, }),
              rooted = new sm.Schema({ $root: String, });

        assert.deepStrictEqual( rooted, model );
        assert.throws( () => new sm.Schema(String) );

    } );

    describe( '$validators', function(){ 

        it( 'Should extract $validators to the schema', function(){

            const $validators = { test(){}, },
                model = new sm.Schema({ $validators, });

            assert.deepStrictEqual( model.validators, $validators );

        } );

        it( 'Should throw if any key in $validators is not a function', function(){
            assert.throws( () => new sm.Schema({ $validators: { test: true, }, }) );
        } );

    } );

    describe( '$messages', function(){

        it( 'Should extract $messages to the schema', function(){

            const $messages = { test(){}, },
                model = new sm.Schema({ $messages, });

            assert.deepStrictEqual( model.messages, $messages );

        } );

        it( 'Should convert non-functions in $messages to functions', function(){

            const $messages = { test: 'Test String', },
                model = new sm.Schema({ $messages, });

            assert( 'test' in model.messages );
            assert.strictEqual( typeof model.messages.test, 'function' );
            assert.strictEqual( model.messages.test(), $messages.test );

        } );

    } );

    describe( '$name', function(){

        it( 'Should extract $name to set the root prop $name', function(){

            const model = new sm.Schema({ $name: 'test', });

            assert.strictEqual( model.root.$name, 'test' );

        } );

        it( 'Should not set $name if it is false', function(){

            const model = new sm.Schema({ $name: false, });

            assert.strictEqual( '$name' in model.root, false );

        } );

        it( 'Should throw if $name is already present on the root prop', function(){

            assert.throws( () => {
                new sm.Schema({
                    $name: 'test-1',
                    $root: {
                        type: String,
                        $name: 'test-2',
                    },
                });
            } );

        } );

    } );

    describe( '$error', function(){

        class $error extends sm.ValidationError {}

        const model = new sm.Schema({ $error, });

        it( 'Should extract $error to set the validation error constructor', function(){
            assert.strictEqual( model.$error, $error );
        } );

        it( 'Should throw if $error is not a function', function(){
            assert.throws( () => new sm.Schema({ $error: true, }) );
        } );

        it( 'Should use the custom constructor', function(){
            assert( model.validate(null).errors[0] instanceof $error );
        } );

    } );

    describe( '$result', function(){

        class $result extends sm.ValidationResult {}

        const model = new sm.Schema({ $result, });

        it( 'Should extract $result to set the validation result constructor', function(){
            assert.strictEqual( model.$result, $result );
        } );

        it( 'Should throw if $result is not a function', function(){
            assert.throws( () => new sm.Schema({ $result: true, }) );
        } );

        it( 'Should use the custom constructor', function(){
            assert( model.validate({}) instanceof $result );
        } );

    } ); 

    it( 'Should extract $required to set the schema default', function(){

        const auto = new sm.Schema({}).$required,
              model = new sm.Schema({ $required: ! auto, });

        assert.strictEqual( model.$required, ! auto );

    } );

    it( 'Should extract $typecast to set the schema default', function(){

        const auto = new sm.Schema({}).$typecast,
              model = new sm.Schema({ $typecast: ! auto, });

        assert.strictEqual( model.$typecast, ! auto );

    } );

    it( 'Should extract $async to set the schema default', function(){

        const auto = new sm.Schema({}).$async,
              model = new sm.Schema({ $async: ! auto, });

        assert.strictEqual( model.$async, ! auto );

    } );

    it( 'Should use Schema.defaults to populate the schema', function(){

        class $result extends sm.ValidationResult {}
        class $error extends sm.ValidationError {}

        const current = sm.Schema.defaults,
              test = () => {},
              $validators = { test, },
              $messages = { test, },
              $name = 'test',
            { $required, $typecast, $async } = current;

        

        sm.Schema.defaults = {
            $error,
            $result,
            $validators,
            $messages,
            $name,
            $required: ! $required,
            $typecast: ! $typecast,
            $async: ! $async,
        };

        const model = new sm.Schema({});

        assert.strictEqual( model.$error, $error );
        assert.strictEqual( model.$result, $result );
        assert.strictEqual( model.validators.test, test );
        assert.strictEqual( model.messages.test, test );
        assert.strictEqual( model.root.$name, $name );
        assert.strictEqual( model.$required, ! $required );
        assert.strictEqual( model.$typecast, ! $typecast );
        assert.strictEqual( model.$async, ! $async );

        sm.Schema.defaults = current;

    } );

    it( 'Should ingnore the default $name if $name is false on the schema', function(){

        const current = sm.Schema.defaults;

        sm.Schema.defaults = {
            ...current,
            $name: 'test',
        };

        const model = new sm.Schema({ $name: false, });

        assert.strictEqual( '$name' in model.root, false );

        sm.Schema.defaults = current;

    } );

    it( 'Should add $validators on the schema to the defaults', function(){
        
        const current = sm.Schema.defaults,
              _default = () => {},
              _schema = () => {},
              _overwrite = () => {};

        sm.Schema.defaults = {
            ...current,
            $validators: { _default, _schema },
        };

        const model = new sm.Schema({
            $validators: { 
                _overwrite,
                _schema: _overwrite, 
            },
        });

        assert.strictEqual( model.validators._default, _default );
        assert.strictEqual( model.validators._schema, _overwrite );
        assert.strictEqual( model.validators._overwrite, _overwrite );

        sm.Schema.defaults = current;

    } );

    it( 'Should add and overwrite $messages on the schema to the defaults', function(){
 
        const current = sm.Schema.defaults,
              _default = () => {},
              _schema = () => {},
              _overwrite = () => {};

        sm.Schema.defaults = {
            ...current,
            $messages: { _default, _schema, },
        };

        const model = new sm.Schema({
            $messages: { 
                _overwrite,
                _schema: _overwrite, 
            },
        });

        assert.strictEqual( model.messages._default, _default );
        assert.strictEqual( model.messages._schema, _overwrite );
        assert.strictEqual( model.messages._overwrite, _overwrite );

        sm.Schema.defaults = current;

    } );

} );
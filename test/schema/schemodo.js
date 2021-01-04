const assert = require('assert'),
      sm = require('../../src/schemodo');

describe( 'Schemodo Library', function(){

    describe( 'Object Structure', function(){

        const properties = [
            'Schema', 
            'ValidationError', 
            'NormalizeError', 
            'ValidationResult',
            'types', 
            'validators', 
            'messages',
            'model',
        ];

        properties.forEach( property => {
            it( `Should have '${property}'`, function(){
                assert( property in sm );
            } );
        } );

    } );

    describe( 'Models (named schemas)', function(){

        const model = new sm.Schema({ test: String, });

        it( 'Should be possible to store and retrieve a model', function(){

            sm.model( 'test', model );

            assert.strictEqual( sm.model('test'), model );

        } );

        it( 'Should be possible to retrieve a model by calling the library', function(){
            assert.strictEqual( sm('test'), model );
        } );

        it( 'Should throw if the model name already existed', function(){
            assert.throws( () => sm.model( 'test', model ) );
        } );

        it( 'Should throw if a schema is not passed', function(){
            assert.throws( () => sm.model( 'test2', {} ) );
        } );

    } );


} );
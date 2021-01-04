const assert = require('assert'),
      sm = require('../../src/schemodo');

describe( 'All Props', function(){

    it( 'Should accept a plain object', function(){
        assert.doesNotThrow( () => new sm.Schema({ prop: String, }) );
    } );

    it( 'Should accept an array', function(){
        assert.doesNotThrow( () => new sm.Schema([ String ]) );
    } );

    it( 'Should accept a definition', function(){
        assert.doesNotThrow( () => new sm.Schema({ type: String, }) );
    } );

    it( 'Should accept a supported native type (except root prop)', function(){
        assert.doesNotThrow( () => new sm.Schema({ test: String, }) );
    });

    it( 'Should treat {} as Object', function(){

        const model = new sm.Schema({ type: Object, }),
            empty = new sm.Schema({});

        assert.deepStrictEqual( empty, model );

    } );

    it( 'Should treat [] as Array', function(){

        const model = new sm.Schema({ type: Array, }),
            empty = new sm.Schema([]);

        assert.deepStrictEqual( empty, model );

    } );

} );
const assert = require('assert'),
      sm = require('../../src/schemodo');

describe( 'Sub-Schemas', function(){

    it( 'Should make a copy of the schema', function(){

        const sub = new sm.Schema({ test: String, }),
              copy = new sm.Schema( sub, 'sub', 'sub.schema' );

        assert.strictEqual( copy.root.name, 'sub' );
        assert.strictEqual( copy.root.path, 'sub.schema' );
        assert.strictEqual( copy.root.props[0].name, 'test' );
        assert.strictEqual( copy.root.props[0].path, 'sub.schema.test' );

        copy.root.name = '';
        copy.root.path = '';
        copy.root.props[0].path = 'test';

        assert.deepStrictEqual( copy, sub );

    } );

    it( 'Should accept an in-line subschema', function(){

        const model = new sm.Schema({
            main: String,
            sub: new sm.Schema({
                test: String,
            }),
        });
        
        const props = model.root.props;

        assert.strictEqual( props[0].name, 'main' );
        assert.strictEqual( props[1].name, 'sub' );   
        assert.notStrictEqual( props[1]._schema, props[0]._schema );

    } );

    it( 'Should transfer required and $name options when fully defined', function(){

        const schema = new sm.Schema({ test: String, });

        const model = new sm.Schema({
            main: String,
            sub: {
                type: sm.Schema,
                required: ! schema.root.required,
                $name: 'subschema',
                schema,
            },
        });

        const prop = model.root.props[1];

        assert.strictEqual( prop.required, ! schema.root.required );
        assert.strictEqual( prop.$name, 'subschema' );

    } );

    it( 'Should not accept Schema as a native type', function(){

        assert.throws( () => {
            new sm.Schema({
                main: sm.Schema,
            });
        } );

        assert.throws( () => {
            new sm.Schema([ sm.Schema, ]);
        } );

    } );

} );
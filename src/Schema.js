const types = require('./types'),
      walkSync = require('./walkSync'),
      walkAsync = require('./walkAsync'),
    { prepare } = require('./build'),
    { basicObject,
      moveVal,
      moveFn,
      traverse, 
      ValidationError, 
      ValidationResult, 
      NormalizeError } = require('./util');


class Schema {

    constructor( schema, name, path ){

        this.validators = {};
        this.messages = {};

        if( schema instanceof Schema ){

            this.validators = { ...schema.validators, };
            this.messages = { ...schema.messages, };
            this.$required = schema.$required;
            this.$typecast = schema.$typecast;
            this.$async = schema.$async;
            this.$result = schema.$result;
            this.$error = schema.$error;

            this.root = traverse( schema.root, prop => {

                prop = { ...prop, };

                prop.path = prop.path ? `${path}.${prop.path}` : path;
                prop._schema = this;

                return prop;

            } );

            this.root.name = name;

        } else if( schema && typeof schema === 'object' ){

            if( ! basicObject( Schema.defaults ) ){
                throw new Error( 'defaults: Object expected' );
            }

            const base = {
                ...$defaults,
                ...Schema.defaults,
            };

            const { $validators, $messages } = base;

            if( ! basicObject( $validators ) ){
                throw new Error( 'defaults.$validators: Object expected' );
            }

            if( ! basicObject( $messages ) ){
                throw new Error( 'defaults.$messages: Object expected' );
            }

            if( ! Array.isArray( schema ) ){

                schema = { ...schema, };

                if( '$validators' in schema ){

                    if( ! basicObject( schema.$validators ) ){
                        throw new Error( 'schema.$validators: Object expected' );
                    }

                    schema.$validators = {
                        ...base.$validators,
                        ...schema.$validators,
                    };

                }

                if( '$messages' in schema ){

                    if( ! basicObject( schema.$messages ) ){
                        throw new Error( 'schema.$messages: Object expected' );
                    }

                    schema.$messages = {
                        ...base.$messages,
                        ...schema.$messages,
                    };

                }

                Object.keys($defaults).forEach( $opt => {
                    moveVal( schema, base, $opt );
                } );

                if( '$root' in schema ){
                    schema = schema.$root;
                }

            }

            if( '$required' in base ){
                base.$required = !! base.$required;
                moveVal( base, this, '$required' );
            }

            if( '$typecast' in base ){
                base.$typecast = !! base.$typecast;
                moveVal( base, this, '$typecast' );
            }

            if( '$async' in base ){
                base.$async = !! base.$async;
                moveVal( base, this, '$async' );
            }

            moveFn( base, this, '$result' );
            moveFn( base, this, '$error' );

            if( '$validators' in base ){

                const vd = base.$validators;

                for( let key in vd ){
                    
                    if( typeof vd[key] !== 'function' ){
                        throw new Error(
                            `$validators.${key}: Function expected`
                        );
                    }

                    this.validators[key] = vd[key];

                }

            }

            if( '$messages' in base ){

                const msg = base.$messages;

                for( let key in msg ){

                    const message = msg[key];

                    if( typeof message === 'function' ){
                        this.messages[key] = message;
                    }
                    else {
                        this.messages[key] = prop => message;
                    }

                }

            }


            this.root = prepare( this, schema, '', '' );
            this.root.required = true;

            if( '$name' in base && base.$name !== false ){
                
                if( '$name' in this.root ){
                    throw new Error(
                        '$name: Root prop already had $name key'
                    );
                }

                this.root.$name = base.$name;

            }


        } else {

            throw new Error( 'schema: Invalid format' );

        }

    }


    async processAsync( value, before=true, after=true, firstError=false ){

        before = !! before;
        after = !! after;
        firstError = !! firstError;

        return new this.$result(
            this,
            await walkAsync( this.root, value, before, after, firstError )
        );

    }

    processSync( value, before=true, after=true, firstError=false ){

        before = !! before;
        after = !! after;
        firstError = !! firstError;

        return new this.$result(
            this,
            walkSync( this.root, value, before, after, firstError )
        );

    }


    async normalizeAsync( value, firstError=true ){

        const result = await this.processAsync( value, true, true, firstError );

        if( result.failed() ){
            throw new NormalizeError( result );
        }

        return result.value;

    }

    normalizeSync( value, firstError=true ){

        const result = this.processSync( value, true, true, firstError );

        if( result.failed() ){
            throw new NormalizeError( result );
        }

        return result.value;

    }


    validateAsync( value, afterStack ){
        return this.processAsync( value, true, afterStack, false );
    }

    validateSync( value, afterStack ){
        return this.processSync( value, true, afterStack, false );
    }


    process( value, before=true, after=true, firstError=false ){

        if( this.$async ){
            return this.processAsync( value, before, after, firstError );
        }
        
        return this.processSync( value, before, after, firstError );

    }

    normalize( value, firstError=true ){

        if( this.$async ){
            return this.normalizeAsync( value, firstError );
        }

        return this.normalizeSync( value, firstError );

    }

    validate( value, firstError=false ){

        if( this.$async ){
            return this.validateAsync( value, firstError );
        }

        return this.validateSync( value, firstError );

    }


}


types.set( Schema, {

    normalize( defn ){

        return {
            type: Schema,
            schema: defn,
        };

    },

    prepare( prop, name, path ){

        const root = new Schema( prop.schema, name, path ).root;

        if( 'required' in prop ){
            root.required = !! prop.required;
        }

        if( '$name' in prop ){
            root.$name = prop.$name;
        }
        
        return root;

    },

} );


const $defaults = {
    $name: false,
    $async: false,
    $required: false,
    $typecast: true,
    $error: ValidationError,
    $result: ValidationResult,
    $validators: {},
    $messages: {},
};


Schema.defaults = { ...$defaults, };
Schema.defaults.$validators = {};
Schema.defaults.$messages = {};


module.exports = Schema;
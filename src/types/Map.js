const validators = require('../validators'),
      messages = require('../messages'),
    { props } = require('../build'),
    { iterable } = require('../util');

module.exports = {

    validators: {
        size: validators.size.set,
    },

    messages: {
        size: messages.size.set,
    },

    init( value ){
        return new Map();
    },

    get( target, key ){
        return target.get( key );
    },

    set( target, key, value ){
        target.set( key, value );
    },

    typecast( prop, value ){

        try {

            if( value instanceof Map ){
                return value;
            }

            if( iterable( value ) ){
                return new Map( [ ...value, ] );
            }
            
            if( typeof value === 'object' ){
                return new Map(
                    Object.keys(value).map( key => [ key, value[key], ] )
                );
            }

        } catch( err ){}

        throw new Error( 'typecast: Unable to cast to Map' );

    },

    prepare( prop, name, path ){

        if( 'props' in prop ){

            prop.props = props( prop._schema, prop.props, path );

        }

        return prop;

    },

};
const validators = require('../validators'),
      messages = require('../messages'),
    { prepare } = require('../build'),
    { iterable, csv } = require('../util');

const set = module.exports = {

    validators: {
        size: validators.size.set,
    },

    messages: {
        size: messages.size.set,
    },

    init( value ){
        return new Set();
    },

    add( target, item ){
        target.add( item );
    },

    typecast( prop, value ){

        if( value instanceof Set ){
            return value;
        }

        if( iterable( value ) ){
            return new Set( [ ...value, ] );
        }

        if( prop.csv === true && typeof value === 'string' ){
            return new Set( csv( value ) );
        }

        throw new Error( 'typecast: Unable to cast to Set' );

    },

    normalize( defn ){

        if( 'each' in defn && Array.isArray( defn.each ) ){

            const each = defn.each;

            if( each.length === 0 ){
                
                return {
                    ...defn,
                    each: {
                        type: Array,
                    },
                };

            } else if( each.length === 1 ){

                return {
                    ...defn,
                    each: each[0],
                };
                
            } else if( each.length > 1 ){

                const $or = each.map( _defn => {

                    if( Array.isArray( _defn ) ){

                        const _each = _defn;

                        _defn = { type: Array, };

                        if( _each.length ){
                            _defn.each = _each;
                        }

                        _defn = set.normalize( _defn );

                    }

                    return _defn;

                } );

                return {
                    ...defn,
                    each: { $or, },
                };

            }

        }

        return defn;
        
    },

    prepare( prop, name, path ){

        if( 'each' in prop ){

            const subPath = path ? `${path}.$` : '$';

            prop.each = prepare( prop._schema, prop.each, '$', subPath );
            prop.each.required = true;

        }

        return prop;

    },

};
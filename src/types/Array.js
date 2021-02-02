const set = require('./Set'),
      validators = require('../validators'),
      messages = require('../messages'),
    { iterable, split } = require('../util');

module.exports = {

    validators: {
        length: validators.length,
    },

    messages: {
        length: messages.length,
    },

    init( value ){
        return [];
    },

    add( target, item ){
        target.push( item );
    },

    typecast( prop, value ){

        if( Array.isArray( value ) ){
            return value;
        }

        if( iterable( value ) ){
            return [ ...value, ];
        }

        const separated = split( prop, value );

        if( separated ){
            return separated;
        }

        throw new Error( 'typecast: Unable to cast to Array' );

    },

    normalize( defn ){

        if( Array.isArray( defn ) ){

            const each = defn;

            defn = { type: Array, };

            if( each.length ){
                defn.each = each;
            }

        }

        return set.normalize.call( this, defn );

    },

    prepare( prop, name, path ){
    
        return set.prepare.call( this, prop, name, path );

    },

};
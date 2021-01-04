const { minMaxEqual } = require('./util');

module.exports = {

    type( prop, value, skip ){

        if( value === undefined || value === null ){
            return false;
        }

        const type = types.get( prop.type );

        if( type.assert ){
            return type.assert( value );
        }
        else {
            return value.constructor === prop.type;
        }

    },

    required( prop, value, skip ){

        if( prop.required ){
            return value !== undefined && value !== null;
        }

        if( value === undefined || value === null ){
            skip( prop.$default );
        }

        return true;

    },

    'enum': function _enum( prop, value, skip ){
        return prop.enum.includes( value );
    },


    match( prop, value, skip ){
        return prop.match.test( value );
    },

    length( prop, value, skip ){
        
        if( ! value || typeof value.length !== 'number' ){
            return false;
        }

        value = value.length;

        const { min,   isMin, 
                max,   isMax,
                equal, isEqual } = minMaxEqual( prop.length );

        if( isEqual && value !== equal ) return false;
        if( isMin && value < min ) return false;
        if( isMax && value < max ) return false;

        return true;

    },

    size: {

        number( prop, value, skip ){

            if( value === undefined || value === null ){
                return false;
            }
    
            const { min,   isMin, 
                    max,   isMax,
                    equal, isEqual } = minMaxEqual( prop.size );
    
            if( isEqual && value !== equal ) return false;
            if( isMin && value < min ) return false;
            if( isMax && value > max ) return false;
    
            return true;

        },

        set( prop, value, skip ){

            if( ! value || ! ('size' in value) ){
                return false;
            }

            const size = value.size;
    
            const { min,   isMin, 
                    max,   isMax,
                    equal, isEqual } = minMaxEqual( prop.size );
    
            if( isEqual && size !== equal ) return false;
            if( isMin && size < min ) return false;
            if( isMax && size > max ) return false;
    
            return true;

        },

    },

};

// Circular
const types = require('./types');
const { minMaxEqual } = require('./util');

module.exports = {

    $default( prop ){
        return 'Validation failed';
    },

    $or( prop ){
        return 'Does not match any allowed value types';
    },

    required( prop ){
        return 'Value required';
    },

    type( prop ){
        return `Must be of type ${prop.type.name}`;
    },

    'enum': function _enum( prop ){
        return 'Value not allowed';
    },

    match( prop ){
        return 'Does not pass matching filter';
    },

    length( prop ){

        const { min,   isMin, 
                max,   isMax,
                equal, isEqual } = minMaxEqual( prop.length );

        if( isEqual ) return `Must have a length of ${equal}`;
        if( isMin && isMax ) return `Must have a length between ${min} and ${max}`;
        if( isMin ) return `Must have a minimum length of ${min}`;
        if( isMax ) return `Must have a maximum length of ${max}`;
        
        return 'Validation failed (length)';

    },

    size: {

        number( prop ){

            const { min,   isMin, 
                    max,   isMax,
                    equal, isEqual } = minMaxEqual( prop.size );

            if( isEqual ) return `Must be ${equal}`;
            if( isMin && isMax ) return `Must be between ${min} and ${max}`;
            if( isMin ) return `Must not be less than ${min}`;
            if( isMax ) return `Must be no greater than ${max}`;

            return 'Validation failed (size)';

        },

        set( prop ){

            const { min,   isMin, 
                    max,   isMax,
                    equal, isEqual } = minMaxEqual( prop.size );

            if( isEqual ) return `Must have a size of ${equal}`;
            if( isMin && isMax ) return `Must have a size between ${min} and ${max}`;
            if( isMin ) return `Must have a minimum size of ${min}`;
            if( isMax ) return `Must have a maximum size of ${max}`;
            
            return 'Validation failed (size)';
            
        },

    },

};
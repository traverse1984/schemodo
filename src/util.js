exports.basicObject = function basicObject( value ){

    return value
        && typeof value === 'object'
        && ! Array.isArray( value );

};


exports.moveVal = function moveVal( from, to, key ){

    if( key in from ){
        to[key] = from[key];
        delete from[key];
    }

};

exports.moveFn = function moveFn( from, to, key ){

    if( key in from ){

        if( typeof from[key] !== 'function' ){
            throw new Error( `${key}: Function expected` );
        }

        to[key] = from[key];
        delete from[key];

    }

};


exports.iterable = function iterable( value ){

    return value instanceof Set
        || value instanceof Map
        || Array.isArray( value );

};


function split( prop, value ){

    if( typeof value !== 'string' ){
        return false;
    }

    const split = 'split' in prop;

    if( split || prop.csv === true || prop.list === true ){

        if( prop.trim !== false ){
            value = value.trim();
        }

        let separator;
        
        if( split ){
        
            separator = prop.split;

            if( 
                typeof separator !== 'string' && 
                ! (separator instanceof RegExp)
            ){
                    throw new Error( 'split: Expected String or RegExp' );
            }

        } else {

            separator = prop.csv === true ? ',' : /[\r\n]+/;

        }

        const entries = value.split( separator );

        if( prop.trimEntries !== false ){
            return entries.map( val => val.trim() );
        }

        return entries;

    }

    return false;

}

exports.split = split;


exports.minMaxEqual = function minMaxEqual( option ){

    if( 
        typeof option === 'number' ||
        typeof option.equal === 'number'
    ){
            return {
                equal: option,
                isEqual: true,
            };
    }

    const { min, max } = option;

    return {
        min,
        max,
        isMin: typeof min === 'number',
        isMax: typeof max === 'number',
    };

};



exports.validate = function validate( name, prop, value, skip ){

    const validator = lookup( prop, 'validators', name );
    
    if( ! validator( prop, value, skip ) ){

        throw new ValidationError( prop, message( prop, name ) );

    }

};



function message( prop, name ){

    let msg = lookup( prop, 'messages', name );

    if( ! msg ){
        msg = prop._type.messages.$default;
    }

    return msg( prop );

}

exports.message = message;



function traverse( prop, callback ){

    prop = callback( prop );

    if( prop.props ){
        prop.props = prop.props.map( sub => {
            return traverse( sub, callback );
        } );
    }

    if( prop.each ){
        prop.each = traverse( prop.each, callback );
    }

    return prop;

}

exports.traverse = traverse;



class StopProcessing {
    constructor( value ){
        this.value = value;
    }
}

exports.StopProcessing = StopProcessing;



const SkipProp = new StopProcessing();

exports.skip = function skip( value ){
    if( value === undefined || value === null ){
        throw SkipProp;
    }
    throw new StopProcessing( value );
};



exports.ValidationResult = class ValidationResult {

    constructor( schema, { value, errors } ){

        this.schema = schema;
        this.value = value;
        this.errors = errors;

    }

    get error(){
        
        if( this.errors.length ){
            return this.errors[0];
        }
        
        return null;

    }

    ok(){
        return ! this.errors.length;
    }

    failed(){
        return !! this.errors.length;
    }

    map(){
        
        const output = {};

        this.errors.forEach( error => {
            const key = error.prop.$name || error.prop.path;
            output[key] = error.message;
        } );

        return output;

    }

};



class ValidationError extends Error {
    constructor( prop, message ){
        super( message );
        this.prop = prop;
    }
}

exports.ValidationError = ValidationError;



exports.NormalizeError = class NormalizeError extends Error {
    constructor( result ){
        super( 'normalize: Validation failed' );
        this.result = result;
    }
};



function lookup( prop, group, name ){

    const { _type, _schema } = prop,
            $prop = prop[group];

    if( $prop && $prop[name] ){
        return $prop[name];
    }

    const $schema = _schema[group];

    if( $schema && $schema[name] ){
        return $schema[name];
    }
    else {
        return _type[group][name];
    }

}
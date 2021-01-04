const fns = {},
    { basicObject, validate } = require('./util');


function validator( name ){

    if( fns[name] ){
        return fns[name];
    }

    Object.assign( fns, {
        [name]( prop, value, skip ){
            return validate( name, prop, value, skip );
        },
    } );

    return fns[name];

}


function toStack( methods ){
        
    if( typeof methods === 'function' ){

        return [ methods ];

    } else if( Array.isArray( methods ) ){
    
        for( let method of methods ){
            if( typeof method !== 'function' ){
                throw new Error( 'schema: Function expected' );
            }
        }

        return [ ...methods ];

    } else if( methods === undefined ){

        return [];

    }
    
    throw new Error( 'schema: Array or Function expected' );

}


function normalize( defn ){

    if( types.has( defn ) ){

        return { type: defn, };

    } else if( defn && types.has( defn.constructor ) ){

        const type = types.get( defn.constructor );

        if( typeof type.normalize === 'function' ){

            return type.normalize.call( this, defn );

        }

    }

    throw new Error( 'schema: Format not understood' );

}


function combine( base, partial ){

    if( types.has( partial ) ){

        return normalize({ ...base, type: partial, });

    }
    
    return normalize({ ...base, ...partial, });

}


function prepare( schema, defn, name, path ){
    
    if( defn && typeof defn === 'object' && '$or' in defn ){

        const base = { ...defn, };

        delete base.$or;

        if( ! ('required' in base) ){
            base.required = schema.$required;
        }

        const prop = { 
            name, 
            path,
            type: null,
            _type: types.get(null),
            _schema: schema,
        };

        if( 'messages' in base && base.messages.$or ){
            prop.messages = { $or: base.messages.$or, };
        }

        if( '$name' in base ){
            prop.$name = base.$name;
        }

        prop.$or = defn.$or.map( def => {

            if( ! ('type' in base) && ! ('type' in def) && '$or' in def ){

                def = {
                    ...def,
                    type: null,
                    _type: types.get(null),
                };

            }

            const target = combine( base, def );

            return prepare( schema, target, name, path );

        } );

        return prop;

    }

    const prop = normalize( defn ),
          type = types.get( prop.type );

    if( ! type ){
        throw new Error( `${path}: Unknown type '${prop.type}'` );
    }


    prop.name = name;
    prop.path = path;
    prop._type = type;
    prop._schema = schema;

    if( ! ('required' in prop) ){
        prop.required = schema.$required;
    }

    if( ! prop.init && type.init ){
        prop.init = type.init;
    }

    if( prop.typecast !== false ){
        
        const specified = 'typecast' in prop;

        if( 
            typeof prop.typecast !== 'function' &&
            typeof type.typecast === 'function' &&
            ( specified || schema.$typecast )
        ){
                prop.typecast = type.typecast;
        }

        if( typeof prop.typecast !== 'function' ){

            if( specified ){

                throw new Error( `${path}: No default typecaster` );

            }

            prop.typecast = false;

        }

    }

    prop.before = toStack( prop.before );
    prop.after = toStack( prop.after );

    if( 'validators' in prop ){

        const { validators } = prop;

        if( ! basicObject( validators ) ){
            throw new Error( `${path}.validators: Object expected` );
        }

        for( let key in validators ){
            if( typeof validators[key] !== 'function' ){
                throw new Error( 
                    `${path}.validators.${key}: Function expected`
                );
            }
        }

    }

    if( 'messages' in prop ){

        const messagesProcessed = {},
            { messages } = prop;

        if( ! basicObject( messages ) ){
            throw new Error( `${path}.messages: Object expected` );
        }

        for( let key in messages ){
            
            const message = messages[key];

            if( typeof message === 'function' ){
                messagesProcessed[key] = message;
            }
            else {
                messagesProcessed[key] = prop => message;
            }

        }

        prop.messages = messagesProcessed;

    }

    const combinedValidators = {
        ...type.validators,
        ...schema.validators,
        ...prop.validators || {},
    };

    if( combinedValidators.required ) delete combinedValidators.required;
    if( combinedValidators.type ) delete combinedValidators.type;

    const use = [];

    for( let name in combinedValidators ){
        if( name in prop ){
            use.push( validator(name) );
        }
    }

    use.push( ...toStack( prop.use ) );

    prop.use = use;


    if( typeof type.prepare === 'function' ){

        return type.prepare( prop, name, path );

    } else {

        return prop;
        
    }

}


function props( schema, obj, path ){

    path = path ? `${path}.` : '';

    return Object.keys(obj).map( name => {

        return prepare( schema, obj[name], name, `${path}${name}` );

    } );

}


exports.prepare = prepare;
exports.props = props;


// Circular
const types = require('./types');
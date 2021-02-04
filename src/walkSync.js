const { validate, 
        message,
        passable,
        skip,
        returnInput,
        StopProcessing } = require('./util');


function _walk( prop, 
                value, 
                execBefore=true, 
                execAfter=true, 
                firstError=false,
                depth=-1 ){

    ++depth;

    const errors = [],
          _Error = prop._schema.$error;

    if( '$or' in prop ){
    
        let output, ok;
        
        for( const variant of prop.$or ){
        
            try {
        
                const sub = _walk(
                    variant,
                    value,
                    execBefore,
                    execAfter,
                    true,
                    depth
                );
        
                output = sub.value;
                ok = true;
                
                break;
        
            } catch( err ){}
        
        }
        
        if( ! ok ){

            const error = new _Error( prop, message( prop, '$or' ) );

            if( firstError ){
                throw err;
            }

            errors.push( error );
            
        }
        
        return { errors, value: output, };
        
    }
    
    
    try {
        
    
        const { before, use, after, typecast } = prop;
        
        if( typecast && passable( value ) ){
            try {
                value = typecast( 
                            prop, 
                            value, 
                            prop._type.typecast || returnInput
                        );
            }
            catch( err ){
                throw new _Error( 
                    prop, message( prop, 'type' )
                );
            }
        }
        
        if( execBefore ){

            for( const call of before ){
                
                const output = call( prop, value, skip );
                
                if( passable( output ) ){
                    value = output;
                }

            }

        }

        validate( 'required', prop, value, skip );
        validate( 'type', prop, value, skip );
        
        for( const call of use ){
            call( prop, value, skip );
        }
        
        if( passable( value ) ){
        
            const { props, each, _type } = prop;
        
            if( props || each ){
        
                let target = prop.init ? prop.init( value ) : value;
        
                if( props ){
        
                    const { get, set } = _type;
        
                    for( const subprop of props ){
        
                        const subvalue = get( value, subprop.name );
                        
                        const sub = _walk( 
                            subprop, 
                            subvalue,
                            execBefore,
                            execAfter,
                            firstError,
                            depth
                        );
        
                        const val = sub.value;
        
                        errors.push( ...sub.errors );
                        
                        if( passable( val ) ){
                            set( target, subprop.name, val );
                        }
        
                    }
        
                }
                
                if( each ){
        
                    const add = _type.add;
        
                    for( const entry of value ){
        
                        const sub = _walk( 
                            each, 
                            entry, 
                            execBefore,
                            execAfter,
                            firstError,
                            depth
                        );
        
                        const val = sub.value;

                        if( sub.errors.length ){
        
                            errors.push( ...sub.errors );

                            break;

                        }
        
                        if( passable( val ) ){
                            add( target, val );
                        }
        
                    }
        
                }
        
                value = target;
        
            }
        
        }
        
        if( execAfter ){

            for( const call of after ){

                const output = call( prop, value, skip );

                if( passable( output ) ){
                    value = output;
                }

            }

        }
        
        return { errors, value, };

    
    } catch( err ){
    
        if( err instanceof StopProcessing ){
            return { errors, value: err.value, };
        }
        
        if( firstError ){

            if( depth === 0 ){
                return { errors: [err], };
            }
            
            throw err;

        }
        
        if( ! (err instanceof _Error) ){
            errors.push( 
                new _Error( prop, err.message )
            );
        } 
        else {
            errors.push( err );
        }
        
        return { errors, };
        
    }

}


function walk( prop, 
               value, 
               execBefore=true, 
               execAfter=true, 
               firstError=false ){

    return _walk( prop, value, execBefore, execAfter, firstError );

}


module.exports = walk;
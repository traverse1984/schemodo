const types = require('./types'),
      validators = require('./validators'),
      messages = require('./messages'),
      Schema = require('./Schema'),
    { ValidationError, 
      NormalizeError, 
      ValidationResult } = require('./util');


function singleton(){

    const registry = new Map();

    function schemodo( name ){
        return schemodo.model( name );
    }

    schemodo.Schema = Schema;
    schemodo.ValidationError = ValidationError;
    schemodo.NormalizeError = NormalizeError;
    schemodo.ValidationResult = ValidationResult;
    
    schemodo.types = types;
    schemodo.validators = validators;
    schemodo.messages = messages;

    schemodo.model = function model( name, schema ){

        if( ! schema ){
            
            if( registry.has( name ) ){
                return registry.get( name );
            }

            throw new Error( `schemodo: Model '${name}' not found` );
            
        }

        if( registry.has(name) ){
            throw new Error( 
                `schemodo: Model '${name}' already exists`
            );
        }

        if( ! (schema instanceof Schema) ){
            throw new Error(
                `schemodo: Invalid schema for '${name}'`
            );
        }

        registry.set( name, schema );

        return schema;

    };

    return schemodo;

}

module.exports = singleton();
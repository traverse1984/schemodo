declare function schemodo ( name: string ): schemodo.Schema;

declare namespace schemodo {


    export var types: Map<object | null, TypeDefinition>;
    export var validators: Object<string, function>;
    export var messages: Object<string, function>;


    declare function model ( name: string, schema?: Schema );


    declare class Schema {

        constructor( schema: SchemaDefinition );

        processSync ( value: any,
            before: boolean = true,
            after: boolean = true,
            firstError: boolean = false ): ValidationResult;

        processAsync (
            value: any,
            before: boolean = true,
            after: boolean = true,
            firstError: boolean = false
        ): Promise<ValidationResult>;

        validateSync (
            value: any,
            afterStack: boolean = false
        ): ValidationResult;

        validateAsync (
            value: any,
            afterStack: boolean = false
        ): Promise<ValidationResult>;

        normalizeSync (
            value: any,
            firstError: boolean = true
        ): any | NormalizeError;

        normalizeAsync (
            value: any,
            firstError: boolean = true
        ): Promise<any | NormalizeError>;

        process (
            value: any,
            before: boolean = true,
            after: boolean = true,
            firstError: boolean = false
        ): ValidationResult | Promise<ValidationResult>;

        validate (
            value: any,
            afterStack: boolean = false
        ): ValidationResult | Promise<ValidationResult>;

        normalize (
            value: any,
            firstError: boolean = true
        ): any | NormalizeError | Promise<any | NormalizeError>;

    };


    interface SchemaDefinition {
        $root?: Prop | object;
        $name?: string;
        $typecast?: boolean;
        $required?: boolean;
        $async?: boolean;
        $validators?: Object<string, function>;
        $messages?: Object<string, function | any>;
        $result?: ValidationResultClass;
        $error?: ValidationErrorClass;
    }

    interface Prop {
        type: object | null;
        name: string;
        path: string;
        _type: TypeDefinition;
        _schema: Schema;
    }


    interface ValidationOutput {
        value: any;
        errors: ValidationError[];
    }

    interface ValidationResultClass {
        new( schema: Schema, result: ValidationOutput );
    }

    declare class ValidationResult {

        schema: Schema;
        errors: ValidationError[];
        value: any;

        constructor( schema: Schema, result: ValidationOutput );
        get error (): Error;
        ok (): boolean;
        failed (): boolean;
        map (): Object<string, string>;

    }

    interface ValidationErrorClass {
        new( prop: Prop, message: string );
    }

    declare class ValidationError extends Error {
        constructor( prop: Prop, message: string );
        prop: Prop;
    }

    declare class NormalizeError extends Error {
        result: ValidationResult;
        constructor( result: ValidationResult );
    }


    interface TypeDefinition {
        validators?: Object<string, function>;
        messages?: Object<string, function>;
        init?( value: any ): any;
        add?( target: any, item: any ): void;
        typecast?( prop: Prop, value: any ): any;
        normalize?( defn: any ): object;
        get?( target: any, key: any ): any;
        set?( target: any, key: any, value: any ): void;
        prepare?( prop: Prop, name: string, path: string );
        assert?( value: any ): boolean;
    }


}

export = schemodo;
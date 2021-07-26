import gql from 'graphql-tag';

export const OBTENER_FORMULAS_BASE = gql`
    query obtenerFormulasBase{
        obtenerFormulasBase{
            id
            nombre
            elementos{
                id
                nombre
            }
        }
    }
`;

export const OBTENER_FORMULA_BASE = gql`
    query obtenerFormulaBase($id:ID){
        obtenerFormulaBase(id:$id){
            id
            nombre
            elementos{
                id
                nombre
            }
        }
    }
`;

export const SAVE_FORMULA_BASE = gql`
    mutation insertarFormulaBase($input:formula_base_input){
        insertarFormulaBase(input:$input){
            estado
            message
        }
    }
`;

export const UPDATE_FORMULA_BASE = gql`
    mutation actualizarFormulaBase($id:ID, $input:formula_base_input){
        actualizarFormulaBase(id:$id, input:$input){
            estado
            message
        }
    }
`;

export const DELETE_FORMULA_BASE = gql`
    mutation desactivarFormulaBase($id:ID){
        desactivarFormulaBase(id:$id){
            estado
            message
        }
    }
`;
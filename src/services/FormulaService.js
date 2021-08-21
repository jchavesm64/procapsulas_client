import gql from 'graphql-tag';

export const OBTENER_FORMULAS = gql`
    query obtenerFormulas{
        obtenerFormulas{
            id
            nombre
            elementos{
                id
                nombre
                proveedor{
                    id
                    empresa
                    cedula
                }
                pais
                existencias
                estado
            }
            porcentajes
            formulaBase{
                id
                nombre
                elementos{
                    id
                    nombre
                }
            }
            cliente{
                id
                tipo
                nombre
                codigo
            }
            estado
        }
    }
`;

export const OBTENER_FORMULAS_MOVIMIENTOS = gql`
    query obtenerFormulasConMovimiento{
        obtenerFormulasConMovimiento{
            id 
            nombre
            elementos{
                materia_prima{
                    id
                    nombre
                }
                movimientos{
                    id
                    tipo
                    lote
                    codigo
                    cantidad
                    existencia
                }
            }
            formulaBase{
                id
                nombre
                elementos{
                    id
                    nombre
                }
            }
            cliente{
                id
                tipo
                nombre
                codigo
            }
            porcentajes
        }
    }
`;

export const OBTENER_FORMULA = gql`
    query obtenerFormula($id:ID){
        obtenerFormula(id:$id){
            id
            nombre
            elementos{
                id
                nombre
                proveedor{
                    id
                    empresa
                    cedula
                }
                pais
                existencias
                estado
            }
            formulaBase{
                id
                nombre
                elementos{
                    id
                    nombre
                }
            }
            cliente{
                id
                tipo
                nombre
                codigo
            }
            porcentajes
            estado
        }
    }   
`;

export const SAVE_FORMULA = gql`
    mutation insertarFormula($input:formulaInput){
        insertarFormula(input:$input){
            estado
            message
        }
    }
`;

export const UPDATE_FORMULA = gql`
    mutation actualizarFormula($id:ID, $input:formulaInput){
        actualizarFormula(id:$id, input:$input){
            estado
            message
        }
    }
`;

export const DELETE_FORMULA = gql`
    mutation desactivarFormula($id:ID){
        desactivarFormula(id:$id){
            estado
            message
        }
    }
`;
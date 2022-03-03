import gql from 'graphql-tag';

export const OBTENER_DISPENSADOS = gql`
    query obtenerDispensados{
        obtenerDispensados{
            id
            producto{
                id
                nombre
            }
            estado
        }
    }
`;

export const OBTENER_DISPENSADO_MOVIMIENTOS = gql`
    query obtenerDispensadoConMovimientos{
        obtenerDispensadoConMovimientos{
            dispensado{
                id
                producto{
                    id
                    nombre
                }
                estado
            }
            movimientos{
                id
                tipo
                lote
                fecha
                cantidad
                usuario{
                    id
                    nombre
                    cedula
                }
            }
        }
    }
`;

export const OBTENER_DISPENSADO = gql`
    query obtenerDispensado($id:ID){
        obtenerDispensado(id:$id){
            id
            producto{
                id
                nombre
            }
            estado
        }
    }
`;

export const SAVE_DISPENSADO = gql`
    mutation insertarDispensado($input:DispensadoInput){
        insertarDispensado(input:$input){
            estado
            message
        }
    }
`;

export const UPDATE_DISPENSADO = gql`
    mutation actualizarDispensado($id:ID, $input:DispensadoInput){
        actualizarDispensado(id:$id, input:$input){
            estado
            message
        }
    }
`;

export const DELETE_DISPENSADO = gql`
    mutation desactivarDispensado($id:ID){
        desactivarDispensado(id:$id){
            estado
            message
        }
    }
`;
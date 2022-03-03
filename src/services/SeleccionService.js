import gql from 'graphql-tag';

export const OBTENER_SELECIONES = gql`
    query obtenerSelecciones{
        obtenerSelecciones{
            id
            producto{
                id
                nombre
            }
            estado
        }
    }
`;

export const OBTENER_SELECCION_MOVIMIENTOS = gql`
    query obtenerSeleccionConMovimientos{
        obtenerSeleccionConMovimientos{
            seleccion{
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

export const OBTENER_SELECION = gql`
    query obtenerSeleccion($id:ID){
        obtenerSeleccion(id:$id){
            id
            producto{
                id
                nombre
            }
            estado
        }
    }
`;

export const SAVE_SELECION = gql`
    mutation insertarSeleccion($input:SeleccionInput){
        insertarSeleccion(input:$input){
            estado
            message
        }
    }
`;

export const UPDATE_SELECION = gql`
    mutation actualizarSeleccion($id:ID, $input:SeleccionInput){
        actualizarSeleccion(id:$id, input:$input){
            estado
            message
        }
    }
`;

export const DELETE_SELECION = gql`
    mutation desactivarSeleccion($id:ID){
        desactivarSeleccion(id:$id){
            estado
            message
        }
    }
`;
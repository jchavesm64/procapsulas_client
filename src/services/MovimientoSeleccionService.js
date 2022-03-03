import gql from 'graphql-tag'

export const OBTENER_MOVIMIENTOS_SELECCION = gql`
    query obtenerMovimientosSeleccion($id:ID){
        obtenerMovimientosSeleccion(id:$id){
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
`;

export const SAVE_MOVIMIENTO_SELECCION = gql`
    mutation insertarMovimientoSeleccion($input:MovimientosSeleccionInput){
        insertarMovimientoSeleccion(input:$input){
            estado
            message
        }
    }
`;

export const OBTENER_MOVIMIENTOS_SELECCION_2 = gql`
    query obtenerMovimientosSeleccion($id:ID){
        obtenerMovimientosSeleccion(id:$id){
            id
            tipo
            lote
        }
    }
`;
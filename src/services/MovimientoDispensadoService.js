import gql from 'graphql-tag'

export const OBTENER_MOVIMIENTOS_DISPENSADO = gql`
    query obtenerMovimientosDispensado($id:ID){
        obtenerMovimientosDispensado(id:$id){
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

export const SAVE_MOVIMIENTO_DISPENSADO = gql`
    mutation insertarMovimientoDispensado($input:MovimientosDispensadoInput){
        insertarMovimientoDispensado(input:$input){
            estado
            message
        }
    }
`;

export const OBTENER_MOVIMIENTOS_DISPENSADO_2 = gql`
    query obtenerMovimientosDispensado($id:ID){
        obtenerMovimientosDispensado(id:$id){
            id
            tipo
            lote
        }
    }
`;
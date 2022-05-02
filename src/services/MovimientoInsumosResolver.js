import gql from 'graphql-tag'

export const OBTENER_MOVIMIENTOS_INSUMO = gql`
    query obtenerMovimientosInsumo($id:ID){
        obtenerMovimientosInsumo(id:$id){
            id
            tipo
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

export const SAVE_MOVIMIENTO_INSUMO = gql`
    mutation insertarMovimientoInsumo($input:MovimientosInsumoInput){
        insertarMovimientoInsumo(input:$input){
            estado
            message
        }
    }
`;
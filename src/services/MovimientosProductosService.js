import gql from 'graphql-tag'

export const OBTENER_MOVIMIENTOS_PRODUCTOS = gql`
    query obtenerMovimientosProductos($id:ID){
        obtenerMovimientosProductos(id:$id){
            id
            tipo
            fecha_vencimiento
            fecha
            cantidad
            usuario{
                id
                nombre
                cedula
            }
            producto{
                id
                nombre
            }
            fecha
        }
    }
`;

export const SAVE_MOVIMIENTO_PRODUCTO = gql`
    mutation insertarMovimientoProducto($input:MovimientosProductosInput){
        insertarMovimientoProducto(input:$input){
            estado
            message
        }
    }
`;

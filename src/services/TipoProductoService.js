import gql from 'graphql-tag';

export const OBTENER_TIPO_PRODUCTOS = gql`
    query obtenerTipoProductos{
        obtenerTipoProductos{
            id
            tipo
            estado
        }
    }
`;

export const SAVE_TIPO_PRODUCTOS = gql`
    mutation insertarTipoProductos($input:TipoProductoInput){
        insertarTipoProductos(input:$input){
            estado
            message
        }
    }
`;

export const UPDATE_TIPO_PRODUCTOS = gql`
    mutation actualizarTipoProductos($id:ID, $input:TipoProductoInput){
        actualizarTipoProductos(id:$id, input:$input){
            estado
            message
        }
    }
`;

export const DELETE_TIPO_PRODUCTOS = gql`
    mutation desactivarTipoProducto($id:ID){
        desactivarTipoProducto(id:$id){
            estado
            message
        }
    }
`;
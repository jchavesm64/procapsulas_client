import gql from 'graphql-tag';

export const OBTENER_PRODUCTOS = gql`
    query obtenerProductos{
        obtenerProductos{
            id
            nombre
            unidad
            existencias
            orden_produccion{
                formula{
                    id
                    nombre
                }
                cliente{
                    id
                    nombre
                }
            }
            estado
        }
    }
`;

export const OBTENER_PRODUCTOS_MOVIMIENTOS = gql`
    query obtenerProductosConMovimientos{
        obtenerProductosConMovimientos{
            producto{
                id
                nombre
                unidad
                existencias
                orden_produccion{
                    formula{
                        id
                        nombre
                    }
                    cliente{
                        id
                        nombre
                    }
                    presentacion{
                        tipo
                    }
                }
                estado
            }
            movimientos{
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
            }
        }
    }
`;

export const OBTENER_PRODUCTO = gql`
    query obtenerProducto($id:ID){
        obtenerProducto(id:$id){
            id
            nombre
            unidad
            existencias
            orden_produccion{
                id
                formula{
                    id
                    nombre
                }
                cliente{
                    id
                    nombre
                }
                presentacion{
                  tipo
                }
            }
            estado
        }
    }
`;

export const SAVE_PRODUCTO = gql`
    mutation insertarProducto($input:ProductoInput){
        insertarProducto(input:$input){
            estado
            message
        }
    }
`;

export const UPDATE_PRODUCTO = gql`
    mutation actualizarProducto($id:ID, $input:ProductoInput){
        actualizarProducto(id:$id, input:$input){
            estado
            message
        }
    }
`;

export const DELETE_PRODUCTO = gql`
    mutation desactivarProducto($id:ID){
        desactivarProducto(id:$id){
            estado
            message
        }
    }
`;

export const OBTENER_PRODUCTOS_2 = gql`
    query obtenerProductos{
        obtenerProductos{
            id
            nombre
        }
    }
`;
import gql from 'graphql-tag';

export const SAVE_COTIZACION = gql`
    mutation insertarCotizacion($input:cotizacion){
        insertarCotizacion(input:$input){
            estado
            message
        }
    }
`;

export const UPDATE_COTIZACION = gql`
    mutation actualizarCotizacion($id:ID, $input:cotizacion){
        actualizarCotizacion(id: $id, input:$input){
            estado
            message
        }
    }
`;

export const OBTENER_COTIZACIONES = gql`
    query obtenerCotizaciones{
        obtenerCotizaciones{
            id
            formula{
                nombre
            }
            tipoProducto{
                tipo
            }
            cliente{
                nombre
            }
            pesoCapsula
            cantidad
            costoCapsula
            envases
            costoEnvase
            etiqueta
          	costoEtiqueta
            venta
            elementos{
                id
                nombre
            }
            capsula{
                id
                nombre
            }
            precios_capsula
            cantidad_capsula
            agua_purificada
            porcentajes
            precio_kilo
        }
    }
`;

export const OBTENER_COTIZACION = gql`
    query obtenerCotizacion($id:ID){
        obtenerCotizacion(id:$id){
            id
            formula{
                id
                nombre
                tipo
            }
            tipoProducto{
                id
                tipo
            }
            cliente{
                id
                nombre
            }
            pesoCapsula
            cantidad
            costoCapsula
            envases
            costoEnvase
            etiqueta
          	costoEtiqueta
            venta
            elementos{
                id
                nombre
            }
            capsula{
                id
                nombre
            }
            precios_capsula
            cantidad_capsula
            agua_purificada
            porcentajes
            precio_kilo
        }
    }
`;

export const DELETE_COTIZACION = gql`
    mutation desactivarCotizacion($id:ID){
        desactivarCotizacion(id:$id){
            estado
            message
        }
    }
`;
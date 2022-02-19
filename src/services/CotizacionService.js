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
                id
                nombre
            }
            presentacion{
                id
                tipo
            }
            cliente{
                id
                nombre
            }
            peso
            elementos{
                id
                nombre
            }
            porcentajes
            precios
            cant_cap
            cost_cap
            cant_env
            cost_env
            cant_eti
            cost_eti
            venta
            dosis
            serving
            agua
            elementos_c{
                id
                nombre
            }
            cantidad_c
            precios_c
            estado
            status
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
            }
            presentacion{
                id
                tipo
            }
            cliente{
                id
                nombre
            }
            peso
            elementos{
                id
                nombre
            }
            porcentajes
            precios
            cant_cap
            cost_cap
            cant_env
            cost_env
            cant_eti
            cost_eti
            venta
            dosis
            serving
            agua
            elementos_c{
                id
                nombre
            }
            cantidad_c
            precios_c
            estado
            status
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

export const OBTENER_ORDENES = gql`
    query obtenerCotizaciones2{
        obtenerCotizaciones2{
            id
            formula{
                id
                nombre
            }
            presentacion{
                id
                tipo
            }
            cliente{
                id
                nombre
            }
        }
    }
`;
import gql from 'graphql-tag';

export const OBTENER_UBICACIONES = gql`
    query obtenerUbicaciones{
        obtenerUbicaciones{
            id
            nombre
            estado
        }
    }
`;

export const SAVE_UBICACION = gql`
    mutation insertarUbicacion($input:UbicacionInput){
        insertarUbicacion(input:$input){
            estado
            message
        }
    }
`;

export const UPDATE_UBICACION = gql`
    mutation actualizarUbicacion($id:ID, $input:UbicacionInput){
        actualizarUbicacion(id:$id, input:$input){
            estado
            message
        }
    }
`;

export const DELETE_UBICACION = gql`
    mutation desactivarUbicacion($id:ID){
        desactivarUbicacion(id:$id){
            estado
            message
        }
    }
`;
import gql from 'graphql-tag';

export const OBTENER_ACTIVOS = gql`
    query obtenerActivos{
        obtenerActivos{
            id
            numero
            descripcion
            modelo
            serie
            fecha_desecho
            fecha_etiquetado
            fecha_ingreso
            estado
            state
        }
    }
`;

export const OBTENER_ACTIVO = gql`
    query obtenerActivo($id:ID){
        obtenerActivo(id:$id){
            id
            numero
            descripcion
            modelo
            serie
            fecha_desecho
            fecha_etiquetado
            fecha_ingreso
            estado
            state
        }
    }
`;

export const SAVE_ACTIVO = gql`
    mutation insertarActivo($input:ActivoInput){
        insertarActivo(input:$input){
            estado
            message
        }
    }
`;

export const UPDATE_ACTIVO = gql`
    mutation actualizarActivo($id:ID, $input:ActivoInput){
        actualizarActivo(id:$id, input:$input){
            estado
            message
        }
    }
`;

export const DELETE_ACTIVO = gql`
    mutation desactivarActivo($id:ID){
        desactivarActivo(id:$id){
            estado
            message
        }
    }
`;
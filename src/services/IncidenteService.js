import gql from 'graphql-tag';

export const OBTENER_INCIDENTES = gql`
    query obtenerIncidentes($id:ID){
        obtenerIncidentes(id:$id){
            id
            maquina {
                id
                nombre
            }
            descripcion
            fecha
            ubicacion{
                id
                nombre
            }
            causa
            estado
        }
    }
`;

export const OBTENER_INCIDENTE = gql`
    query obtenerIncidente($id:ID){
        obtenerIncidente(id:$id){
            id
            maquina {
                id
                nombre
            }
            descripcion
            fecha
            ubicacion{
                id
                nombre
            }
            causa
            estado
        }
    }
`;

export const SAVE_INCIDENTE = gql`
    mutation insertarIncidente($input:IncidenteInput){
        insertarIncidente(input:$input){
            estado
            message
        }
    }
`;

export const UPDATE_INCIDENTE = gql`
    mutation actualizarIncidente($id:ID, $input:IncidenteInput){
        actualizarIncidente(id:$id, input:$input){
            estado
            message
        }
    }
`;

export const DELETE_INCIDENTE = gql`
    mutation desactivarIncidente($id:ID){
        desactivarIncidente(id:$id){
            estado
            message
        }
    }
`;
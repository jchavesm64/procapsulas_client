import gql from 'graphql-tag';

export const OBTENER_PUESTO_LIMPIEZAS = gql`
    query obtenerPuestoLimpiezas{
        obtenerPuestoLimpiezas{
            id
            nombre
            codigo
            ubicacion{
                nombre
            }
            areas{
                nombre
            }
            estado
        }
    }
`;

export const OBTENER_PUESTO_LIMPIEZA = gql`
    query obtenerPuestoLimpieza($id:ID){
        obtenerPuestoLimpieza(id:$id){
            id
            nombre
            codigo
            ubicacion{
                id
                nombre
            }
            areas{
                nombre
            }
            estado
        }
    }
`;

export const SAVE_PUESTO_LIMPIEZA = gql`
    mutation insertarPuestoLimpieza($input:PuestoLimpiezaInput){
        insertarPuestoLimpieza(input:$input){
            estado
            message
        }
    }
`;

export const UPDATE_PUESTO_LIMPIEZA = gql`
    mutation actualizarPuestoLimpieza($id:ID, $input:PuestoLimpiezaInput){
        actualizarPuestoLimpieza(id:$id, input:$input){
            estado
            message
        }
    }
`;

export const DELETE_PUESTO_LIMPIEZA = gql`
    mutation desactivarPuestoLimpieza($id:ID){
        desactivarPuestoLimpieza(id:$id){
            estado
            message
        }
    }
`;
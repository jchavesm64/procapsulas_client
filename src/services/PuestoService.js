import gql from 'graphql-tag';

export const OBTENER_PUESTOS = gql`
    query obtenerPuestos{
        obtenerPuestos{
            id
            nombre
            salario
        }
    }
`;

export const SAVE_PUESTO = gql`
    mutation insertarPuesto($input:PuestoInput){
        insertarPuesto(input:$input){
            estado
            message
        }
    }
`;

export const UPDATE_PUESTO = gql`
    mutation actualizarPuesto($id:ID, $input:PuestoInput){
        actualizarPuesto(id:$id, input:$input){
            estado
            message
        }
    }
`;


export const DELETE_PUESTO = gql`
    mutation desactivarPuesto($id:ID){
        desactivarPuesto(id:$id){
            estado
            message
        }
    }
`;
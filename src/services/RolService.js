import gql from 'graphql-tag';

export const OBTENER_ROLES = gql`
    query obtenerRoles{
        obtenerRoles{
            id
            tipo
            permisos{
                id
                descripcion,
                estado
            }
            acciones{
                eliminar
                editar
                agregar
            }
            estado
        }
    }
`;

export const UPDATE_ROLES = gql`
    mutation actualizarRol($id:ID, $input:RolInput){
        actualizarRol(id:$id, input:$input){
            estado
            message
        }
    }
`;

export const OBTENER_PERMISOS = gql`
    query obtenerPermisos{
        obtenerPermisos{
            id
            descripcion
            estado
        }
    }
`;
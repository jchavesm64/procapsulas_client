import gql from 'graphql-tag';

export const OBTENER_CLIENTES = gql`
    query obtenerClientes{
        obtenerClientes{
            id
            tipo
            nombre
            codigo
            pais
            ciudad
            direccion
            telefonos{
                telefono
            }
            correos{
                email
            }
            estado
        }
    }
`;

export const OBTENER_CLIENTE = gql`
    query obtenerCliente($id:ID){
        obtenerCliente(id:$id){
            id
            tipo
            nombre
            codigo
            pais
            ciudad
            direccion
            telefonos{
                telefono
            }
            correos{
                email
            }
            estado
        }
    }
`;

export const SAVE_CLIENTE = gql`
    mutation insertarCliente($input:ClienteInput){
        insertarCliente(input:$input){
            estado
            message
        }
    }
`;

export const UPDATE_CLIENTE = gql`
    mutation actualizarCliente($id:ID, $input:ClienteInput){
        actualizarCliente(id:$id, input:$input){
            estado
            message
        }
    }
`;

export const DELETE_CLIENTE = gql`
    mutation desactivarCliente($id:ID){
        desactivarCliente(id:$id){
            estado
            message
        }
    }
`;
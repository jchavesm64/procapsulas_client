import gql from 'graphql-tag';

export const OBTENER_PROVEEDORES = gql`
    query obtenerProveedores{
        obtenerProveedores{
            id
            empresa
            cedula
            pais
            ciudad
            city
            calle
            cp
            direccion
            telefonos{
                telefono
            }
            correos{
                email
            }
            redes{
                red
                enlace
            }
            provedurias{
                id
                tipo
                estado
            }
        }
    }
`;

export const OBTENER_PROVEEDOR = gql`
    query obtenerProveedor($id:ID){
        obtenerProveedor(id:$id){
            id
            empresa
            cedula
            pais
            ciudad
            city
            calle
            cp
            direccion
            telefonos{
                telefono
            }
            correos{
                email
            }
            redes{
                red
                enlace
            }
            provedurias{
                id
                tipo
                estado
            }
        }
    }
`;

export const SAVE_PROVEEDOR = gql`
    mutation insertarProveedor($input:ProveedorInput){
        insertarProveedor(input:$input){
            estado
            message
        }
    }
`;

export const UPDATE_PROVEEDOR = gql`
    mutation actualizarProveedor($id:ID, $input:ProveedorInput){
        actualizarProveedor(id:$id, input:$input){
            estado
            message
        }
    }
`;

export const DELETE_PROVEEDOR = gql`
    mutation desactivarProveedor($id:ID){
        desactivarProveedor(id:$id){
            estado
            message
        }
    }
`;
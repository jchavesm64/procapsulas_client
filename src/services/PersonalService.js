import gql from 'graphql-tag';

export const OBTENER_PERSONAL = gql`
    query obtenerPersonal{
        obtenerPersonal{
            id
            nombre
            cedula
            pais
            state
            ciudad
            calle
            codpostal
            direccion
            telefonos{
                telefono
            }
            correos{
                email
            }
            puesto{
                id
                nombre
                salario
            }
            fecha_contrato
            estado
        }
    }
`;

export const OBTENER_EMPLEADOS = gql`
    query obtenerEmpleados($lista:[String]){
        obtenerEmpleados(lista:$lista){
            id
            nombre
            cedula
            puesto{
                id
                nombre
                salario
            }
            estado
        }
    }
`;

export const OBTENER_PERSONAL_ONE = gql`
    query obtenerPersonalOne($id:ID){
        obtenerPersonalOne(id:$id){
            id
            nombre
            cedula
            pais
            state
            ciudad
            calle
            codpostal
            direccion
            telefonos{
                telefono
            }
            correos{
                email
            }
            puesto{
                id
                nombre
                salario
            }
            fecha_contrato
            estado
        }
    }
`;

export const SAVE_PERSONAL = gql`
    mutation insertarPersonal($input:PersonalInput){
        insertarPersonal(input:$input){
            estado
            message
        }
    }
`;

export const UPDATE_PERSONAL = gql`
    mutation actualizarPersonal($id:ID, $input:PersonalInput){
        actualizarPersonal(id:$id, input:$input){
            estado
            message
        }
    }
`;

export const DELETE_PERSONAL = gql`
    mutation desactivarPersonal($id:ID){
        desactivarPersonal(id:$id){
            estado
            message
        }
    }
`;
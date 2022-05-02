import gql from 'graphql-tag';

export const OBTENER_INSUMOS = gql`
    query obtenerInsumos{
        obtenerInsumos{
            id
            codigo
            descripcion
            cantidad_limite
            area{
                id
                nombre
            }
            estado
        }
    }
`;

export const OBTENER_INSUMO_MOVIMIENTOS = gql`
    query obtenerInsumosConMovimientos{
        obtenerInsumosConMovimientos{
            insumo{
                id
                codigo
                descripcion
                cantidad_limite
                area {
                    id
                    nombre
                }
                estado
            }
            movimientos{
                id
                tipo
                fecha
                cantidad
                usuario{
                    id
                    nombre
                    cedula
                }
            }
        }
    }
`;

export const OBTENER_INSUMO = gql`
    query obtenerInsumo($id:ID){
        obtenerInsumo(id:$id){
            id
            codigo
            descripcion
            cantidad_limite
            area{
                id
                nombre
            }
            estado
        }
    }
`;

export const SAVE_INSUMO = gql`
    mutation insertarInsumo($input:InsumoInput){
        insertarInsumo(input:$input){
            estado
            message
        }
    }
`;

export const UPDATE_INSUMO = gql`
    mutation actualizarInsumo($id:ID, $input:InsumoInput){
        actualizarInsumo(id:$id, input:$input){
            estado
            message
        }
    }
`;

export const DELETE_INSUMO = gql`
    mutation desactivarInsumo($id:ID){
        desactivarInsumo(id:$id){
            estado
            message
        }
    }
`;
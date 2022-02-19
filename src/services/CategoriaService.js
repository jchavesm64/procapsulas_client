import gql from 'graphql-tag';

export const OBTENER_CATEGORIAS = gql`
    query obtenerCategorias{
        obtenerCategorias{
            id
            nombre
            estado
        }
    }
`;

export const SAVE_CATEGORIA = gql`
    mutation insertarCategoria($input:CategoriaInput){
        insertarCategoria(input:$input){
            estado
            message
        }
    }
`;

export const UPDATE_CATEGORIA = gql`
    mutation actualizarCategoria($id:ID, $input:CategoriaInput){
        actualizarCategoria(id:$id, input:$input){
            estado
            message
        }
    }
`;

export const DELETE_CATEGORIA = gql`
    mutation desactivarCategoria($id:ID){
        desactivarCategoria(id:$id){
            estado
            message
        }
    }
`;
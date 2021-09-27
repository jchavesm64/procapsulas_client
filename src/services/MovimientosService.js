import gql from 'graphql-tag'

export const OBTENER_MOVIMIENTOS = gql`
    query obtenerMovimientos($id:ID){
        obtenerMovimientos(id:$id){
            id
            tipo
            lote
            proveedor{
                id
                empresa
                cedula
            }
            codigo
            fechaFabricacion
            fechaVencimiento
            fecha
            cantidad
            existencia
            precio
            precio_unidad
            moneda
            cao
            usuario{
                id
                nombre
                cedula
            }
            materia_prima{
                id
                nombre
            }
        }
    }
`;

export const SAVE_MOVIMIENTO = gql`
    mutation insertarMovimiento($input:MovimientosInput){
        insertarMovimiento(input:$input){
            estado
            message
        }
    }
`;

export const VERIFICAR = gql`
    mutation verificarExistencias($input:Items){
        verificarExistencias(input:$input){
            estado
            message
        }
    }
`;

export const PRODUCCION = gql`
    mutation enviarProduccion($input:salidas){
        enviarProduccion(input:$input){
            estado
            message
        }
    }
`;

export const UPLOAD_FILE_COA = gql`
    mutation subirArchivoCOA($file:Upload){
        subirArchivoCOA(file:$file){
            estado
            filename
            message
        }
    }
`;
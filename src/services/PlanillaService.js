import gql from 'graphql-tag';

export const OBTENER_PLANILLA = gql`
    query obtenerPlanilla($f1:Date, $f2:Date){
        obtenerPlanilla(f1:$f1, f2:$f2){
            id
    		fecha_lunes
            fecha_domingo
            listado_horas{
                empleado{
                    id
                    cedula
                    nombre
                    puesto{
                        id
                        salario
                        nombre
                    }
                }
                horas
                tipo
            }
        }
    }
`;

export const SAVE_PLANILLA = gql`
    mutation savePlanilla($input:PlanillaInput){
        savePlanilla(input:$input){
            estado
            message
        }
    }
`;
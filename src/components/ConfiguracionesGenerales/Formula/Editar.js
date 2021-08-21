import React, { useEffect } from 'react'
import { useQuery } from '@apollo/react-hooks'
import { OBTENER_FORMULA } from '../../../services/FormulaService'
import Formulario from './Formulario';
import Detalles from './Detalles';
import { withRouter } from 'react-router'
import { Loader, Notification } from 'rsuite';

const Editar = ({ ...props }) => {
    const { id } = props.match.params, uso = props.uso;
    const { loading, error, data, refetch, startPolling, stopPolling } = useQuery(OBTENER_FORMULA, { variables: { id: id }, pollInterval: 1000 });

    useEffect(() => {
        startPolling(1000)
        return () => {
            stopPolling()
        }
    }, [startPolling, stopPolling])

    if (loading) {
        return (<Loader backdrop content="Cargando..." vertical size="lg" />);
    }
    if (error) {
        Notification['error']({
            title: "Error",
            duration: 20000,
            description: "Error al obtener la informacion de la comision"
        })
    }

    function crearFormula(formula) {
        var newFormula = {}, elementos = []
        var aux = formula.elementos, aux2 = formula.porcentajes;
        for (var i = 0; i < aux.length; i++) {
            elementos.push({
                materia_prima: aux[i],
                porcentaje: aux2[i]
            })
        }
        if (formula.formulaBase === null || formula.formulaBase === undefined) {
            newFormula = {
                id: formula.id,
                tipo: formula.tipo,
                nombre: formula.nombre,
                cliente: formula.cliente,
                elementos: elementos
            }
        } else {
            newFormula = {
                id: formula.id,
                tipo: formula.tipo,
                nombre: formula.nombre,
                cliente: formula.cliente,
                elementos: elementos,
                base: formula.formulaBase
            }
        }

        return newFormula
    }

    return (
        <>
            {(uso === true) ?
                (
                    <Formulario props={props} formula={crearFormula(data.obtenerFormula)} refetch={refetch} />
                ) : (
                    <Detalles props={props} formula={crearFormula(data.obtenerFormula)} refetch={refetch} />
                )
            }

        </>
    )
}

export default withRouter(Editar)
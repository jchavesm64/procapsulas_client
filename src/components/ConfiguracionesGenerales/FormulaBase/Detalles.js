import React, { useEffect, useState } from 'react'
import { withRouter } from 'react-router-dom'
import Boton from '../../shared/Boton';
import {
    Table,
} from 'rsuite';
import { Input } from 'rsuite';
const { Column, HeaderCell, Cell, Pagination } = Table;

const DetallesFormulaBase = ({ props, formula }) => {
    const [datos, setDatos] = useState(formula.elementos)

    useEffect(() => {
        setDatos(formula.elementos)
    }, [formula])

    return (
        <div>
            <div>
                <Boton name="Atras" onClick={e => props.history.push(`/config/formulasbase`)} icon="arrow-left-line" tooltip="Ir a Fórmulas Base" size="xs" color="blue" />
            </div>
            <h3 className="text-center">Detalles de la Fórmula</h3>
            <hr />
            <div class="row my-1">
                <h5>Nombre de la fórmula</h5>
                <Input className="my-1" type="text" placeholder="Nombre de la fórmula" value={formula.nombre} />
            </div>
            <h5 className="my-2">Elementos de la fórmula</h5>
            <Table className="shadow-lg" height={200} autoHeight data={datos}>
                <Column flexGrow={1}>
                    <HeaderCell>Materia Prima</HeaderCell>
                    <Cell>
                        {
                            rowData => {
                                return (<label>{rowData.materia_prima.nombre}</label>)
                            }
                        }
                    </Cell>
                </Column>
            </Table>
        </div>
    )
}

export default withRouter(DetallesFormulaBase);
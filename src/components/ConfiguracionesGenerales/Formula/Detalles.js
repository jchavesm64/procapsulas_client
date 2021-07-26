import React from 'react'
import { Table, Input } from 'rsuite'
import Boton from '../../shared/Boton'
import { withRouter } from 'react-router-dom'
const { Column, HeaderCell, Cell } = Table;

const DetalllesFormula = ({ props, formula }) => {

    console.log(formula)

    return (
        <>
            <div>
                <Boton name="Atras" onClick={e => props.history.push(`/config/formulas`)} icon="arrow-left-line" tooltip="Ir a fórmulas" size="xs" color="blue" />
            </div>
            <h3 className="text-center">Detalles de la Fórmula</h3>
            <div class="row my-1">
                <h5>Nombre de la fórmula</h5>
                <Input className="my-1" type="text" placeholder="Nombre de la fórmula" value={formula.nombre} />
                <h5>Tipo de Cápsula</h5>
                <Input className="my-1" type="text" placeholder="Tipo de Cápsula" value={formula.tipo} />
            </div>
            <div className="my-2">
                <Table className="shadow-lg" minHeight={300} autoHeight data={formula.elementos}>
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
                    <Column flexGrow={1}>
                        <HeaderCell>Porcentaje</HeaderCell>
                        <Cell dataKey="porcentaje" />
                    </Column>
                </Table>
            </div>
            {formula.base &&
                <>
                    <h6>Fórmula Base: {formula.base.nombre}</h6>
                    <div className="my-2">
                        <Table className="shadow-lg" autoHeight data={formula.base.elementos}>
                            <Column flexGrow={1}>
                                <HeaderCell>Materia Prima</HeaderCell>
                                <Cell>
                                    {
                                        rowData => {
                                            return (<label>{rowData.nombre}</label>)
                                        }
                                    }
                                </Cell>
                            </Column>
                        </Table>
                    </div>
                </>
            }
        </>
    )

}

export default withRouter(DetalllesFormula);
/* eslint-disable array-callback-return */
import React, { useState } from 'react'
import { Panel } from 'rsuite';
import { withRouter } from 'react-router-dom';
import Label from '../../shared/Label'
import Boton from '../../shared/Boton';

const CardChequeo = ({ ...props }) => {
    const [state, setState] = useState(false);
    const { chequeo, setConfirmation } = props

    const obtenerAreasChecadas = (estado) => {
        let count = 0
        chequeo.areas.map(item => {
            if (item.estado === estado) {
                count++
            }
        })
        return count
    }

    return (
        <Panel shaded bordered bodyFill style={{ width: 300, maxWidth: 300 }}
            className={` ${state ? 'shadow-lg' : ' '} mx-4 my-4`}
            onMouseEnter={() => setState(true)}
            onMouseLeave={() => setState(false)}
        >
            <h4 className="mt-4 text-center">{"Datos del Chequeo"}</h4>
            <div className="mx-1">
                <h6>Fecha</h6>
                <Label icon="font" value={chequeo.fecha.split('T')[0]} />
                <h6>Total de Áreas a Chequear</h6>
                <Label icon="hashtah" value={chequeo.areas.length} />
                <h6>Total de Áreas a Checadas</h6>
                <Label icon="hashtah" value={obtenerAreasChecadas(true)} />
                <h6>Total de Áreas sin Chequear</h6>
                <Label icon="hashtah" value={obtenerAreasChecadas(false)} />
            </div>
            {
                !chequeo.aprobado &&
                <div className="d-flex justify-content-center mx-1 my-1">
                    <div className="mx-1"><Boton name="Aprobar" tooltip="Aprobar Chequeo" color="green" icon="fas fa-check" size="md" onClick={() => setConfirmation({ bool: true, id: chequeo.id })} /></div>
                </div>
            }
        </Panel>
    )
}

export default withRouter(CardChequeo)
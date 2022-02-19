import React, { useState } from 'react'
import { Panel } from 'rsuite';
import { Link, withRouter } from 'react-router-dom';
import Action from '../../shared/Action';
import Label from '../../shared/Label'

const Card = ({ ...props }) => {
    const [state, setState] = useState(false);
    const { mantenimiento } = props

    function getFecha(fecha) {
        var date = new Date(fecha);
        var day = (date.getDate() < 9) ? '0' + (date.getDate() + 1) : date.getDate() + 1;
        var mes = (date.getMonth() < 9) ? '0' + (date.getMonth() + 1) : date.getMonth() + 1
        return date.getFullYear() + ' / ' + mes + ' / ' + day 
    }

    function getFechaAviso(fecha) {
        var date = new Date(fecha);
        date.setMonth(date.getMonth() - 3)
        return getFecha(date)
    }

    return (
        <Panel shaded bordered bodyFill style={{ width: 300, maxWidth: 300 }}
            className={` ${state ? 'shadow-lg' : ' '} mx-4 my-4`}
            onMouseEnter={() => setState(true)}
            onMouseLeave={() => setState(false)}
        >
            <h4 className="mt-4 text-center">{"Datos del Mantenimiento"}</h4>
            <div className="mx-1">
                <h6>Fecha del Mantenimiento</h6>
                <Label icon="fas fa-clock" value={getFecha(mantenimiento.fecha_mantenimiento)} />
                <h6>Fecha del Aviso</h6>
                <Label icon="globe" value={getFechaAviso(mantenimiento.fecha_mantenimiento)} />
                <h6>Descripción</h6>
                <Label icon="font" value={mantenimiento.descripcion} />
                <h6>Estado</h6>
                <Label icon="font" value={mantenimiento.estado} />
            </div>
            <div className="d-flex justify-content-end mx-1 my-1">
                <div className="mx-1"><Link to={`editar/${mantenimiento.id}`}><Action tooltip="Editar Mantenimiento" color="orange" icon="edit" size="xs" /></Link></div>
                <div className="mx-1"><Link to={`detalles/${mantenimiento.id}`}><Action tooltip="Detalles Mantenimiento" color="blue" icon="info" size="xs" /></Link></div>
            </div>
        </Panel>
    )
}

export default withRouter(Card)
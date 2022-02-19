import React, { useState } from 'react'
import { Panel } from 'rsuite';
import { Link, withRouter } from 'react-router-dom';
import Action from '../../shared/Action';
import Label from '../../shared/Label'

const CardIncidente = ({ ...props }) => {
    const [state, setState] = useState(false);
    const { incidente } = props

    const getHora = (date) => {
        var hora = date.getHours(), minutos = date.getMinutes(), am_pm = "a.m."
        if (hora > 12) {
            hora = hora - 12
            am_pm = "p.m."
        } else if (hora === 12) {
            am_pm = "p.m."
        }
        if (minutos < 10) {
            minutos = '0' + minutos
        }
        return hora + ":" + minutos + ' ' + am_pm
    }

    function getFecha(fecha) {
        var date = new Date(fecha);
        var day = (date.getDate() < 9) ? '0' + (date.getDate() + 1) : date.getDate() + 1;
        var mes = (date.getMonth() < 9) ? '0' + (date.getMonth() + 1) : date.getMonth() + 1
        return date.getFullYear() + ' / ' + mes + ' / ' + day + ' ' + getHora(date);
    }

    return (
        <Panel shaded bordered bodyFill style={{ width: 300, maxWidth: 300 }}
            className={` ${state ? 'shadow-lg' : ' '} mx-4 my-4`}
            onMouseEnter={() => setState(true)}
            onMouseLeave={() => setState(false)}
        >
            <h4 className="mt-4 text-center">{"Datos del Incidente"}</h4>
            <div className="mx-1">
                <h6>Fecha</h6>
                <Label icon="fas fa-clock" value={getFecha(incidente.fecha)} />
                <h6>Ubicación en Planta</h6>
                <Label icon="globe" value={incidente.ubicacion.nombre} />
                <h6>Descripción</h6>
                <Label icon="font" value={incidente.descripcion} />
                {
                    incidente.causa &&
                    <>
                        <h6>Causa</h6>
                        <Label icon="font" value={incidente.causa} />
                    </>
                }
                <h6>Estado</h6>
                <Label icon="font" value={incidente.estado} />
            </div>
            <div className="d-flex justify-content-end mx-1 my-1">
                <div className="mx-1"><Link to={`editar/${incidente.id}`}><Action tooltip="Editar Incidente" color="orange" icon="edit" size="xs" /></Link></div>
            </div>
        </Panel>
    )
}

export default withRouter(CardIncidente)
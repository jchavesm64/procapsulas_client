import React, { useState } from 'react'
import { Panel } from 'rsuite';
import { Link, withRouter } from 'react-router-dom';
import Action from '../shared/Action';
import Label from '../shared/Label'

const CardPuestoLimpieza = ({ ...props }) => {
    const [state, setState] = useState(false);
    const { puestoLimpieza, setConfirmation, mostrarMsj } = props

    const vincularDispositivo = (id) => {
        localStorage.setItem('id_vincular_puesto', id)
        window.location.reload()
    }

    const { session } = props

    const uso = session.roles[0].tipo === 'PUESTO_LIMPIEZA'

    return (
        <Panel shaded bordered bodyFill style={{ width: 300, maxWidth: 300 }}
            className={` ${state ? 'shadow-lg' : ' '} mx-4 my-4`}
            onMouseEnter={() => setState(true)}
            onMouseLeave={() => setState(false)}
        >
            <h4 className="mt-4 text-center">{"Datos de la Puesto de Limpieza"}</h4>
            <div className="mx-1">
                <h6>Puesto Limpieza</h6>
                <Label icon="font" value={puestoLimpieza.nombre} />
                <h6>Código</h6>
                <Label icon="hashtag" value={puestoLimpieza.codigo} />
                <h6>Ubicación en Planta</h6>
                <Label icon="globe" value={puestoLimpieza.ubicacion.nombre} />
            </div>
            <div className="d-flex justify-content-end mx-1 my-1">
                {
                    uso ? (
                        <div className="mx-1"><Action tooltip="Vincular con este Dispositivo" color="violet" icon="fas fa-link" size="xs" onClick={() => vincularDispositivo(puestoLimpieza.id)} /></div>
                    ) : (
                        <>
                            <div className="mx-1"><Link to={`puestos_limpieza/editar/${puestoLimpieza.id}`}><Action tooltip="Editar Puesto de Limpieza" color="orange" icon="edit" size="xs" /></Link></div>
                            <div className="mx-1"><Action onClick={() => { props.session.roles.some(rol => rol.tipo === localStorage.getItem('rol') && (rol.acciones[0].eliminar === true)) ? setConfirmation({ bool: true, id: puestoLimpieza.id }) : mostrarMsj() }} tooltip="Eliminar Puesto de Limpieza" color="red" icon="trash" size="xs" /></div>
                            <div className="mx-1"><Link to={`puestos_limpieza/detalles/${puestoLimpieza.id}`}><Action tooltip="Detalles" color="cyan" icon="info" size="xs" /></Link></div>
                            <div className="mx-1"><Link to={`puestos_limpieza/chequeos/${puestoLimpieza.id}`}><Action tooltip="Ver chequeos" color="blue" icon="fas fa-check" size="xs" /></Link></div>
                        </>
                    )
                }

            </div>
        </Panel>
    )
}

export default withRouter(CardPuestoLimpieza)
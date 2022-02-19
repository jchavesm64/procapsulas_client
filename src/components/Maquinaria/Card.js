import React, { useState } from 'react'
import { Panel } from 'rsuite';
import { Link, withRouter } from 'react-router-dom';
import Action from '../shared/Action';
import Label from '../shared/Label'
import moment from 'moment'
import QRCode from 'react-qr-code'

const CardMaquina = ({ ...props }) => {
    const [state, setState] = useState(false);
    const [show, setShow] = useState(false)
    const { maquina, setConfirmation, mostrarMsj } = props

    const getRestoVidaUtil = (fecha, vida) => {
        var fecha_limite = new Date(fecha);
        fecha_limite.setFullYear(fecha_limite.getFullYear() + vida)
        var fecha_hoy = new Date()
        const f1 = moment(fecha_hoy, 'YYYY-MM-DD HH:mm:ss')
        const f2 = moment(fecha_limite, 'YYYY-MM-DD HH:mm:ss')
        const f3 = fecha_limite
        f3.setDate(1)
        const f4 = moment(f3, 'YYYY-MM-DD HH:mm:ss')
        const years = f2.diff(f1, 'years')
        const months = f2.diff(f1, 'months') - (years * 12)
        const days = f2.diff(f4, 'days')
        return "Años: " + years + ", Meses: " + months + ", dias: " + days
    }

    return (
        <Panel shaded bordered bodyFill style={{ width: 300, maxWidth: 300 }}
            className={` ${state ? 'shadow-lg' : ' '} mx-4 my-4`}
            onMouseEnter={() => setState(true)}
            onMouseLeave={() => setState(false)}
        >
            <>
                {
                    show === false ? (
                        <>
                            <h4 className="mt-4 text-center">{"Datos de la Máquina"}</h4>
                            <div className="mx-1">
                                <h6>Maquina</h6>
                                <Label icon="font" value={maquina.nombre} />
                                <h6>Categoría</h6>
                                <Label icon="list" value={maquina.categoria.nombre} />
                                <h6>Ubicación en Planta</h6>
                                <Label icon="globe" value={maquina.ubicacion.nombre} />
                                <h6>Vida útil</h6>
                                <Label icon="fas fa-clock" value={maquina.vida_util + ' años'} />
                                <h6>Vida útil restante</h6>
                                <Label icon="fas fa-clock" value={getRestoVidaUtil(maquina.fecha_adquirido, maquina.vida_util)} />
                            </div>
                            <div className="d-flex justify-content-end mx-1 my-1">
                                <div className="mx-1"><Link to={`maquinaria/editar/${maquina.id}`}><Action tooltip="Editar Maquina" color="orange" icon="edit" size="xs" /></Link></div>
                                <div className="mx-1"><Action onClick={() => { props.session.roles.some(rol => rol.tipo === localStorage.getItem('rol') && (rol.acciones[0].eliminar === true)) ? setConfirmation({ bool: true, id: maquina.id }) : mostrarMsj() }} tooltip="Eliminar Máquina" color="red" icon="trash" size="xs" /></div>
                                <div className="mx-1"><Link to={`maquinaria/detalles/${maquina.id}`}><Action tooltip="Detalles" color="cyan" icon="info" size="xs" /></Link></div>
                                <div><h6>|</h6></div>
                                <div className="mx-1"><Link to={`mantenimientos/${maquina.id}`}><Action tooltip="Mantenimientos" color="green" icon="fas fa-cog" size="xs" /></Link></div>
                                <div className="mx-1"><Link to={`incidentes/${maquina.id}`}><Action tooltip="Incidentes" color="yellow" icon="fas fa-exclamation" size="xs" /></Link></div>
                                <div><h6>|</h6></div>
                                <Action tooltip="Ver Codigo QR" icon="eye" size="xs" color="blue" onClick={() => setShow(true)} />
                            </div>
                        </>
                    ) : (
                        <div className='row mx-1'>
                            <div className='p-2'>
                                <QRCode value={`https://procapsulasclient.herokuapp.com/info/maquina/${maquina.id}`} />
                            </div>
                            <Action className="m-1" tooltip="Ocultar Codigo QR" icon="eye-slash" size="xs" color="blue" onClick={() => setShow(false)} />
                        </div>
                    )
                }
            </>
        </Panel>
    )
}

export default withRouter(CardMaquina)
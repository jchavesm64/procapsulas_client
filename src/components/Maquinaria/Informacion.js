import React from 'react'
import { withRouter } from 'react-router'
import { useQuery } from "@apollo/react-hooks";
import { OBTENER_INFORMACION_MAQUINA } from '../../services/MaquinaService'
import { Loader, Notification } from 'rsuite';
import moment from 'moment'
import Label from '../shared/Label';


const InformacionMaquinaria = ({ ...props }) => {
    const { id } = props.match.params;
    const { loading: load_maquina, error: error_maquina, data: data_maquina } = useQuery(OBTENER_INFORMACION_MAQUINA, { variables: { id: id }, pollInterval: 1000 });

    function getFecha(fecha) {
        var date = new Date(fecha);
        var day = (date.getDate() < 9) ? '0' + (date.getDate() + 1) : date.getDate() + 1;
        var mes = (date.getMonth() < 9) ? '0' + (date.getMonth() + 1) : date.getMonth() + 1
        return day + ' - ' + mes + ' - ' + date.getFullYear()
    }

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

    if (load_maquina) {
        return (<Loader backdrop content="Cargando..." vertical size="lg" />);
    }
    if (error_maquina) {
        Notification['error']({
            title: "Error",
            duration: 20000,
            description: "Error al obtener la informacion de la máquina"
        })
    }

    const maquina = data_maquina.obtenerInformacionMaquina
    console.log(maquina)

    return (
        <>
            {
                maquina &&
                <div className='my-3'>
                    <div style={{ backgroundColor: '#0ca3aeb2', color: 'white' }}>
                        <hr className='my-2' />
                        <h4 className="mx-2">Informacion General</h4>
                        <hr className='my-2' />
                    </div>
                    <div className='row'>
                        <div className='col-md-6'>
                            <h6 className="my-2">Nombre de la Máquina</h6>
                            <Label icon="fas fa-font" value={maquina.maquina.nombre} />
                        </div>
                        <div className='col-md-6'>
                            <h6 className="my-2">Categoría de la Máquina</h6>
                            <Label icon="fas fa-list" value={maquina.maquina.categoria.nombre} />
                        </div>
                    </div>
                    <div className='row'>
                        <div className='col-md-6'>
                            <h6 className="my-2">Ubicación en Planta de la Máquina</h6>
                            <Label icon="fas fa-globe" value={maquina.maquina.ubicacion.nombre} />
                        </div>
                        <div className='col-md-6'>
                            <h6 className="my-2">Fecha de Aquisición</h6>
                            <Label icon="fas fa-calendar" value={getFecha(maquina.maquina.fecha_adquirido)} />
                        </div>
                    </div>
                    <div className='row'>
                        <div className='col-md-6'>
                            <h6 className="my-2">Vida Útil</h6>
                            <Label icon="fas fa-clock" value={maquina.maquina.vida_util + ' años'} />
                        </div>
                        <div className='col-md-6'>
                            <h6 className="my-2">Vida Útil Restante</h6>
                            <Label icon="fas fa-calendar" value={getRestoVidaUtil(maquina.maquina.fecha_adquirido, maquina.maquina.vida_util)} />
                        </div>
                    </div>
                    <div style={{ backgroundColor: '#0ca3aeb2', color: 'white' }}>
                        <hr className='my-2' />
                        <h4 className="mx-2">Caracteristicas de la Máquina</h4>
                        <hr className='my-2' />
                    </div>
                    <div className='border-dark border-bottom'>
                        {
                            maquina.maquina.caracteristicas.map(c => {
                                return (
                                    <div className='row my-2 m-0'>
                                        <div className='col-md-2 border border-rigth-0'>
                                            <h6 className="my-2">{c.clave}</h6>
                                        </div>
                                        <div className='col-md-10 border'>
                                            <h6 className="my-2">{c.valor}</h6>
                                        </div>
                                    </div>
                                )
                            })
                        }
                    </div>
                    <div style={{ backgroundColor: '#0ca3aeb2', color: 'white' }}>
                        <hr className='my-2' />
                        <h4 className="mx-2">Partes de la Máquina</h4>
                        <hr className='my-2' />
                    </div>
                    {
                        maquina.maquina.partes.map(p => {
                            return (
                                <div className='border-dark border-bottom my-2'>
                                    <Label icon="fas fa-font" value={p.parte} />
                                    {
                                        p.caracteristicas.map(c => {
                                            return (
                                                <div className='row my-2 m-0'>
                                                    <div className='col-md-1'></div>
                                                    <div className='col-md-2 border border-rigth-0'>
                                                        <h6 className="my-2">{c.clave}</h6>
                                                    </div>
                                                    <div className='col-md-9 border'>
                                                        <h6 className="my-2">{c.valor}</h6>
                                                    </div>
                                                </div>
                                            )
                                        })
                                    }
                                </div>
                            )
                        })
                    }
                    <div style={{ backgroundColor: '#0ca3aeb2', color: 'white' }}>
                        <hr className='my-2' />
                        <h4 className="mx-2">Mantenimientos de la Máquina</h4>
                        <hr className='my-2' />
                    </div>
                    {
                        maquina.mantenimientos.map(m => {
                            return (
                                <div className='border-dark border-bottom my-2'>
                                    <div className='row my-2'>
                                        <div className='col-md-6'>
                                            <h6 className="my-2">Fecha del Mantenimiento</h6>
                                            <Label icon="fas fa-calendar" value={getFecha(m.fecha_mantenimiento)} />
                                        </div>
                                        <div className='col-md-6'>
                                            <h6 className="my-2">Estado del Mantenimiento</h6>
                                            <Label icon="fas fa-clock" value={m.estado} />
                                        </div>
                                        <h6 className="my-2">Descripción del Mantenimiento</h6>
                                        <div className='border rounded-2 mx-2 py-3 text-dark' style={{ fontSize: '18px' }}>
                                            {m.descripcion !== "" ? m.descripcion : "Sin descripción"}
                                        </div>
                                        <h6 className="my-2">Observaciones del Mantenimiento</h6>
                                        <div className='border rounded-2 mx-2 py-3 text-dark' style={{ fontSize: '18px' }}>
                                            {m.observaciones !== "" ? m.observaciones : "Sin observaciones"}
                                        </div>
                                    </div>
                                </div>
                            )
                        })
                    }
                    <div style={{ backgroundColor: '#0ca3aeb2', color: 'white' }}>
                        <hr className='my-2' />
                        <h4 className="mx-2">Incidentes de la Máquina</h4>
                        <hr className='my-2' />
                    </div>
                    {
                        maquina.incidentes.map(i => {
                            return (
                                <div className='border-dark border-bottom my-2'>
                                    <div className='row my-2'>
                                        <div className='col-md-6'>
                                            <h6 className="my-2">Fecha del Mantenimiento</h6>
                                            <Label icon="fas fa-calendar" value={getFecha(i.fecha)} />
                                            <h6 className="my-2">Ubicación en Planta de la Máquina</h6>
                                            <Label icon="fas fa-globe" value={maquina.maquina.ubicacion.nombre} />
                                        </div>
                                        <div className='col-md-6'>
                                            <h6 className="my-2">Estado del Mantenimiento</h6>
                                            <Label icon="fas fa-clock" value={i.estado} />
                                        </div>
                                        <h6 className="my-2">Descripción del Mantenimiento</h6>
                                        <div className='border rounded-2 mx-2 py-3 text-dark' style={{ fontSize: '18px' }}>
                                            {i.descripcion !== "" ? i.descripcion : "Sin descripción"}
                                        </div>
                                        <h6 className="my-2">Observaciones del Mantenimiento</h6>
                                        <div className='border rounded-2 mx-2 py-3 text-dark' style={{ fontSize: '18px' }}>
                                            {i.causa !== "" ? i.causa : "Sin causa"}
                                        </div>
                                    </div>
                                </div>
                            )
                        })
                    }
                </div>
            }
        </>
    )
}

export default withRouter(InformacionMaquinaria)
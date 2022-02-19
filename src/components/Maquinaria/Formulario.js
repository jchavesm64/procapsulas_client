/* eslint-disable array-callback-return */
import React, { useState, useEffect } from 'react'
import { Notification, SelectPicker, Loader } from 'rsuite'
import Boton from '../shared/Boton'
import Label from '../shared/Label'
import Action from '../shared/Action'
import { withRouter } from 'react-router-dom'
import { useMutation, useQuery } from '@apollo/react-hooks'
import { UPDATE_MAQUINA } from '../../services/MaquinaService'
import { OBTENER_CATEGORIAS } from '../../services/CategoriaService'
import { OBTENER_UBICACIONES } from '../../services/UbicacionService';

const EditarMaquina = ({ props, maquina }) => {
    const { uso } = props
    const [nombre, setNombre] = useState(maquina.nombre)
    const [caracteristicas, setCaracteristicas] = useState(maquina.caracteristicas)
    const [partes, setPartes] = useState(maquina.partes)
    const [categoria, setCategoria] = useState(maquina.categoria.id)
    const [ubicacion, setUbicacion] = useState(maquina.ubicacion.id)
    const [vida_util, setVida] = useState(maquina.vida_util)
    const [fecha_adquirido, setFecha] = useState(maquina.fecha_adquirido)
    const [datos, setDatos] = useState(true)
    const [datos_partes, setDatosPartes] = useState(false)
    const [reload, setReload] = useState(false)
    const [parte, setParte] = useState({ "parte": "", caracteristicas: [{ "clave": "Modelo", "valor": "" }] })
    const [nombreParte, setNombreParte] = useState(parte.nombre)
    const [insertar] = useMutation(UPDATE_MAQUINA);
    const { loading: load_categorias, data: data_categorias } = useQuery(OBTENER_CATEGORIAS, { pollInterval: 1000 })
    const { loading: load_ubicaciones, data: data_ubicaciones } = useQuery(OBTENER_UBICACIONES, { pollInterval: 1000 })

    useEffect(() => {
        setNombre(maquina.nombre)
        setCaracteristicas(maquina.caracteristicas)
        setPartes(maquina.partes)
        setCategoria(maquina.categoria.id)
        setUbicacion(maquina.ubicacion.id)
        setVida(maquina.vida_util)
        setFecha(maquina.fecha_adquirido)
    }, [maquina])

    function getFecha(fecha) {
        var date = new Date(fecha);
        var day = (date.getDate() < 9) ? '0' + (date.getDate() + 1) : date.getDate() + 1;
        var mes = (date.getMonth() < 9) ? '0' + (date.getMonth() + 1) : date.getMonth() + 1;
        return date.getFullYear() + '-' + mes + '-' + day;
    }

    const getCategorias = () => {
        const categorias = []
        if (data_categorias) {
            data_categorias.obtenerCategorias.map(item => {
                categorias.push({
                    "label": item.nombre,
                    "value": item.id
                })
            })
        }
        return categorias
    }

    const getUbicaciones = () => {
        const ubicaciones = []
        if (data_ubicaciones) {
            data_ubicaciones.obtenerUbicaciones.map(item => {
                ubicaciones.push({
                    "label": item.nombre,
                    "value": item.id
                })
            })
        }
        return ubicaciones
    }

    const onSaveMaquina = async () => {
        var date = new Date();
        var fecha = date.getFullYear() + "-" + (((date.getMonth() + 1) < 10) ? ('0' + (date.getMonth() + 1)) : (date.getMonth() + 1)) + '-' + ((date.getDate() < 10) ? ('0' + date.getDate()) : date.getDate());
        let band = false
        caracteristicas.map(item => {
            if (item.clave === '' || item.valor === '') {
                band = true
            }
        })
        if (!band) {
            if (fecha_adquirido <= fecha) {
                if (vida_util > 0) {
                    const input = {
                        nombre,
                        caracteristicas,
                        partes,
                        categoria,
                        ubicacion,
                        vida_util,
                        fecha_adquirido,
                        estado: 'ACTIVO'
                    }
                    const { data } = await insertar({ variables: { id: maquina.id, input }, errorPolicy: 'all' });
                    const { estado, message } = data.actualizarMaquina;
                    if (estado) {
                        Notification['success']({
                            title: 'Ingresar Entrada',
                            duration: 5000,
                            description: message
                        })
                        props.history.push(`/maquinaria`);
                    } else {
                        Notification['error']({
                            title: 'Ingresar Entrada',
                            duration: 5000,
                            description: message
                        })
                    }
                } else {
                    Notification['warning']({
                        title: 'Agregar Máquina',
                        duration: 20000,
                        description: "La vida útil debe ser mayor a cero"
                    })
                }
            } else {
                Notification['warning']({
                    title: 'Agregar Máquina',
                    duration: 20000,
                    description: "La fecha de adquisición debe ser hoy  o anterior a hoy"
                })
            }
        } else {
            Notification['warning']({
                title: 'Agregar Máquina',
                duration: 20000,
                description: "Incongruencias en los datos de la máquinas"
            })
        }
    }

    const addCaracteristicaKey = (key, dato) => {
        let find = false
        caracteristicas.map(item => {
            if (item === key) {
                find = true
                item.clave = dato
            }
        })
        if (!find) {
            caracteristicas.push({
                "clave": dato,
                "valor": ""
            })
        }
    }

    const addCaracteristicaValor = (key, dato) => {
        let find = false
        caracteristicas.map(item => {
            if (item === key) {
                find = true
                item.valor = dato
            }
        })
        if (!find) {
            caracteristicas.push({
                "clave": key,
                "valor": dato
            })
        }
    }

    const addCaracteritica = () => {
        caracteristicas.push({
            "clave": "",
            "valor": ""
        })
        setReload(!reload)
    }

    const removeCaracteritica = (item) => {
        caracteristicas.splice(caracteristicas.indexOf(item), 1)
        console.log(caracteristicas)
        setReload(!reload)
    }

    const validarForm = () => {
        return !nombre || caracteristicas.length === 0 || !categoria || !ubicacion || !vida_util || !fecha_adquirido
    }

    const FichaCaracteristica = ({ item }) => {
        return (
            <div className='row my-2'>
                <div className='col-md-3 float-left'>
                    <input className="form-control" type="text" placeholder={item.clave} defaultValue={item.clave} onChange={(e) => addCaracteristicaKey(item, e.target.value)} />
                </div>
                <div className='col-md-8 float-left'>
                    <input className="form-control" type="text" placeholder={item.clave} defaultValue={item.valor} onChange={(e) => addCaracteristicaValor(item, e.target.value)} />
                </div>
                {
                    uso === true &&
                    <div className='col-md-1 float-left'>
                        <Action className="mb-1" onClick={() => removeCaracteritica(item)} tooltip={"Remover"} color={"red"} icon={"close"} size="xs" />
                    </div>
                }
            </div>
        )
    }

    const addParte = () => {
        parte.parte = nombreParte
        let message = ''
        let band = false
        if (parte.parte === '') {
            message += 'No ingreso el nombre de la parte  de máquina'
        }
        if (parte.caracteristicas.length === 0) {
            message += "\nNo ingreso datos de la parte de máquina"
        }
        parte.caracteristicas.map(item => {
            if (item.clave === '' || item.valor === '') {
                band = true
            }
        })
        if (band) {
            message += "\nIncongruencias en los datos de la parte de máquina"
        }
        if (message.length === 0) {
            partes.push(parte)
            setParte({ "parte": "", caracteristicas: [{ "clave": "Modelo", "valor": "" }] })
            setNombreParte('')
        } else {
            Notification['warning']({
                title: 'Agregar Parte de Máquina',
                duration: 20000,
                description: message
            })
        }
        setReload(!reload)
    }

    const addCaracteriticaParte = () => {
        parte.caracteristicas.push({
            "clave": "",
            "valor": ""
        })
        setReload(!reload)
    }

    const removeCaracteriticaParte = (item) => {
        parte.caracteristicas.splice(caracteristicas.indexOf(item), 1)
        setReload(!reload)
    }
    const addCaracteristicaParteKey = (key, dato) => {
        let find = false
        parte.caracteristicas.map(item => {
            if (item === key) {
                find = true
                item.clave = dato
            }
        })
        if (!find) {
            parte.caracteristicas.push({
                "clave": dato,
                "valor": ""
            })
        }
    }

    const addCaracteristicaParteValor = (key, dato) => {
        let find = false
        parte.caracteristicas.map(item => {
            if (item === key) {
                find = true
                item.valor = dato
            }
        })
        if (!find) {
            parte.caracteristicas.push({
                "clave": key,
                "valor": dato
            })
        }
    }

    const FichaCaracteristicaParte = ({ item }) => {
        return (
            <div className='row my-2'>
                <div className='col-md-3 float-left'>
                    <input className="form-control" type="text" placeholder={item.clave} defaultValue={item.clave} onChange={(e) => addCaracteristicaParteKey(item, e.target.value)} />
                </div>
                <div className='col-md-8 float-left'>
                    <input className="form-control" type="text" placeholder={item.clave} defaultValue={item.valor} onChange={(e) => addCaracteristicaParteValor(item, e.target.value)} />
                </div>
                {
                    uso === true &&
                    <div className='col-md-1 float-left'>
                        <Action className="mb-1" onClick={() => removeCaracteriticaParte(item)} tooltip={"Remover"} color={"red"} icon={"close"} size="xs" />
                    </div>
                }
            </div>
        )
    }

    const removeParte = (item) => {
        partes.splice(partes.indexOf(item), 1)
        setReload(!reload)
    }

    const FichaParte = ({ item }) => {
        return (
            <div className='rounded bg-white shadow px-1 mx-2' style={{ width: 250, maxWidth: 250 }}>
                {
                    uso === true &&
                    <div className='d-flex col-md-12 justify-content-end float-right mt-2'>
                        <Action className="mb-1" onClick={() => removeParte(item)} tooltip={"Remover"} color={"red"} icon={"close"} size="xs" />
                    </div>
                }
                <h6>Parte</h6>
                <Label icon="font" value={item.parte} />
                <h6>Datos de la Parte de Máquina</h6>
                {
                    item.caracteristicas.map(item2 => {
                        return (<Label icon="circle" value={item2.clave + ': ' + item2.valor} />)
                    })
                }
            </div>
        )
    }

    if (load_categorias || load_ubicaciones) return (<Loader backdrop content="Cargando..." vertical size="lg" />);

    return (
        <>
            <div>
                <Boton name="Atras" onClick={e => props.history.push(`/maquinaria`)} icon="arrow-left-line" tooltip="Ir a Maquinaria" size="xs" color="blue" />
            </div>
            <h3 className="text-center">{uso ? "Editar Máquina" : "Detalles de Máquina"}</h3>
            <h6>Nombre de la Máquina</h6>
            <input className="form-control mt-2" type="text" placeholder="Nombre de la Máquina" value={nombre} onChange={(e) => setNombre(e.target.value)} />
            <div className="row">
                <div className="col-md-6 float-left mt-2">
                    <h6>Categoría</h6>
                    <SelectPicker className="mx-auto w-100 mt-3" size="md" placeholder="Categoría" value={categoria} data={getCategorias()} onChange={(e) => setCategoria(e)} searchable={true} />
                    <h6 className="my-1">Vida Util en años</h6>
                    <input className="form-control mt-2" type="text" placeholder="Vida Util" value={vida_util} onChange={(e) => setVida(e.target.value)} />
                </div>
                <div className="col-md-6 mt-2">
                    <h6>Ubicación en Planta</h6>
                    <SelectPicker className="mx-auto w-100 mt-3" size="md" placeholder="Ubicación en Planta" value={ubicacion} data={getUbicaciones()} onChange={(e) => setUbicacion(e)} searchable={true} />
                    <h6 className="my-1">Fecha de Adquisición</h6>
                    <input className="form-control mt-2" type="date" placeholder="Fecha de Adquisición" value={getFecha(fecha_adquirido)} onChange={(e) => setFecha(e.target.value)} />
                </div>
            </div>
            <div className="row border-bottom border-dark my-3">
                <div className="col-md-11 float-left">
                    <h5 className="mt-2">Otros datos de la máquina</h5>
                </div>
                <div className="d-flex col-md-1 justify-content-end float-right">
                    <Action className="mb-1" onClick={() => { setDatos(!datos) }} tooltip={datos ? "Ocultar" : "Mostrar"} color={"cyan"} icon={datos ? "angle-up" : "angle-down"} size="xs" />
                </div>
            </div>
            {
                (datos) &&
                <>
                    <div className='my-4'>
                        {caracteristicas &&
                            caracteristicas.map(item => {
                                return (<FichaCaracteristica item={item} />)
                            })
                        }
                        {
                            uso === true &&
                            <div className="d-flex col-md-12 justify-content-end float-right">
                                <Action className="mb-1" onClick={addCaracteritica} tooltip={"Agregar Otro Dato"} color={"green"} icon={"plus"} size="xs" />
                            </div>
                        }
                    </div>
                </>
            }
            <div className="row border-bottom border-dark mt-5">
                <div className="col-md-11 float-left">
                    <h5>Partes de la Máquina</h5>
                </div>
                <div className="d-flex col-md-1 justify-content-end float-right">
                    <Action className="mb-1" onClick={() => { setDatosPartes(!datos_partes) }} tooltip={datos_partes ? "Ocultar" : "Mostrar"} color={"cyan"} icon={datos_partes ? "angle-up" : "angle-down"} size="xs" />
                </div>
            </div>
            {
                (datos_partes && uso) &&
                <>
                    <h6 className='mt-2'>Parte</h6>
                    <input className="form-control mt-2" type="text" placeholder="Nombre de la Máquina" value={nombreParte} onChange={(e) => setNombreParte(e.target.value)} />
                    <h6 className='my-3'>Datos de la Parte</h6>
                    {parte.caracteristicas &&
                        parte.caracteristicas.map(item => {
                            return (<FichaCaracteristicaParte item={item} />)
                        })
                    }
                    {
                        uso === true &&
                        <>
                            <div className="d-flex col-md-12 justify-content-end float-right">
                                <Action className="mb-1" onClick={addCaracteriticaParte} tooltip={"Agregar Otro Dato"} color={"green"} icon={"plus"} size="xs" />
                            </div>
                            <div className="d-flex col-md-12 justify-content-start float-right">
                                <Boton className="mb-1" name={"Agregar Parte"} onClick={addParte} tooltip={"Agregar Parte"} color={"green"} icon={"plus"} size="md" />
                            </div>
                        </>
                    }
                </>
            }
            <div className='d-flex flex-wrap justify-content-start col-xs mt-3'>
                {
                    partes.map(item => {
                        return (<FichaParte item={item} />)
                    })
                }
            </div>
            {
                uso === true &&
                <div className="d-flex justify-content-end float-rigth mt-3">
                    <Boton onClick={onSaveMaquina} tooltip="Guardar Máquina" name="Guardar" icon="save" color="green" disabled={validarForm()} />
                </div>
            }
        </>
    )
}

export default withRouter(EditarMaquina)
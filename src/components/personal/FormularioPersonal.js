/* eslint-disable array-callback-return */
import React, { useState, useEffect } from 'react'
import { useQuery, useMutation } from "@apollo/react-hooks";
import { countries } from '../../Json/countries.json'
import { states } from '../../Json/states.json'
import { UPDATE_PERSONAL } from '../../services/PersonalService'
import { OBTENER_PUESTOS } from '../../services/PuestoService'
import List from '../shared/List'
import { Notification, SelectPicker, InputGroup, Icon, InputPicker, Input, Loader } from 'rsuite'
import Boton from '../shared/Boton'
import Action from '../shared/Action'
import { withRouter } from 'react-router';

const FormularioPersonal = ({ props, personal }) => {

    const {uso} = props;

    const getPais = (pais) => {
        var country = null
        countries.map(p => {
            if (p.name === pais) {
                country = p
            }
        })
        return country;
    }

    const getCiudad = (ciudad) => {
        var city = null
        states.map(c => {
            if (c.name === ciudad) {
                city = c
            }
        })
        return city;
    }

    function getFecha(fecha) {
        var date = new Date(fecha);
        var day = (date.getDate() < 9) ? '0' + (date.getDate() + 1) : date.getDate() + 1;
        var mes = (date.getMonth() < 9) ? '0' + (date.getMonth() + 1) : date.getMonth() + 1;
        return date.getFullYear() + '-' + mes + '-' + day;
    }

    const [nombre, setNombre] = useState(personal.nombre);
    const [cedula, setCedula] = useState(personal.cedula);
    const [pais, setPais] = useState(getPais(personal.pais));
    const [ciudad, setState] = useState(getCiudad(personal.state));
    const [direccion, setDireccion] = useState(personal.direccion);
    const [telefonos, setTelefonos] = useState(personal.telefonos);
    const [correos, setCorreos] = useState(personal.correos);
    const [city, setCity] = useState(personal.ciudad)
    const [calle, setCalle] = useState(personal.calle)
    const [cp, setCP] = useState(personal.codpostal)
    const [refrescar, setRefrescar] = useState(false);
    const [actualizar] = useMutation(UPDATE_PERSONAL);
    const [datos, setDatos] = useState(true);
    const [contacto, setContacto] = useState(false);
    const [ubicacion, setUbicacion] = useState(false);
    const [code, setCode] = useState('')
    const [puesto, setPuesto] = useState(personal.puesto.id);
    const [fecha, setFecha] = useState(getFecha(personal.fecha_contrato))
    const { loading: load_puestos, error, data: puestos } = useQuery(OBTENER_PUESTOS, { pollInterval: 1000 });

    useEffect(() => {
        setNombre(personal.nombre)
        setCedula(personal.cedula)
        setPuesto(personal.puesto.id)
        setFecha(getFecha(personal.fecha_contrato))
        setPais(getPais(personal.pais))
        setState(getCiudad(personal.state))
        setCity(personal.ciudad)
        setDireccion(personal.direccion)
        setTelefonos(personal.telefonos)
        setCorreos(personal.correos)
        setCity(personal.ciudad)
        setCalle(personal.calle)
        setCP(personal.codpostal)
    }, [personal])

    const getCodes = () => {
        const codes = []
        countries.map(c => {
            codes.push({
                "label": c.code,
                "value": c.code
            })
        })
        return codes
    }

    const getPaises = () => {
        const paises = []
        countries.map(p => {
            paises.push({
                "label": p.name,
                "value": p
            })
        });
        return paises;
    }

    const getCiudades = () => {
        if (pais !== null) {
            const ciudades = [];
            states.map(c => {
                if (c.id_country === pais.id) {
                    ciudades.push({
                        "label": c.name,
                        "value": c
                    })
                }
            })
            return ciudades;
        }
        return []
    }

    const getPuestos = () => {
        const list_puestos = []
        puestos.obtenerPuestos.map(item => {
            list_puestos.push({
                "label": item.nombre,
                "value": item.id
            })
        })
        return list_puestos
    }

    const agregarTelefono = (telefono) => {
        if (pais) {
            var band = false;
            telefonos.map(t => {
                if (pais.code + ' ' + t.telefono === telefono) {
                    band = true;
                }
            })
            if (!band) {
                telefonos.push({
                    "telefono": pais.code + ' ' + telefono
                })
                document.getElementById('telefono').value = "";
                setRefrescar(!refrescar);
            } else {
                Notification['info']({
                    title: 'Agregar Telefono',
                    duration: 5000,
                    description: "Ya está agregado el telefono"
                })
            }
        } else {
            Notification['info']({
                title: 'Agregar Telefono',
                duration: 5000,
                description: "No ha seleccionado un código"
            })
        }
    }

    const agregarCorreo = (correo) => {
        if (/^[-\w.%+]{1,64}@(?:[A-Z0-9-]{1,63}\.){1,125}[A-Z]{2,63}$/i.test(correo)) {
            var band = false;
            correos.map(c => {
                if (c.email === correo) {
                    band = true;
                }
            })
            if (!band) {
                correos.push({
                    "email": correo
                })
                document.getElementById('correo').value = "";
                setRefrescar(!refrescar);
            } else {
                Notification['info']({
                    title: 'Agregar Correo',
                    duration: 5000,
                    description: "Ya está agregado el correo"
                })
            }
        } else {
            Notification['info']({
                title: 'Agregar Correo',
                duration: 5000,
                description: "El formato de correo no es valido"
            })
        }
    }

    const validarForm = () => {
        return !nombre || !cedula || !pais || !ciudad || !direccion || telefonos.length === 0 || correos.length === 0;
    }

    const onUpdatePersonal = async () => {
        try {
            const input = {
                nombre,
                cedula: cedula.replace(/-/g, ""),
                pais: pais.name,
                state: ciudad.name,
                ciudad: city,
                calle,
                codpostal: cp,
                direccion,
                telefonos,
                correos,
                puesto,
                fecha_contrato: fecha,
                estado: "ACTIVO"
            }
            console.log(input)
            const { data } = await actualizar({ variables: { id: personal.id, input }, errorPolicy: 'all' });
            const { estado, message } = data.actualizarPersonal;
            if (estado) {
                Notification['success']({
                    title: 'Actualizar Colaborador',
                    duration: 5000,
                    description: message
                })
                props.history.push(`/personal`);
            } else {
                Notification['error']({
                    title: 'Actualizar Colaborador',
                    duration: 5000,
                    description: message
                })
            }
        } catch (error) {
            console.log(error)
            Notification['error']({
                title: 'Actualizar Colaborador',
                duration: 5000,
                description: "Hubo un error inesperado al guardar el personal"
            })
        }
    }

    if (load_puestos) return (<Loader backdrop content="Cargando..." vertical size="lg" />);


    return (
        <>
            <div>
                <Boton name="Atras" onClick={e => props.history.push(`/personal`)} icon="arrow-left-line" tooltip="Ir a clientes" size="xs" color="blue" />
            </div>
            <h3 className="text-center">{props.uso === true ? "Editar Colaborador" : "Detalles del Colaborador"}</h3>
            <div>
                <div className="row border-bottom border-dark my-3">
                    <div className="col-md-11 float-left">
                        <h5>Datos del Colaborador</h5>
                    </div>
                    <div className="d-flex col-md-1 justify-content-end float-right">
                        <Action className="mb-1" onClick={() => { setDatos(!datos) }} tooltip={datos ? "Ocultar" : "Mostrar"} color={"cyan"} icon={datos ? "angle-up" : "angle-down"} size="xs" />
                    </div>
                </div>
                {datos &&
                    <>
                        <div className="row">
                            <div className="justify-content-end col-md-4 float-right">
                                <h6>Número de identificación</h6>
                                <input className="form-control mt-3" type="text" placeholder="Número de identificación" value={cedula} onChange={(e) => setCedula(e.target.value)} />
                            </div>
                            <div className='col-md-8 float-left'>
                                <h6>Nombre del colaborador</h6>
                                <input className="form-control mt-3" type="text" placeholder="Nombre del colaborador" value={nombre} onChange={(e) => setNombre(e.target.value)} />
                            </div>
                        </div>
                        <div className="row mt-3">
                            <div className="col-md-6 float-left">
                                <h6>Puesto</h6>
                                <SelectPicker className="mx-auto w-100 mt-3" size="md" placeholder="Puestos" value={puesto} data={getPuestos()} onChange={(e) => setPuesto(e)} />
                            </div>
                            <div className="justify-content-end col-md-6 float-right">
                                <h6 className>Fecha de Contratación</h6>
                                <Input disabled={true} type="date" className="mx-auto w-100 mt-3" size="md" placeholder="Fecha de Contratación" defaultValue={fecha} onChange={(e) => setFecha(e)} />
                            </div>
                        </div>
                    </>
                }
                <div className="row border-bottom border-dark my-3">
                    <div className="col-md-11 float-left">
                        <h5 className="mt-2">Dirección del Colaborador</h5>
                    </div>
                    <div className="d-flex col-md-1 justify-content-end float-right">
                        <Action className="mb-1" onClick={() => { setUbicacion(!ubicacion) }} tooltip={ubicacion ? "Ocultar" : "Mostrar"} color={"cyan"} icon={ubicacion ? "angle-up" : "angle-down"} size="xs" />
                    </div>
                </div>
                {ubicacion &&
                    <>
                        <div className="row">
                            <div className="col-md-6 float-left">
                                <h6>Paises</h6>
                                <SelectPicker className="mx-auto w-100 mt-3" size="md" placeholder="Paises" data={getPaises()} onChange={(e) => setPais(e)} defaultValue={pais} />
                            </div>
                            <div className="justify-content-end col-md-6 float-right">
                                <h6 className>Provincia o Estado</h6>
                                <SelectPicker className="mx-auto w-100 mt-3" size="md" placeholder="Provincia o Estado" data={getCiudades()} onChange={(e) => setState(e)} defaultValue={ciudad} />
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-md-5">
                                <h6 className="mt-3">Ciudad</h6>
                                <input className="form-control mt-3" type="text" placeholder="Ciudad" value={city} onChange={(e) => setCity(e.target.value)} />
                            </div>
                            <div className="col-md-4">
                                <h6 className="mt-3">Calle</h6>
                                <input className="form-control mt-3" type="text" placeholder="Calle" value={calle} onChange={(e) => setCalle(e.target.value)} />
                            </div>
                            <div className="col-md-3">
                                <h6 className="mt-3">Código Postal</h6>
                                <input className="form-control mt-3" type="text" placeholder="Código Postal" value={cp} onChange={(e) => setCP(e.target.value)} />
                            </div>
                        </div>
                        <h6 className="mt-3">Dirección o señas particulares</h6>
                        <input className="form-control mt-3" type="text" placeholder="Dirección o señas particulares" value={direccion} onChange={(e) => setDireccion(e.target.value)} />
                    </>
                }
                <div className="row border-bottom border-dark my-3">
                    <div className="col-md-11 float-left">
                        <h5 className="mt-2">Contacto del Colaborador</h5>
                    </div>
                    <div className="d-flex col-md-1 justify-content-end float-right">
                        <Action className="mb-1" onClick={() => { setContacto(!contacto) }} tooltip={contacto ? "Ocultar" : "Mostrar"} color={"cyan"} icon={contacto ? "angle-up" : "angle-down"} size="xs" />
                    </div>
                </div>
                {contacto &&
                    <div>
                        <div style={{ margin: 0, padding: 0 }} className="row mt-3">
                            <div className="col-md-6 d-inline-block">
                                <List estilos="w-90 mx-auto" data={telefonos} clave="telefono" header="Teléfonos" edit={false} borrar={true} setRefrescar={setRefrescar} refrescar={refrescar} />
                                <div className="input-group mt-3 mb-3 w-90 mx-auto">
                                    {props.uso === true &&
                                        <InputGroup className="mx-auto w-90 btn-outline-light mb-2">
                                            <InputGroup.Addon>
                                                <Icon icon="phone" />
                                            </InputGroup.Addon>
                                            <InputPicker className="h-100 rounded-0" size="md" placeholder="Area" data={getCodes()} value={pais ? pais.code : ''} searchable={true} onChange={(e) => setCode(e)} />
                                            <input id="telefono" type="number" placeholder="Numero de teléfono" className="rounded-0 form-control" />
                                            <Boton className="rounded-0 h-100" icon="save" color="green" onClick={() => agregarTelefono(document.getElementById('telefono').value)} tooltip="Agregar Telefono" />
                                        </InputGroup>
                                    }
                                </div>
                            </div>
                            <div className="col-md-6 d-inline-block">
                                <List data={correos} clave="email" header="Correos" edit={false} borrar={true} setRefrescar={setRefrescar} refrescar={refrescar} />
                                <div className="input-group mt-3 mb-3 w-90 mx-auto">
                                    {props.uso === true &&
                                        <InputGroup className="mx-auto w-90 btn-outline-light mb-2">
                                            <InputGroup.Addon>
                                                <Icon icon="at" />
                                            </InputGroup.Addon>
                                            <input id="correo" type="email" placeholder="Dirección de correo electronico" className="rounded-0 form-control" />
                                            <Boton className="rounded-0 h-100" icon="save" color="green" onClick={() => agregarCorreo(document.getElementById('correo').value)} tooltip="Agregar Correo" />
                                        </InputGroup>
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                }
            </div>
            {props.uso === true &&
                <div className="d-flex justify-content-end float-rigth mt-3">
                    <Boton onClick={onUpdatePersonal} tooltip="Guardar Colaborador" name="Guardar" icon="save" color="green" disabled={validarForm()} />
                </div>
            }
        </>
    );
}

export default withRouter(FormularioPersonal);
import React, { useState } from 'react'
import { useMutation } from "@apollo/react-hooks";
import { countries } from '../../Json/countries.json'
import { states } from '../../Json/states.json'
import { countries2 } from '../../Json/countries2.json'
import { UPDATE_CLIENTE } from '../../services/ClienteService'
import List from '../shared/List'
import { Notification, SelectPicker, InputGroup, Icon, InputPicker } from 'rsuite'
import Boton from '../shared/Boton'
import Action from '../shared/Action'
import { withRouter } from 'react-router';

const FormularioCliente = ({ props, cliente }) => {

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

    const [tipo, setTipo] = useState(cliente.tipo);
    const [nombre, setNombre] = useState(cliente.nombre);
    const [codigo, setCodigo] = useState(cliente.codigo);
    const [pais, setPais] = useState(getPais(cliente.pais));
    const [ciudad, setCiudad] = useState(getCiudad(cliente.ciudad));
    const [direccion, setDireccion] = useState(cliente.direccion);
    const [telefonos, setTelefonos] = useState(cliente.telefonos);
    const [correos, setCorreos] = useState(cliente.correos);
    const [refrescar, setRefrescar] = useState(false);
    const [actualizar] = useMutation(UPDATE_CLIENTE);
    const [datos, setDatos] = useState(true);
    const [contacto, setContacto] = useState(false);
    const [ubicacion, setUbicacion] = useState(false);
    const [code, setCode] = useState('')

    React.useEffect(() => {
        setTipo(cliente.tipo)
        setNombre(cliente.nombre)
        setCodigo(cliente.codigo)
        setPais(getPais(cliente.pais))
        setCiudad(getCiudad(cliente.ciudad))
        setDireccion(cliente.direccion)
        setTelefonos(cliente.telefonos)
        setCorreos(cliente.correos)
    }, [cliente])

    const getCodes = () => {
        const codes = []
        countries2.map(c => {
            codes.push({
                "label": c.dial_code,
                "value": c.dial_code
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

    const getTipos = () => {
        const tipos = [];
        tipos.push({
            "label": "FISICO",
            "value": "FISICO"
        })
        tipos.push({
            "label": "EMPRESA",
            "value": "EMPRESA"
        })
        return tipos;
    }

    const agregarTelefono = (telefono) => {
        if(code !== ""){
            var band = false;
            telefonos.map(t => {
                if (code+' '+t.telefono === telefono) {
                    band = true;
                }
            })
            if (!band) {
                telefonos.push({
                    "telefono": code+' '+telefono
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
        }else{
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
                if(c.email === correo){
                    band = true;
                }
            })
            if(!band){
                correos.push({
                    "email": correo
                })
                document.getElementById('correo').value = "";
                setRefrescar(!refrescar);
            }else{
                Notification['info']({
                    title: 'Agregar Correo',
                    duration: 5000,
                    description: "Ya está agregado el correo"
                })
            }
        }else{
            Notification['info']({
                title: 'Agregar Correo',
                duration: 5000,
                description: "El formato de correo no es valido"
            })
        }
    }

    const validarForm = () => {
        return !tipo || !nombre || !codigo || !pais || !ciudad || !direccion || telefonos.length === 0 || correos.length === 0;
    }

    const onUpdateCliente = async () => {
        try {
            const input = {
                tipo,
                nombre,
                codigo,
                pais: pais.name,
                ciudad: ciudad.name,
                direccion,
                telefonos,
                correos,
                estado: "ACTIVO"
            }
            const { data } = await actualizar({ variables: { id: cliente.id, input }, errorPolicy: 'all' });
            const { estado, message } = data.actualizarCliente;
            if (estado) {
                Notification['success']({
                    title: 'Actualizar Cliente',
                    duration: 5000,
                    description: message
                })
                props.history.push(`/clientes`);
            } else {
                Notification['error']({
                    title: 'Actualizar Cliente',
                    duration: 5000,
                    description: message
                })
            }
        } catch (error) {
            console.log(error)
            Notification['error']({
                title: 'Insertar Cliente',
                duration: 5000,
                description: "Hubo un error inesperado al guardar el cliente"
            })
        }
    }

    return (
        <>
            <div>
                <Boton name="Atras" onClick={e => props.history.push(`/clientes`)} icon="arrow-left-line" tooltip="Ir a clientes" size="xs" color="blue" />
            </div>
            <h3 className="text-center">Editar Cliente</h3>
            <div>
                <div className="row border-bottom border-dark my-3">
                    <div className="col-md-11 float-left">
                        <h5>Datos del Cliente</h5>
                    </div>
                    <div className="d-flex col-md-1 justify-content-end float-right">
                        <Action className="mb-1" onClick={() => { setDatos(!datos) }} tooltip={datos ? "Ocultar" : "Mostrar"} color={"cyan"} icon={datos ? "angle-up" : "angle-down"} size="xs" />
                    </div>
                </div>
                {datos &&
                    <>
                        <div className="row">
                            <div className="col-md-4 float-left">
                                <h6>Tipo de Cliente</h6>
                                <SelectPicker className="mx-auto w-100 mt-3" size="md" placeholder="Tipo de Cliente" data={getTipos()} onChange={(e) => setTipo(e)} searchable={false} defaultValue={tipo} />
                            </div>
                            <div className="justify-content-end col-md-8 float-right">
                                <h6>Número de identificación de la empresa o persona</h6>
                                <input className="form-control mt-3" type="text" placeholder="Número de identificación de la empresa o persona" value={codigo} onChange={(e) => setCodigo(e.target.value)} disabled/>
                            </div>
                        </div>
                        <h6 className="mt-3">Nombre del cliente</h6>
                        <input className="form-control mt-3 mb-3" type="text" placeholder="Nombre del cliente" value={nombre} onChange={(e) => setNombre(e.target.value)} />
                    </>
                }
                <div className="row border-bottom border-dark my-3">
                    <div className="col-md-11 float-left">
                        <h5 className="mt-2">Contacto del Cliente</h5>
                    </div>
                    <div className="d-flex col-md-1 justify-content-end float-right">
                        <Action className="mb-1" onClick={() => { setContacto(!contacto) }} tooltip={contacto ? "Ocultar" : "Mostrar"} color={"cyan"} icon={contacto ? "angle-up" : "angle-down"} size="xs" />
                    </div>
                </div>
                {contacto &&
                    <div style={{margin: 0, padding: 0}} className="row mt-3">
                        <div className="col-md-6 d-inline-block">
                            <List estilos="w-90 mx-auto" data={telefonos} clave="telefono" header="Teleonos" edit={false} borrar={true}  setRefrescar={setRefrescar}/>
                            <div className="input-group mt-3 mb-3 w-90 mx-auto">
                                <InputGroup className="mx-auto w-90 btn-outline-light mb-2">
                                    <InputGroup.Addon>
                                        <Icon icon="phone" />
                                    </InputGroup.Addon>
                                    <InputPicker className="h-100 rounded-0" size="md" placeholder="Area" data={getCodes()} searchable={true} onChange={(e) => setCode(e)}/>
                                    <input id="telefono" type="number" placeholder="Numero de telefono" className="rounded-0 form-control" />
                                    <Boton className="rounded-0 h-100" icon="save" color="green" onClick={() => agregarTelefono(document.getElementById('telefono').value)} tooltip="Agregar Telefono" />
                                </InputGroup>
                            </div>
                        </div>
                        <div className="col-md-6 d-inline-block">
                            <List data={correos} clave="email" header="Correos" edit={false} borrar={true}  setRefrescar={setRefrescar}/>
                            <div className="input-group mt-3 mb-3 w-90 mx-auto">
                                <InputGroup className="mx-auto w-90 btn-outline-light mb-2">
                                    <InputGroup.Addon>
                                        <Icon icon="at" />
                                    </InputGroup.Addon>
                                    <input id="correo" type="email" placeholder="Dirección de correo electronico" className="rounded-0 form-control" />
                                    <Boton className="rounded-0 h-100" icon="save" color="green" onClick={() => agregarCorreo(document.getElementById('correo').value)} tooltip="Agregar Correo" />
                                </InputGroup>
                            </div>
                        </div>
                    </div>
                }
                <div className="row border-bottom border-dark my-3">
                    <div className="col-md-11 float-left">
                        <h5 className="mt-2">Dirección del Cliente</h5>
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
                                <h6>Ciudades</h6>
                                <SelectPicker className="mx-auto w-100 mt-3" size="md" placeholder="Provincias o Estados" data={getCiudades()} onChange={(e) => setCiudad(e)} defaultValue={ciudad} />
                            </div>
                        </div>
                        <h6 className="mt-3">Dirección o señas particulares</h6>
                        <input className="form-control mt-3" type="text" placeholder="Dirección o señas particulares" value={direccion} onChange={(e) => setDireccion(e.target.value)} />
                    </>
                }
            </div>
            <div className="d-flex justify-content-end float-rigth mt-3">
                <Boton onClick={onUpdateCliente} tooltip="Guardar Cliente" name="Guardar" icon="save" color="green" disabled={validarForm()} />
            </div>
        </>
    );
}

export default withRouter(FormularioCliente);
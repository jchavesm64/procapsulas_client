/* eslint-disable array-callback-return */
import React, { useState } from 'react'
import { withRouter } from 'react-router'
import { Input, InputPicker, Notification, Uploader, Loader, Checkbox, Modal, Button } from 'rsuite'
import { useQuery, useMutation } from '@apollo/react-hooks'
import { SAVE_MOVIMIENTO } from '../../../services/MovimientosService';
import { OBTENER_PROVEEDORES } from '../../../services/ProveedorService';
import { VALIDAR_PARAMETRO } from '../../../services/ParametrosGeneralesService';
import { UPLOAD_FILE_COA } from '../../../services/MovimientosService';
import Boton from '../../shared/Boton';

const NuevoMovimiento = (props) => {
    const [lote, setLote] = useState('')
    const [codigo, setCodigo] = useState('')
    const [proveedor, setProveedor] = useState('')
    const [fechaFabricacion, setFechaFabricacion] = useState('')
    const [fechaVencimiento, setFechaVencimiento] = useState('')
    const [cantidad, setCantidad] = useState('')
    const [precio, setPrecio] = useState('')
    const [moneda, setMoneda] = useState('US Dollar')
    const [file, setFile] = useState(null)
    const [validar, setValidar] = useState(false)
    const [parametro, setParametro] = useState('')
    const [p_correcto, setPCorrecto] = useState(false)
    const [insertar] = useMutation(SAVE_MOVIMIENTO);
    const { loading: load_proveedores, data: data_proveedores } = useQuery(OBTENER_PROVEEDORES, { pollInterval: 1000 })
    const [val_cod, {loading: load_validar}] = useMutation(VALIDAR_PARAMETRO);
    const [subir, { loading: subirLoading }] = useMutation(UPLOAD_FILE_COA)
    const { session } = props
    const { id } = props.match.params

    const subirArchivo = async () => {
        try {
            const { data } = await subir({ variables: { file: file.blobFile } });
            const { estado, filename, message } = data.subirArchivoCOA;
            console.log(filename)
            if (estado) {
                Notification['success']({
                    title: 'Subir Archivo',
                    description: message,
                    duration: 10000
                });
                onSaveMovimiento(filename)
            } else {
                Notification['error']({
                    title: 'Subir Archivo',
                    description: message,
                    duration: 10000
                });
            }
        } catch (error) {
            console.log(error)
            Notification["error"]({
                title: "Subir Archivo",
                duration: 10000,
                description: "Error al intentar subir el archivo",
            });
        }
    }

    const onSaveMovimiento = async (filename) => {
        var date = new Date();
        var fecha = date.getFullYear() + "-" + (((date.getMonth() + 1) < 10) ? ('0' + (date.getMonth() + 1)) : (date.getMonth() + 1)) + '-' + ((date.getDate() < 10) ? ('0' + date.getDate()) : date.getDate());
        if ((fechaFabricacion < fechaVencimiento && fechaFabricacion <= fecha) || p_correcto) {
            if (!(cantidad <= 0 || precio <= 0)) {
                try {
                    const input = {
                        tipo: 'ENTRADA',
                        lote,
                        codigo,
                        proveedor: proveedor.id,
                        fechaFabricacion,
                        fechaVencimiento,
                        fecha,
                        cantidad,
                        existencia: cantidad,
                        precio: cantidad * precio,
                        precio_unidad: precio,
                        moneda,
                        cao: filename,
                        usuario: session.id,
                        materia_prima: id
                    }
                    const { data } = await insertar({ variables: { input }, errorPolicy: 'all' });
                    const { estado, message } = data.insertarMovimiento;
                    if (estado) {
                        Notification['success']({
                            title: 'Ingresar Entrada',
                            duration: 5000,
                            description: message
                        })
                        props.history.push(`/materias_primas`);
                    } else {
                        Notification['error']({
                            title: 'Ingresar Entrada',
                            duration: 5000,
                            description: message
                        })
                    }
                } catch (error) {
                    console.log(error)
                    Notification['error']({
                        title: 'Ingresar Entrada',
                        duration: 5000,
                        description: "Hubo un error inesperado al guardar la entrada"
                    })
                }
            } else {
                Notification['error']({
                    title: 'Ingresar Entrada',
                    duration: 5000,
                    description: "Los valores numericos deben ser mayor a cero"
                })
            }
        } else {
            Notification['error']({
                title: 'Ingresar Entrada',
                duration: 5000,
                description: "Las fechas de fabericación y vencimiento son incorrectas"
            })
        }
    }

    const validarForm = () => {
        if (p_correcto) {
            return !lote || !codigo || !cantidad || !precio || !moneda || !file;
        } else {
            return !lote || !codigo || !fechaFabricacion || !fechaVencimiento || !cantidad || !precio || !moneda || !file;
        }
    }

    const selectArchivo = (file) => {
        console.log(file)
        setFile(file[0])
    }

    const getProvedores = () => {
        const datos = []
        if (data_proveedores.obtenerProveedores) {
            data_proveedores.obtenerProveedores.map(item => {
                datos.push({
                    "value": item,
                    "label": item.empresa
                });
            });
        }
        return datos;
    }

    const validarCodigo = async () => {
        const input = {
            codigo: 'C-001',
            valor: parametro
        }
        const {data} = await val_cod({ variables: { input }, errorPolicy: 'all' });
        const { estado, message } = data.validarParametro;
        if (estado) {
            Notification['success']({
                title: 'Recuperar Clave',
                description: message,
                duration: 10000
            });
            setValidar(false);
            setPCorrecto(true);
        } else {
            Notification['error']({
                title: 'Recuperar Clave',
                description: message,
                duration: 10000
            });
        }
    }

    if (load_proveedores || load_validar) return (<Loader backdrop content="Cargando..." vertical size="lg" />);

    if (subirLoading) {
        return (
            <Loader
                backdrop
                content="Subiendo archivo espere..."
                vertical
                size="lg"
            />
        );
    }

    return (
        <div>
            <div>
                <Boton name="Atras" onClick={e => props.history.push(`/materias_primas`)} icon="arrow-left-line" tooltip="Ir a Materias Primas" size="xs" color="blue" />
            </div>
            <h3 className="text-center">Ingresar Entrada</h3>
            <div className="row my-1">
                <div className="col-md-6">
                    <h6 className="my-1">Lote</h6>
                    <Input type="text" placeholder="Lote" value={lote} onChange={(e) => setLote(e)} />
                </div>
                <div className="col-md-6">
                    <h6 className="my-1">Código</h6>
                    <Input type="text" placeholder="Código" value={codigo} onChange={(e) => setCodigo(e)} />
                </div>
            </div>
            <hr />
            <Checkbox checked={validar || p_correcto} onChange={() => setValidar(!validar)}>Marcar para no especificar fechas</Checkbox>
            <Modal backdrop="static" show={validar} onHide={() => { setValidar(false) }}>
                <Modal.Header>
                    <Modal.Title>Código de Verificación</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="row mx-2">
                        <h6 className="mb-2" >Ingrese el Código</h6>
                        <Input type="text" placeholder="Código" value={parametro} onChange={(e) => setParametro(e)} />
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button disabled={parametro === ''} onClick={() => validarCodigo()} appearance="primary">
                        Validar
                    </Button>
                    <Button onClick={() => setValidar(false)} appearance="subtle">
                        Cancelar
                    </Button>
                </Modal.Footer>
            </Modal>
            <div className="row my-1">
                <div className="col-md-6">
                    <h6 className="my-1">Fecha de Fabricación</h6>
                    <Input type="date" placeholder="Fecha de Fabricación" value={fechaFabricacion} onChange={(e) => setFechaFabricacion(e)} />
                </div>
                <div className="col-md-6">
                    <h6 className="my-1">Fecha de Vencimiento</h6>
                    <Input type="date" placeholder="Fecha de Vencimiento" value={fechaVencimiento} onChange={(e) => setFechaVencimiento(e)} />
                </div>
            </div>
            <hr />
            <div className="row my-1">
                <div className="col-md-6">
                    <h6 className="my-1">Cantidad</h6>
                    <Input type="number" min={0} placeholder="Cantidad" value={cantidad} onChange={(e) => setCantidad(e)} />
                </div>
                <div className="col-md-6">
                    <h6 className="my-1">Precio Unidad</h6>
                    <div className="row">
                        <div className="col-md-6">
                            <Input type="number" placeholder="Precio Unidad" value={precio} onChange={(e) => setPrecio(e)} />
                        </div>
                        <div className="col-md-6">
                            <InputPicker className="w-100" data={[{ label: 'US Dollar', value: 'US Dollar' }, { label: 'Colón', value: 'Colón' }, { label: 'Yen', value: 'Yen' }]} placeholder="Moneda" value={moneda} onChange={(e) => setMoneda(e)} />
                        </div>
                    </div>

                </div>
            </div>
            <div className="w-75 mx-auto">
                <h6>Seleccione el Proveedor</h6>
                <InputPicker cleanable={false} className="rounded-0 w-100" size="md" placeholder="Proveedores" data={getProvedores()} searchable={true} onChange={(e) => setProveedor(e)} />
            </div>
            <div className="w-100 mx-auto">
                <h6>Seleccione el archivo COA</h6>
                <Uploader draggable removable fileList={[]} fileListVisible={false} multiple={false} autoUpload={false} onChange={selectArchivo} accept="application/*" className="text-center">
                    <div style={{ lineHeight: '100px' }}>{!file ? "Seleccion o Arrastre el archivo a esta area" : file.name}</div>
                </Uploader>
            </div>
            <div className="d-flex justify-content-end float-rigth mt-2">
                <Boton onClick={() => subirArchivo()} tooltip="Guardar Proveedor" name="Guardar" icon="save" color="green" disabled={validarForm()} />
            </div>
        </div>
    );
}

export default withRouter(NuevoMovimiento);
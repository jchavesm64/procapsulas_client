/* eslint-disable array-callback-return */
import React, { useState } from 'react'
import { Loader, Notification, IconButton, Icon, Input } from 'rsuite';
import { withRouter } from 'react-router'
import Label from '../shared/Label';
import readXlsxFile from 'read-excel-file';
import Table from '../shared/Table';
import Boton from '../shared/Boton';
import { SAVE_PLANILLA } from '../../services/PlanillaService';
import { useMutation, useLazyQuery } from "@apollo/react-hooks";
import { OBTENER_EMPLEADOS } from '../../services/PersonalService'

const CargarHoras = ({ ...props }) => {
    const date1 = new Date(), date2 = new Date()
    const dateL = new Date(date1.setDate(date1.getDate() - date1.getDay()))
    const dateD = new Date(date2.setDate(date2.getDate() - date2.getDay() + 6))
    const titles = [{ title: 'Nombre', class: '' }, { title: 'Cédula', class: '' }, { title: 'Horas Laboradas', class: '' }, { title: 'Precio Horas', class: '' }, { title: 'Total', class: '' }];

    const [fecha_lunes, setFechaLunes] = useState(dateL.toISOString().split('T')[0])
    const [fecha_domingo, setFechaDomingo] = useState(dateD.toISOString().split('T')[0])
    const [cargando, setCargando] = useState(false)
    const [data, setData] = useState('')
    const [datos, setDatos] = useState({ operativa: [], produccion: [], administrativa: [], procesado: false })
    const [insertar] = useMutation(SAVE_PLANILLA);
    const [empleados, { loading, error, data: datos_empleados }] = useLazyQuery(OBTENER_EMPLEADOS);


    const obtenerCedulas = (data) => {
        const cedulas = []
        let find = false
        data.map(d => {
            find = false
            cedulas.map(c => {
                if (c === d[0].replace(/-/g, "")) {
                    find = true
                }
            })
            if (!find) {
                cedulas.push(d[0].replace(/-/g, ""))
            }
        })
        return cedulas
    }

    const ReadFile = async (e) => {
        setCargando(true)
        try {
            let files = e.target.files, file = files[0];
            const isValid = (file.type === '.csv' || file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' || file.type === 'application/vnd.ms-excel');
            if (isValid) {
                readXlsxFile(file).then((rows) => {
                    if (rows !== undefined) {
                        rows.splice(0, 1)
                        setData(rows)
                        const cedulas = obtenerCedulas(rows)
                        empleados({ variables: { lista: cedulas } })
                    } else {
                        Notification['error']({
                            title: 'Error',
                            duration: 20000,
                            description: 'Excel no valido, verifique que contenga la información necesaria.'
                        })
                    }
                });
            } else {
                Notification['error']({
                    title: 'Error',
                    duration: 20000,
                    description: 'Archivo no valido, solo se permite archivos de tipo excel.'
                })
            }
        } catch (error) {
            Notification['error']({
                title: 'Error',
                duration: 20000,
                description: 'Ocurrio un error inesperado'
            })
        } finally {
            setCargando(false)
        }
    }

    const RowData = ({ data }) => {
        return (
            <tr>
                {
                    data.empleado.cedula ? (
                        <>
                            <td>{data.empleado.nombre}</td>
                            <td>{data.empleado.cedula}</td>
                            <td>{data.horas}</td>
                            <td>{data.empleado.puesto.salario}</td>
                            <td>{data.horas * data.empleado.puesto.salario}</td>
                        </>
                    ) : (
                        <>
                            <td className='text-white bg-danger'>{'DESCONOCIDO'}</td>
                            <td className='text-white bg-danger'>{data.empleado}</td>
                            <td className='text-white bg-danger'>{data.horas}</td>
                            <td className='text-white bg-danger'>{0}</td>
                            <td className='text-white bg-danger'>{0}</td>
                        </>
                    )
                }
            </tr >
        )
    }

    const getEmpleado = (cedula, lista_empleados) => {
        let emp = null
        for (let a = 0; a < lista_empleados.length; a++) {
            if (lista_empleados[a].cedula === cedula.replace(/-/g, "")) {
                emp = lista_empleados[a]
                break
            }
        }
        return emp
    }

    if (datos_empleados && !datos.procesado) {
        if (datos_empleados.obtenerEmpleados) {
            const info = { operativa: [], produccion: [], administrativa: [], procesado: true }
            let aux = null
            data.map(d => {
                aux = getEmpleado(d[0], datos_empleados.obtenerEmpleados)
                if (d[2] === 'PLANILLA OPERATIVA') {
                    info.operativa.push({
                        empleado: aux === null ? d[0].replace(/-/g, "") : aux,
                        horas: d[1],
                        tipo: d[2]
                    })
                } else if (d[2] === 'PRODUCCION DE CAPSULAS') {
                    info.produccion.push({
                        empleado: aux === null ? d[0].replace(/-/g, "") : aux,
                        horas: d[1],
                        tipo: d[2]
                    })
                } else {
                    info.administrativa.push({
                        empleado: aux === null ? d[0].replace(/-/g, "") : aux,
                        horas: d[1],
                        tipo: d[2]
                    })
                }
            })
            setDatos(info)
        }
    }

    const guardarExcel = async () => {
        setCargando(true)
        const input = {
            fecha_lunes,
            fecha_domingo,
            listado_horas: []
        }
        datos.operativa.map(o => {
            input.listado_horas.push({
                empleado: o.empleado.cedula,
                horas: o.horas,
                tipo: o.tipo
            })
        })
        datos.produccion.map(o => {
            input.listado_horas.push({
                empleado: o.empleado.cedula,
                horas: o.horas,
                tipo: o.tipo
            })
        })
        datos.administrativa.map(o => {
            input.listado_horas.push({
                empleado: o.empleado.cedula,
                horas: o.horas,
                tipo: o.tipo
            })
        })
        console.log(input)
        const { data } = await insertar({ variables: { input }, errorPolicy: 'all' });
        const { estado, message } = data.savePlanilla;
        if (estado) {
            Notification['success']({
                title: 'Insertar Planilla',
                duration: 5000,
                description: message
            })
            props.history.push(`/personal/planilla`);
        } else {
            Notification['error']({
                title: 'Insertar Planilla',
                duration: 5000,
                description: message
            })
        }
        setCargando(false)
    }

    const validarData = () => {
        let disable = false
        for(let a = 0; a < datos.operativa.length; a++){
            if(datos.operativa[a].empleado.cedula === undefined){
                disable = true
                break
            }
        }
        for(let a = 0; a < datos.produccion.length; a++){
            if(datos.produccion[a].empleado.cedula === undefined){
                disable = true
                break
            }
        }
        for(let a = 0; a < datos.administrativa.length; a++){
            if(datos.administrativa[a].empleado.cedula === undefined){
                disable = true
                break
            }
        }
        return disable
    }

    if (cargando || loading) return (<Loader backdrop content="Cargando..." vertical size="lg" />);

    return (
        <div className='mx-auto'>
            <h3 className='text-center'>Cargar Horas del Personal</h3>
            <hr />
            <div className='row'>
                <div className='col-md-6'>
                    <h5>Fecha del Lunes</h5>
                    <Input type="date" placeholder="Fecha del Lunes" value={fecha_lunes} onChange={(e) => setFechaLunes(e)} />
                </div>
                <div className='col-md-6'>
                    <h5>Fecha del Domingo</h5>
                    <Input type="date" placeholder="Fecha del Domingo" value={fecha_domingo} onChange={(e) => setFechaDomingo(e)} />
                </div>
            </div>
            {
                datos.procesado &&
                <>
                    {
                        (datos.operativa.length !== 0) &&
                        <div>
                            <h5 className="text-center my-2">Planilla Operativa</h5>
                            <Table Title={titles} Rows={RowData} info={datos.operativa} />
                        </div>
                    }
                    {
                        (datos.produccion.length !== 0) &&
                        <div>
                            <h5 className="text-center my-2">Producción de Cápsulas</h5>
                            <Table Title={titles} Rows={RowData} info={datos.produccion} />
                        </div>
                    }
                    {
                        (datos.administrativa.length !== 0) &&
                        <div>
                            <h5 className="text-center my-2">Planilla Administrativa</h5>
                            <Table Title={titles} Rows={RowData} info={datos.administrativa} />
                        </div>
                    }
                </>
            }
            <div className='mt-3'>
                {
                    datos.procesado ? (
                        <Boton onClick={guardarExcel} tooltip="Guardar Información" name="Guardar Información" icon="save" color="green" disabled={validarData()} />
                    ) : (
                        <IconButton icon={<Icon icon="fas fa-file-excel" />} placement="left" color="green" size="sm">
                            <label htmlFor="file-choser" size="sm">
                                Cargar Excel
                                <input id="file-choser" type="file" style={{ display: "none" }} accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel" onChange={(event) => { ReadFile(event) }} size="sm" />
                            </label>
                        </IconButton>
                    )
                }

            </div>
        </div>
    )
}

export default withRouter(CargarHoras)
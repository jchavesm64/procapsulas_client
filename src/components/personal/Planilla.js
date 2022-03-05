/* eslint-disable array-callback-return */
import React, { useState } from 'react'
import { Loader, Notification, Input } from 'rsuite';
import PlanillaExcel from './Exportar/PlanillaExcel';
import { PDFDownloadLink } from '@react-pdf/renderer'
import PlanillaPDF from './Exportar/PlanillaPDF';
import { useLazyQuery } from "@apollo/react-hooks";
import { withRouter } from 'react-router'
import { OBTENER_PLANILLA } from '../../services/PlanillaService';
import Boton from '../shared/Boton';
import Label from '../shared/Label'
import Table from '../shared/Table';

const Planilla = ({ ...props }) => {
    const [filtrar, { loading, error, data }] = useLazyQuery(OBTENER_PLANILLA);
    const [fecha1, setFecha1] = useState('')
    const [fecha2, setFecha2] = useState('')
    const titles = [{ title: 'Nombre', class: '' }, { title: 'Cédula', class: '' }, { title: 'Horas Laboradas', class: '' }, { title: 'Precio Horas', class: '' }, { title: 'Total', class: '' }];

    const obtenerInfo = async () => {
        await filtrar({ variables: { f1: fecha1, f2: fecha2 } })
    }

    if (loading) {
        return <Loader backdrop content="Cargando..." vertical size="lg" />
    }
    if (error) {
        Notification['error']({
            title: 'Error',
            description: "Error al obtener las horas para la planilla",
            duration: 10000

        });

    }

    function getFecha(fecha, simbol) {
        return fecha.replace(/-/g, simbol)
    }

    const getData = () => {
        if (data) {
            if (data.obtenerPlanilla) {
                const datos = data.obtenerPlanilla
                const planta = [], capsulas = [], admin = []
                datos.listado_horas.map(d => {
                    if (d.tipo === 'PLANILLA OPERATIVA') {
                        planta.push(d)
                    } else if (d.tipo === 'PRODUCCION DE CAPSULAS') {
                        capsulas.push(d)
                    } else {
                        admin.push(d)
                    }
                })
                return {
                    p: planta,
                    c: capsulas,
                    a: admin
                }
            }
        }
        return null
    }

    const RowData = ({ data }) => {
        return (
            <tr>
                <td>{data.empleado.nombre}</td>
                <td>{data.empleado.cedula}</td>
                <td>{data.horas}</td>
                <td>{data.empleado.puesto.salario}</td>
                <td>{data.horas * data.empleado.puesto.salario}</td>
            </tr>
        )
    }

    const calcularTotal = () => {
        let total = 0
        if (info !== null) {
            info.p.map(item => {
                total += (item.horas * item.empleado.puesto.salario);
            })
            info.c.map(item => {
                total += (item.horas * item.empleado.puesto.salario);
            })
            info.a.map(item => {
                total += (item.horas * item.empleado.puesto.salario);
            })
        }
        return total
    }

    const getInfoExcel = () => {
        const info_excel = { general: [], operativa: [], produccion: [], administrativa: [] }
        if (info !== null) {
            info_excel.general.push({ fecha1: fecha1 })
            info_excel.general.push({ fecha2: fecha2 })
            info_excel.general.push({ total: calcularTotal() })
            info_excel.operativa.push({nombre: 'PLANILLA OPERATIVA'})
            info.p.map(item => {
                info_excel.operativa.push({
                    nombre: item.empleado.nombre,
                    cedula: item.empleado.cedula,
                    horas: item.horas,
                    precio: item.empleado.puesto.salario,
                    total: item.horas * item.empleado.puesto.salario
                })
            })
            info.c.map(item => {
                info_excel.produccion.push({
                    nombre: item.empleado.nombre,
                    cedula: item.empleado.cedula,
                    horas: item.horas,
                    precio: item.empleado.puesto.salario,
                    total: item.horas * item.empleado.puesto.salario
                })
            })
            info.a.map(item => {
                info_excel.administrativa.push({
                    nombre: item.empleado.nombre,
                    cedula: item.empleado.cedula,
                    horas: item.horas,
                    precio: item.empleado.puesto.salario,
                    total: item.horas * item.empleado.puesto.salario
                })
            })
        }
        return info_excel
    }

    const info = getData()

    return (
        <div className='mx-auto'>
            <h3 className='text-center'>Generar Planilla del Personal</h3>
            <hr />
            <div className='row'>
                <div className='col-md-6'>
                    <h5>Fecha Menor</h5>
                    <Input type="date" placeholder="Fecha" value={fecha1} onChange={(e) => setFecha1(e)} />
                </div>
                <div className='col-md-6'>
                    <h5>Fecha Mayor</h5>
                    <Input type="date" placeholder="Fecha" value={fecha2} onChange={(e) => setFecha2(e)} />
                </div>
            </div>
            {
                info !== null &&
                <div className='mt-3'>
                    {
                        (info.p.length !== 0) &&
                        <div>
                            <h5 className="text-center my-2">Planilla Operativa</h5>
                            <Table Title={titles} Rows={RowData} info={info.p} />
                        </div>
                    }
                    {
                        (info.c.length !== 0) &&
                        <div>
                            <h5 className="text-center my-2">Producción de Cápsulas</h5>
                            <Table Title={titles} Rows={RowData} info={info.c} />
                        </div>
                    }
                    {
                        (info.a.length !== 0) &&
                        <div>
                            <h5 className="text-center my-2">Planilla Administrativa</h5>
                            <Table Title={titles} Rows={RowData} info={info.a} />
                        </div>
                    }
                    <div className='mt-5 row'>
                        <div className='d-flex justify-content-end col-md-6'>
                            <span><h4>Total: </h4></span>
                        </div>
                        <div className='col-md-6'>
                            <Label className="bg-white" icon="fas fa-hashtag" value={calcularTotal()} />
                        </div>
                    </div>
                </div>
            }
            <div className='mt-3'>
                {
                    info === null ? (
                        <Boton onClick={obtenerInfo} tooltip="Obtener Información" name="Obtener Información" icon="save" color="green" disabled={!fecha1 && !fecha2} />
                    ) : (
                        <div className='row'>
                            <div className='col-md-6 d-flex justify-content-start'>
                                <PDFDownloadLink
                                    document={<PlanillaPDF info={info} fecha1={getFecha(fecha1, " - ")} fecha2={getFecha(fecha2, " - ")} total={calcularTotal()} />}
                                    fileName={`PLANILLA_PDF_${getFecha(fecha1, "_")}_${getFecha(fecha2, "_")}.pdf`}
                                >
                                    {({ blob, url, loading: loadingDocument, error: error_loading }) =>
                                        loadingDocument ?
                                            ''
                                            :
                                            <Boton icon="fas fa-file-pdf" size="lg" color="red" tooltip="Descargar Planilla en PDF" name="Descargar Planilla en PDF" position='end' />
                                    }
                                </PDFDownloadLink>
                            </div>
                        </div>
                    )
                }
            </div>
        </div>
    )
}

export default withRouter(Planilla)
/* eslint-disable array-callback-return */
import React from "react";
import { Page, Text, View, Document, StyleSheet, Image, Font } from '@react-pdf/renderer';
import srcRoboto1 from "./assets/Roboto-Light.ttf";
import srcRoboto2 from "./assets/Roboto-Regular.ttf";
import srcRoboto3 from "./assets/Roboto-Bold.ttf";
import srcRoboto4 from "./assets/Roboto-Black.ttf";
import logo from "./assets/logo.png";

const CotizacionPDF = ({ ...props }) => {
    const date = new Date();
    const fecha = date.getFullYear() + "-" + (((date.getMonth() + 1) < 10) ? ('0' + (date.getMonth() + 1)) : (date.getMonth() + 1)) + '-' + ((date.getDate() < 10) ? ('0' + date.getDate()) : date.getDate());
    const { formula, cliente, producto, objeto } = props
    let capsula = [], datos = []
    console.log(objeto)

    const getDatosFormulaBase = () => {
        for (let i = 0; i < objeto.elementos_c.length; i++) {
            capsula.push({
                materia_prima: objeto.elementos_c[i],
                cantidad_kilo: objeto.cantidad_c[i],
                precio_kilo: objeto.precios_c[i]
            })
        }
        capsula.push({
            materia_prima: { id: 'nulo', nombre: 'Agua Purificada' },
            cantidad_kilo: objeto.agua,
            precio_kilo: 0
        })
        console.log(capsula)
        return capsula
    }

    const getTotalCapsula = () => {
        let total = 0
        capsula.map(item => {
            total += item.cantidad_kilo * item.precio_kilo
        })
        return total
    }

    const getElementosFormula = () => {
        for (let i = 0; i < objeto.elementos.length; i++) {
            datos.push({
                materia_prima: objeto.elementos[i],
                porcentaje: objeto.porcentajes[i],
                precio_kilo: objeto.precios[i]
            })
        }
        console.log(datos)
        return datos
    }

    /* DURA Y BLANDA */

    const getMiligramosCapsula = (porcentaje, peso) => {
        return parseFloat((porcentaje * peso) / 100).toFixed(4)
    }

    const getGramosCapsula = (porcentaje, peso) => {
        return parseFloat(getMiligramosCapsula(porcentaje, peso) / 1000).toFixed(4);
    }

    const getGramosEnvase = (porcentaje, peso, cantidad) => {
        return parseFloat((getMiligramosCapsula(porcentaje, peso) / 1000) * cantidad).toFixed(4);
    }

    const getGramosTotal = (porcentaje, peso, cantidad, envases) => {
        return parseFloat(((getMiligramosCapsula(porcentaje, peso) / 1000) * cantidad) * envases).toFixed(4);
    }

    const getKilos = (porcentaje, peso, cantidad, envases) => {
        return parseFloat((((getMiligramosCapsula(porcentaje, peso) / 1000) * cantidad) * envases) / 1000).toFixed(4);
    }

    const getTotalFila = (porcentaje, peso, cantidad, envases, precio_kilo) => {
        return parseFloat(getKilos(porcentaje, peso, cantidad, envases) * precio_kilo).toFixed(4)
    }

    /* POLVO */

    const getGramosScoop = (porcentaje, dosis) => {
        return parseFloat((porcentaje * dosis) / 100).toFixed(4)
    }

    const getGramosTarro = (porcentaje, dosis, serving) => {
        return parseFloat(getGramosScoop(porcentaje, dosis) * serving).toFixed(4)
    }

    const getGramosEnvasePolvo = (porcentaje, dosis, serving, envases) => {
        return parseFloat(getGramosTarro(porcentaje, dosis, serving) * envases).toFixed(4)
    }

    const getKilosTotal = (porcentaje, dosis, serving, envases) => {
        return parseFloat((getGramosTarro(porcentaje, dosis, serving) * envases) / 1000).toFixed(4)
    }

    const getTotalFilaPolvo = (porcentaje, dosis, serving, envases, precio) => {
        return parseFloat(getKilosTotal(porcentaje, dosis, serving, envases) * precio).toFixed(4)
    }

    /* STICKS */

    const getGramosScoopStick = (porcentaje, peso) => {
        return parseFloat((porcentaje * peso) / 100).toFixed(4)
    }

    const getGramosEnvaseStick = (porcentaje, peso, envases) => {
        return parseFloat(getGramosScoopStick(porcentaje, peso) * envases).toFixed(4)
    }

    const getKilosTotalStick = (porcentaje, peso, envases) => {
        return parseFloat(getGramosEnvaseStick(porcentaje, peso, envases) / 1000).toFixed(4)
    }

    const getTotalFilaStick = (porcentaje, peso, envases, precio) => {
        return parseFloat(getKilosTotalStick(porcentaje, peso, envases) * precio).toFixed(4)
    }

    const generarElementosFormula = () => {
        if (producto.tipo === 'Cápsula dura' || producto.tipo === 'Cápsula blanda') {
            return (
                <View style={styles.table}>
                    <View style={styles.tableRow}>
                        <View style={[styles.tableColGray, { width: '20%' }]}>
                            <Text style={[styles.tableCellGray2, { fontWeight: 400, textAlign: 'center', marginRight: 10 }]}>Materia prima</Text>
                        </View>
                        <View style={[styles.tableColGray, { width: '6%' }]}>
                            <Text style={[styles.tableCellGray2, { fontWeight: 400, textAlign: 'center', marginRight: 10 }]}>%</Text>
                        </View>
                        <View style={[styles.tableColGray, { width: '10%' }]}>
                            <Text style={[styles.tableCellGray2, { fontWeight: 400, textAlign: 'center', marginRight: 10 }]}>MG Cápsula</Text>
                        </View>
                        <View style={[styles.tableColGray, { width: '10%' }]}>
                            <Text style={[styles.tableCellGray2, { fontWeight: 400, textAlign: 'center', marginRight: 10 }]}>GR Cápsula</Text>
                        </View>
                        <View style={[styles.tableColGray, { width: '10%' }]}>
                            <Text style={[styles.tableCellGray2, { fontWeight: 400, textAlign: 'center', marginRight: 10 }]}>GR Envase</Text>
                        </View>
                        <View style={[styles.tableColGray, { width: '12%' }]}>
                            <Text style={[styles.tableCellGray2, { fontWeight: 400, textAlign: 'center', marginRight: 10 }]}>GR Total</Text>
                        </View>
                        <View style={[styles.tableColGray, { width: '10%' }]}>
                            <Text style={[styles.tableCellGray2, { fontWeight: 400, textAlign: 'center', marginRight: 10 }]}>KG Total</Text>
                        </View>
                        <View style={[styles.tableColGray, { width: '10%' }]}>
                            <Text style={[styles.tableCellGray2, { fontWeight: 400, textAlign: 'center', marginRight: 10 }]}>Precio KG</Text>
                        </View>
                        <View style={[styles.tableColGray, { width: '12%' }]}>
                            <Text style={[styles.tableCellGray2, { fontWeight: 400, textAlign: 'center', marginRight: 10 }]}>Total</Text>
                        </View>
                    </View>
                    {getElementosFormula().map((item, index) =>
                        <View style={styles.tableRow} key={index}>
                            <View style={[styles.tableCol, { width: '20%' }]}>
                                <Text style={[styles.tableCell, { fontWeight: 200, textAlign: 'center', marginRight: 10 }]}>{item.materia_prima.nombre}</Text>
                            </View>
                            <View style={[styles.tableCol, { width: '6%' }]}>
                                <Text style={[styles.tableCell, { fontWeight: 200, textAlign: 'center', marginRight: 10 }]}>{item.porcentaje + ' %'}</Text>
                            </View>
                            <View style={[styles.tableCol, { width: '10%' }]}>
                                <Text style={[styles.tableCell, { fontWeight: 200, textAlign: 'center', marginRight: 10 }]}>{getMiligramosCapsula(item.porcentaje, objeto.peso)}</Text>
                            </View>
                            <View style={[styles.tableCol, { width: '10%' }]}>
                                <Text style={[styles.tableCell, { fontWeight: 200, textAlign: 'center', marginRight: 10 }]}>{getGramosCapsula(item.porcentaje, objeto.peso)}</Text>
                            </View>
                            <View style={[styles.tableCol, { width: '10%' }]}>
                                <Text style={[styles.tableCell, { fontWeight: 200, textAlign: 'center', marginRight: 10 }]}>{getGramosEnvase(item.porcentaje, objeto.peso, objeto.cant_cap)}</Text>
                            </View>
                            <View style={[styles.tableCol, { width: '12%' }]}>
                                <Text style={[styles.tableCell, { fontWeight: 200, textAlign: 'center', marginRight: 10 }]}>{getGramosTotal(item.porcentaje, objeto.peso, objeto.cant_cap, objeto.cant_env)}</Text>
                            </View>
                            <View style={[styles.tableCol, { width: '10%' }]}>
                                <Text style={[styles.tableCell, { fontWeight: 200, textAlign: 'center', marginRight: 10 }]}>{getKilos(item.porcentaje, objeto.peso, objeto.cant_cap, objeto.cant_env)}</Text>
                            </View>
                            <View style={[styles.tableCol, { width: '10%' }]}>
                                <Text style={[styles.tableCell, { fontWeight: 200, textAlign: 'center', marginRight: 10 }]}>{'$ ' + item.precio_kilo}</Text>
                            </View>
                            <View style={[styles.tableCol, { width: '12%' }]}>
                                <Text style={[styles.tableCell, { fontWeight: 200, textAlign: 'center', marginRight: 10 }]}>{'$ ' + getTotalFila(item.porcentaje, objeto.peso, objeto.cant_cap, objeto.cant_env, item.precio_kilo)}</Text>
                            </View>
                        </View>
                    )}
                </View>
            )
        } else if (producto.tipo === 'Polvo') {
            return (
                <View style={styles.table}>
                    <View style={styles.tableRow}>
                        <View style={[styles.tableColGray, { width: '20%' }]}>
                            <Text style={[styles.tableCellGray2, { fontWeight: 400, textAlign: 'center', marginRight: 10 }]}>Materia prima</Text>
                        </View>
                        <View style={[styles.tableColGray, { width: '6%' }]}>
                            <Text style={[styles.tableCellGray2, { fontWeight: 400, textAlign: 'center', marginRight: 10 }]}>%</Text>
                        </View>
                        <View style={[styles.tableColGray, { width: '12%' }]}>
                            <Text style={[styles.tableCellGray2, { fontWeight: 400, textAlign: 'center', marginRight: 10 }]}>GR Scoop</Text>
                        </View>
                        <View style={[styles.tableColGray, { width: '12%' }]}>
                            <Text style={[styles.tableCellGray2, { fontWeight: 400, textAlign: 'center', marginRight: 10 }]}>GR Tarro</Text>
                        </View>
                        <View style={[styles.tableColGray, { width: '12%' }]}>
                            <Text style={[styles.tableCellGray2, { fontWeight: 400, textAlign: 'center', marginRight: 10 }]}>Cantidad GR</Text>
                        </View>
                        <View style={[styles.tableColGray, { width: '12%' }]}>
                            <Text style={[styles.tableCellGray2, { fontWeight: 400, textAlign: 'center', marginRight: 10 }]}>Cantidad KR</Text>
                        </View>
                        <View style={[styles.tableColGray, { width: '13%' }]}>
                            <Text style={[styles.tableCellGray2, { fontWeight: 400, textAlign: 'center', marginRight: 10 }]}>Precio KG</Text>
                        </View>
                        <View style={[styles.tableColGray, { width: '13%' }]}>
                            <Text style={[styles.tableCellGray2, { fontWeight: 400, textAlign: 'center', marginRight: 10 }]}>Total</Text>
                        </View>
                    </View>
                    {getElementosFormula().map((item, index) =>
                        <View style={styles.tableRow} key={index}>
                            <View style={[styles.tableCol, { width: '20%' }]}>
                                <Text style={[styles.tableCell, { fontWeight: 200, textAlign: 'center', marginRight: 10 }]}>{item.materia_prima.nombre}</Text>
                            </View>
                            <View style={[styles.tableCol, { width: '6%' }]}>
                                <Text style={[styles.tableCell, { fontWeight: 200, textAlign: 'center', marginRight: 10 }]}>{item.porcentaje + ' %'}</Text>
                            </View>
                            <View style={[styles.tableCol, { width: '12%' }]}>
                                <Text style={[styles.tableCell, { fontWeight: 200, textAlign: 'center', marginRight: 10 }]}>{getGramosScoop(item.porcentaje, objeto.dosis)}</Text>
                            </View>
                            <View style={[styles.tableCol, { width: '12%' }]}>
                                <Text style={[styles.tableCell, { fontWeight: 200, textAlign: 'center', marginRight: 10 }]}>{getGramosTarro(item.porcentaje, objeto.dosis, objeto.serving)}</Text>
                            </View>
                            <View style={[styles.tableCol, { width: '12%' }]}>
                                <Text style={[styles.tableCell, { fontWeight: 200, textAlign: 'center', marginRight: 10 }]}>{getGramosEnvasePolvo(item.porcentaje, objeto.dosis, objeto.serving, objeto.cant_env)}</Text>
                            </View>
                            <View style={[styles.tableCol, { width: '12%' }]}>
                                <Text style={[styles.tableCell, { fontWeight: 200, textAlign: 'center', marginRight: 10 }]}>{getKilosTotal(item.porcentaje, objeto.dosis, objeto.serving, objeto.cant_env)}</Text>
                            </View>
                            <View style={[styles.tableCol, { width: '13%' }]}>
                                <Text style={[styles.tableCell, { fontWeight: 200, textAlign: 'center', marginRight: 10 }]}>{'$ ' + item.precio_kilo}</Text>
                            </View>
                            <View style={[styles.tableCol, { width: '13%' }]}>
                                <Text style={[styles.tableCell, { fontWeight: 200, textAlign: 'center', marginRight: 10 }]}>{'$ ' + getTotalFilaPolvo(item.porcentaje, objeto.dosis, objeto.serving, objeto.cant_env, item.precio_kilo)}</Text>
                            </View>
                        </View>
                    )}
                </View>
            )
        } else if (producto.tipo === 'Sticks') {
            return (
                <View style={styles.table}>
                    <View style={styles.tableRow}>
                        <View style={[styles.tableColGray, { width: '20%' }]}>
                            <Text style={[styles.tableCellGray2, { fontWeight: 400, textAlign: 'center', marginRight: 10 }]}>Materia prima</Text>
                        </View>
                        <View style={[styles.tableColGray, { width: '6%' }]}>
                            <Text style={[styles.tableCellGray2, { fontWeight: 400, textAlign: 'center', marginRight: 10 }]}>%</Text>
                        </View>
                        <View style={[styles.tableColGray, { width: '14%' }]}>
                            <Text style={[styles.tableCellGray2, { fontWeight: 400, textAlign: 'center', marginRight: 10 }]}>GR Scoop</Text>
                        </View>
                        <View style={[styles.tableColGray, { width: '14%' }]}>
                            <Text style={[styles.tableCellGray2, { fontWeight: 400, textAlign: 'center', marginRight: 10 }]}>Cantidad GR</Text>
                        </View>
                        <View style={[styles.tableColGray, { width: '14%' }]}>
                            <Text style={[styles.tableCellGray2, { fontWeight: 400, textAlign: 'center', marginRight: 10 }]}>Cantidad KR</Text>
                        </View>
                        <View style={[styles.tableColGray, { width: '16%' }]}>
                            <Text style={[styles.tableCellGray2, { fontWeight: 400, textAlign: 'center', marginRight: 10 }]}>Precio KG</Text>
                        </View>
                        <View style={[styles.tableColGray, { width: '16%' }]}>
                            <Text style={[styles.tableCellGray2, { fontWeight: 400, textAlign: 'center', marginRight: 10 }]}>Total</Text>
                        </View>
                    </View>
                    {getElementosFormula().map((item, index) =>
                        <View style={styles.tableRow} key={index}>
                            <View style={[styles.tableCol, { width: '20%' }]}>
                                <Text style={[styles.tableCell, { fontWeight: 200, textAlign: 'center', marginRight: 10 }]}>{item.materia_prima.nombre}</Text>
                            </View>
                            <View style={[styles.tableCol, { width: '6%' }]}>
                                <Text style={[styles.tableCell, { fontWeight: 200, textAlign: 'center', marginRight: 10 }]}>{item.porcentaje + ' %'}</Text>
                            </View>
                            <View style={[styles.tableCol, { width: '14%' }]}>
                                <Text style={[styles.tableCell, { fontWeight: 200, textAlign: 'center', marginRight: 10 }]}>{getGramosScoopStick(item.porcentaje, objeto.peso)}</Text>
                            </View>
                            <View style={[styles.tableCol, { width: '14%' }]}>
                                <Text style={[styles.tableCell, { fontWeight: 200, textAlign: 'center', marginRight: 10 }]}>{getGramosEnvaseStick(item.porcentaje, objeto.peso, objeto.cant_env)}</Text>
                            </View>
                            <View style={[styles.tableCol, { width: '14%' }]}>
                                <Text style={[styles.tableCell, { fontWeight: 200, textAlign: 'center', marginRight: 10 }]}>{getKilosTotalStick(item.porcentaje, objeto.peso, objeto.cant_env)}</Text>
                            </View>
                            <View style={[styles.tableCol, { width: '16%' }]}>
                                <Text style={[styles.tableCell, { fontWeight: 200, textAlign: 'center', marginRight: 10 }]}>{'$ ' + item.precio_kilo}</Text>
                            </View>
                            <View style={[styles.tableCol, { width: '16%' }]}>
                                <Text style={[styles.tableCell, { fontWeight: 200, textAlign: 'center', marginRight: 10 }]}>{'$ ' + getTotalFilaStick(item.porcentaje, objeto.peso, objeto.cant_env, item.precio_kilo)}</Text>
                            </View>
                        </View>
                    )}
                </View>
            )
        }
        return (<View></View>)
    }

    const getTotalElementos = () => {
        var total = 0
        if (producto.tipo === 'Cápsula dura') {
            datos.map(item => {
                total += parseFloat(getTotalFila(item.porcentaje, objeto.peso, objeto.cant_cap, objeto.cant_env, item.precio_kilo))
            })
            total += parseFloat((objeto.cant_env * objeto.cant_cap) * objeto.cost_cap)
            total += parseFloat(objeto.cost_env * objeto.cant_env)
            total += parseFloat(objeto.cost_eti * objeto.cant_eti)
        } else if (producto.tipo === 'Cápsula blanda') {
            datos.map(item => {
                total += parseFloat(getTotalFila(item.porcentaje, objeto.peso, objeto.cant_cap, objeto.cant_env, item.precio_kilo))
            })
            total += parseFloat(parseFloat(getTotalCapsula()))
            total += parseFloat(objeto.cost_env * objeto.cant_env)
            total += parseFloat(objeto.cost_eti * objeto.cant_eti)
        } else if (producto.tipo === 'Polvo') {
            datos.map(item => {
                total += parseFloat(getTotalFilaPolvo(item.porcentaje, objeto.dosis, objeto.serving, objeto.cant_env, item.precio_kilo))
            })
            total += parseFloat(objeto.cost_env * objeto.cant_env)
            total += parseFloat(objeto.cost_eti * objeto.cant_eti)
        } else if (producto.tipo === 'Sticks') {
            datos.map(item => {
                total += parseFloat(getTotalFilaStick(item.porcentaje, objeto.peso, objeto.cant_env, item.precio_kilo))
            })
            total += parseFloat(objeto.cost_eti * objeto.cant_eti)
        }
        return parseFloat(total).toFixed(4)
    }

    const getCostoEnvase = () => {
        return parseFloat(getTotalElementos() / objeto.cant_env).toFixed(4)
    }

    const getPorcentajeGanancia = () => {
        var v = objeto.venta, uti = 0;
        v -= (getTotalElementos() / objeto.cant_env);
        uti = (v * 100) / (getTotalElementos() / objeto.cant_env);
        return uti.toFixed(4)
    }

    const getPrecioFinal = () => {
        return parseFloat((getCostoEnvase() * getPorcentajeGanancia()) / 100).toFixed(4)
    }

    const generarParametros = () => {
        if (producto.tipo === 'Cápsula dura') {
            return (
                <View style={styles.table}>
                    <View style={styles.tableRow}>
                        <View style={[styles.tableColGray, { width: '30%' }]}>
                            <Text style={[styles.tableCellGray, { fontWeight: 200, textAlign: 'right', marginRight: 10 }]}>Cápsulas por envase:</Text>
                        </View>
                        <View style={[styles.tableCol, { width: '20%' }]}>
                            <Text style={[styles.tableCell, { fontWeight: 100, marginLeft: 10 }]}>{(objeto ? objeto.cant_cap : '')}</Text>
                        </View>
                        <View style={[styles.tableColGray, { width: '35%' }]}>
                            <Text style={[styles.tableCellGray, { fontWeight: 200, textAlign: 'right', marginRight: 10 }]}>Costo por cápsula vacía:</Text>
                        </View>
                        <View style={[styles.tableCol, { width: '15%' }]}>
                            <Text style={[styles.tableCell, { fontWeight: 100, marginLeft: 10 }]}>{(objeto ? '$ ' + objeto.cost_cap : '')}</Text>
                        </View>
                    </View>
                    <View style={styles.tableRow}>
                        <View style={[styles.tableColGray, { width: '30%' }]}>
                            <Text style={[styles.tableCellGray, { fontWeight: 200, textAlign: 'right', marginRight: 10 }]}>Total de envases:</Text>
                        </View>
                        <View style={[styles.tableCol, { width: '20%' }]}>
                            <Text style={[styles.tableCell, { fontWeight: 100, marginLeft: 10 }]}>{(objeto ? objeto.cant_env : '')}</Text>
                        </View>
                        <View style={[styles.tableColGray, { width: '35%' }]}>
                            <Text style={[styles.tableCellGray, { fontWeight: 200, textAlign: 'right', marginRight: 10 }]}>Costo por envase:</Text>
                        </View>
                        <View style={[styles.tableCol, { width: '15%' }]}>
                            <Text style={[styles.tableCell, { fontWeight: 100, marginLeft: 10 }]}>{(objeto ? '$ ' + objeto.cost_env : '')}</Text>
                        </View>
                    </View>
                    <View style={styles.tableRow}>
                        <View style={[styles.tableColGray, { width: '30%' }]}>
                            <Text style={[styles.tableCellGray, { fontWeight: 200, textAlign: 'right', marginRight: 10 }]}>Total de etiquetas:</Text>
                        </View>
                        <View style={[styles.tableCol, { width: '20%' }]}>
                            <Text style={[styles.tableCell, { fontWeight: 100, marginLeft: 10 }]}>{(objeto ? objeto.cant_eti : '')}</Text>
                        </View>
                        <View style={[styles.tableColGray, { width: '35%' }]}>
                            <Text style={[styles.tableCellGray, { fontWeight: 200, textAlign: 'right', marginRight: 10 }]}>Costo por etiqueta:</Text>
                        </View>
                        <View style={[styles.tableCol, { width: '15%' }]}>
                            <Text style={[styles.tableCell, { fontWeight: 100, marginLeft: 10 }]}>{(objeto ? '$ ' + objeto.cost_eti : '')}</Text>
                        </View>
                    </View>
                    <View style={styles.tableRow}>
                        <View style={[styles.tableColGray, { width: '30%' }]}>
                            <Text style={[styles.tableCellGray, { fontWeight: 200, textAlign: 'right', marginRight: 10 }]}>Cápsulas a producir:</Text>
                        </View>
                        <View style={[styles.tableCol, { width: '20%' }]}>
                            <Text style={[styles.tableCell, { fontWeight: 100, marginLeft: 10 }]}>{(objeto ? objeto.cant_env * objeto.cant_cap : '')}</Text>
                        </View>
                        <View style={[styles.tableColGray, { width: '35%' }]}>
                            <Text style={[styles.tableCellGray, { fontWeight: 200, textAlign: 'right', marginRight: 10 }]}>Peso de la cápsula:</Text>
                        </View>
                        <View style={[styles.tableCol, { width: '15%' }]}>
                            <Text style={[styles.tableCell, { fontWeight: 100, marginLeft: 10 }]}>{(objeto ? objeto.peso + ' mg' : '')}</Text>
                        </View>
                    </View>
                </View>
            )
        } else if (producto.tipo === 'Cápsula blanda') {
            return (
                <View style={styles.table}>
                    <View style={styles.tableRow}>
                        <View style={[styles.tableColGray, { width: '30%' }]}>
                            <Text style={[styles.tableCellGray, { fontWeight: 200, textAlign: 'right', marginRight: 10 }]}>Cápsulas por envase:</Text>
                        </View>
                        <View style={[styles.tableCol, { width: '70%' }]}>
                            <Text style={[styles.tableCell, { fontWeight: 100, marginLeft: 10 }]}>{(objeto ? objeto.cant_cap : '')}</Text>
                        </View>
                    </View>
                    <View style={styles.tableRow}>
                        <View style={[styles.tableColGray, { width: '30%' }]}>
                            <Text style={[styles.tableCellGray, { fontWeight: 200, textAlign: 'right', marginRight: 10 }]}>Total de envases:</Text>
                        </View>
                        <View style={[styles.tableCol, { width: '20%' }]}>
                            <Text style={[styles.tableCell, { fontWeight: 100, marginLeft: 10 }]}>{(objeto ? objeto.cant_env : '')}</Text>
                        </View>
                        <View style={[styles.tableColGray, { width: '35%' }]}>
                            <Text style={[styles.tableCellGray, { fontWeight: 200, textAlign: 'right', marginRight: 10 }]}>Costo por envase:</Text>
                        </View>
                        <View style={[styles.tableCol, { width: '15%' }]}>
                            <Text style={[styles.tableCell, { fontWeight: 100, marginLeft: 10 }]}>{(objeto ? '$ ' + objeto.cost_env : '')}</Text>
                        </View>
                    </View>
                    <View style={styles.tableRow}>
                        <View style={[styles.tableColGray, { width: '30%' }]}>
                            <Text style={[styles.tableCellGray, { fontWeight: 200, textAlign: 'right', marginRight: 10 }]}>Total de etiquetas:</Text>
                        </View>
                        <View style={[styles.tableCol, { width: '20%' }]}>
                            <Text style={[styles.tableCell, { fontWeight: 100, marginLeft: 10 }]}>{(objeto ? objeto.cant_eti : '')}</Text>
                        </View>
                        <View style={[styles.tableColGray, { width: '35%' }]}>
                            <Text style={[styles.tableCellGray, { fontWeight: 200, textAlign: 'right', marginRight: 10 }]}>Costo por etiqueta:</Text>
                        </View>
                        <View style={[styles.tableCol, { width: '15%' }]}>
                            <Text style={[styles.tableCell, { fontWeight: 100, marginLeft: 10 }]}>{(objeto ? '$ ' + objeto.cost_eti : '')}</Text>
                        </View>
                    </View>
                    <View style={styles.tableRow}>
                        <View style={[styles.tableColGray, { width: '30%' }]}>
                            <Text style={[styles.tableCellGray, { fontWeight: 200, textAlign: 'right', marginRight: 10 }]}>Cápsulas a producir:</Text>
                        </View>
                        <View style={[styles.tableCol, { width: '20%' }]}>
                            <Text style={[styles.tableCell, { fontWeight: 100, marginLeft: 10 }]}>{(objeto ? objeto.cant_env * objeto.cant_cap : '')}</Text>
                        </View>
                        <View style={[styles.tableColGray, { width: '35%' }]}>
                            <Text style={[styles.tableCellGray, { fontWeight: 200, textAlign: 'right', marginRight: 10 }]}>Peso de la cápsula:</Text>
                        </View>
                        <View style={[styles.tableCol, { width: '15%' }]}>
                            <Text style={[styles.tableCell, { fontWeight: 100, marginLeft: 10 }]}>{(objeto ? objeto.peso + ' mg' : '')}</Text>
                        </View>
                    </View>
                </View>
            )
        } else if (producto.tipo === 'Polvo') {
            return (
                <View style={styles.table}>
                    <View style={styles.tableRow}>
                        <View style={[styles.tableColGray, { width: '30%' }]}>
                            <Text style={[styles.tableCellGray, { fontWeight: 200, textAlign: 'right', marginRight: 10 }]}>Gramos por Scoop:</Text>
                        </View>
                        <View style={[styles.tableCol, { width: '20%' }]}>
                            <Text style={[styles.tableCell, { fontWeight: 100, marginLeft: 10 }]}>{(objeto ? objeto.dosis : '')}</Text>
                        </View>
                        <View style={[styles.tableColGray, { width: '35%' }]}>
                            <Text style={[styles.tableCellGray, { fontWeight: 200, textAlign: 'right', marginRight: 10 }]}>Serving:</Text>
                        </View>
                        <View style={[styles.tableCol, { width: '15%' }]}>
                            <Text style={[styles.tableCell, { fontWeight: 100, marginLeft: 10 }]}>{(objeto ? '$ ' + objeto.serving : '')}</Text>
                        </View>
                    </View>
                    <View style={styles.tableRow}>
                        <View style={[styles.tableColGray, { width: '30%' }]}>
                            <Text style={[styles.tableCellGray, { fontWeight: 200, textAlign: 'right', marginRight: 10 }]}>Total de envases:</Text>
                        </View>
                        <View style={[styles.tableCol, { width: '20%' }]}>
                            <Text style={[styles.tableCell, { fontWeight: 100, marginLeft: 10 }]}>{(objeto ? objeto.cant_env : '')}</Text>
                        </View>
                        <View style={[styles.tableColGray, { width: '35%' }]}>
                            <Text style={[styles.tableCellGray, { fontWeight: 200, textAlign: 'right', marginRight: 10 }]}>Costo por envase:</Text>
                        </View>
                        <View style={[styles.tableCol, { width: '15%' }]}>
                            <Text style={[styles.tableCell, { fontWeight: 100, marginLeft: 10 }]}>{(objeto ? '$ ' + objeto.cost_env : '')}</Text>
                        </View>
                    </View>
                    <View style={styles.tableRow}>
                        <View style={[styles.tableColGray, { width: '30%' }]}>
                            <Text style={[styles.tableCellGray, { fontWeight: 200, textAlign: 'right', marginRight: 10 }]}>Total de etiquetas:</Text>
                        </View>
                        <View style={[styles.tableCol, { width: '20%' }]}>
                            <Text style={[styles.tableCell, { fontWeight: 100, marginLeft: 10 }]}>{(objeto ? objeto.cant_eti : '')}</Text>
                        </View>
                        <View style={[styles.tableColGray, { width: '35%' }]}>
                            <Text style={[styles.tableCellGray, { fontWeight: 200, textAlign: 'right', marginRight: 10 }]}>Costo por etiqueta:</Text>
                        </View>
                        <View style={[styles.tableCol, { width: '15%' }]}>
                            <Text style={[styles.tableCell, { fontWeight: 100, marginLeft: 10 }]}>{(objeto ? '$ ' + objeto.cost_eti : '')}</Text>
                        </View>
                    </View>
                    <View style={styles.tableRow}>
                        <View style={[styles.tableColGray, { width: '30%' }]}>
                            <Text style={[styles.tableCellGray, { fontWeight: 200, textAlign: 'right', marginRight: 10 }]}>Cantidad de polvo:</Text>
                        </View>
                        <View style={[styles.tableCol, { width: '70%' }]}>
                            <Text style={[styles.tableCell, { fontWeight: 100, marginLeft: 10 }]}>{(objeto ? objeto.peso : '')}</Text>
                        </View>
                    </View>
                </View>
            )
        } else if (producto.tipo === 'Sticks') {
            return (
                <View style={styles.table}>
                    <View style={styles.tableRow}>
                        <View style={[styles.tableColGray, { width: '30%' }]}>
                            <Text style={[styles.tableCellGray, { fontWeight: 200, textAlign: 'right', marginRight: 10 }]}>Total de envases:</Text>
                        </View>
                        <View style={[styles.tableCol, { width: '20%' }]}>
                            <Text style={[styles.tableCell, { fontWeight: 100, marginLeft: 10 }]}>{(objeto ? objeto.cant_env : '')}</Text>
                        </View>
                        <View style={[styles.tableColGray, { width: '35%' }]}>
                            <Text style={[styles.tableCellGray, { fontWeight: 200, textAlign: 'right', marginRight: 10 }]}>Costo por empaque:</Text>
                        </View>
                        <View style={[styles.tableCol, { width: '15%' }]}>
                            <Text style={[styles.tableCell, { fontWeight: 100, marginLeft: 10 }]}>{(objeto ? '$ ' + objeto.cost_eti : '')}</Text>
                        </View>
                    </View>
                    <View style={styles.tableRow}>
                        <View style={[styles.tableColGray, { width: '30%' }]}>
                            <Text style={[styles.tableCellGray, { fontWeight: 200, textAlign: 'right', marginRight: 10 }]}>Total de empaques:</Text>
                        </View>
                        <View style={[styles.tableCol, { width: '20%' }]}>
                            <Text style={[styles.tableCell, { fontWeight: 100, marginLeft: 10 }]}>{(objeto ? objeto.cant_eti : '')}</Text>
                        </View>
                        <View style={[styles.tableColGray, { width: '35%' }]}>
                            <Text style={[styles.tableCellGray, { fontWeight: 200, textAlign: 'right', marginRight: 10 }]}>Cantidad del producto:</Text>
                        </View>
                        <View style={[styles.tableCol, { width: '15%' }]}>
                            <Text style={[styles.tableCell, { fontWeight: 100, marginLeft: 10 }]}>{(objeto ? objeto.peso : '')}</Text>
                        </View>
                    </View>
                </View>
            )
        }
        return ''
    }

    return (
        <Document>
            <Page style={styles.body} orientation="landscape">

                <Image style={styles.image} src={logo} />
                <Text style={[styles.title, { fontWeight: 400, fontSize: 12, color: '#777777' }]}>INFORME DE COTIZACIÓN</Text>
                <Text style={[styles.title, { fontSize: 12, color: '#777777' }]}>{fecha} </Text>
                <Text style={[styles.subtitle, { fontWeight: 400, marginTop: 30 }]}>DATOS GENERALES</Text>
                <View style={styles.table}>
                    <View style={styles.tableRow}>
                        <View style={styles.tableColGray}>
                            <Text style={[styles.tableCellGray, { fontWeight: 200, textAlign: 'right', marginRight: 10 }]}>Fórmula:</Text>
                        </View>
                        <View style={styles.tableCol}>
                            <Text style={[styles.tableCell, { fontWeight: 100, marginLeft: 10 }]}>{(formula ? formula.nombre : '')}</Text>
                        </View>
                    </View>
                    <View style={styles.tableRow}>
                        <View style={styles.tableColGray}>
                            <Text style={[styles.tableCellGray, { fontWeight: 200, textAlign: 'right', marginRight: 10 }]}>Presentación:</Text>
                        </View>
                        <View style={styles.tableCol}>
                            <Text style={[styles.tableCell, { fontWeight: 100, marginLeft: 10 }]}>{producto ? producto.tipo : ''}</Text>
                        </View>
                    </View>
                    <View style={styles.tableRow}>
                        <View style={styles.tableColGray}>
                            <Text style={[styles.tableCellGray, { fontWeight: 200, textAlign: 'right', marginRight: 10 }]}>Cliente:</Text>
                        </View>
                        <View style={styles.tableCol}>
                            <Text style={[styles.tableCell, { fontWeight: 100, marginLeft: 10 }]}>{cliente ? cliente.nombre : ''}</Text>
                        </View>
                    </View>
                </View>
                <Text style={[styles.subtitle, { fontWeight: 400, marginTop: 30 }]}>PARÁMETROS DE LA COTIZACIÓN</Text>
                {generarParametros()}
                {
                    producto.tipo === 'Cápsula blanda' ?
                        <View style={{ marginTop: 10 }}>
                            <View>
                                <View style={{ width: '100%' }}>
                                    <Text style={[styles.subtitle, { fontWeight: 400, textAlign: 'center', marginRight: 10 }]}>COSTO DE LA CÁPSULA</Text>
                                </View>
                            </View>
                            <View style={styles.table}>
                                <View style={styles.tableRow}>
                                    <View style={[styles.tableColGray, { width: '40%' }]}>
                                        <Text style={[styles.tableCellGray, { fontWeight: 200, textAlign: 'center', marginRight: 10 }]}>Materia prima</Text>
                                    </View>
                                    <View style={[styles.tableColGray, { width: '20%' }]}>
                                        <Text style={[styles.tableCellGray, { fontWeight: 200, textAlign: 'center', marginRight: 10 }]}>Cantidad KG</Text>
                                    </View>
                                    <View style={[styles.tableColGray, { width: '20%' }]}>
                                        <Text style={[styles.tableCellGray, { fontWeight: 200, textAlign: 'center', marginRight: 10 }]}>Precio KG</Text>
                                    </View>
                                    <View style={[styles.tableColGray, { width: '20%' }]}>
                                        <Text style={[styles.tableCellGray, { fontWeight: 200, textAlign: 'center', marginRight: 10 }]}>Total</Text>
                                    </View>
                                </View>
                                {getDatosFormulaBase().map((item, index) =>
                                    <View key={index} style={styles.tableRow}>
                                        <View style={[styles.tableCol, { width: '40%', borderLeftWidth: 1 }]}>
                                            <Text style={[styles.tableCell, { fontWeight: 200, textAlign: 'center', marginRight: 10 }]}>{item.materia_prima.nombre}</Text>
                                        </View>
                                        <View style={[styles.tableCol, { width: '20%' }]}>
                                            <Text style={[styles.tableCell, { fontWeight: 200, textAlign: 'center', marginRight: 10 }]}>{item.cantidad_kilo}</Text>
                                        </View>
                                        <View style={[styles.tableCol, { width: '20%' }]}>
                                            <Text style={[styles.tableCell, { fontWeight: 200, textAlign: 'center', marginRight: 10 }]}>{'$ ' + item.precio_kilo}</Text>
                                        </View>
                                        <View style={[styles.tableCol, { width: '20%' }]}>
                                            <Text style={[styles.tableCell, { fontWeight: 200, textAlign: 'center', marginRight: 10 }]}>{'$ ' + (item.cantidad_kilo * item.precio_kilo)}</Text>
                                        </View>
                                    </View>
                                )}
                            </View>
                            <View style={[styles.tableRow, { borderWidth: 0 }]}>
                                <View style={{ width: '80%', borderWidth: 0 }}>
                                    <Text style={[styles.tableCellGray, { fontWeight: 400, textAlign: 'right', marginRight: 10 }]}>Precio de la cápsula:</Text>
                                </View>
                                <View style={{ width: '20%', borderWidth: 0 }}>
                                    <Text style={[styles.tableCell, { fontWeight: 200, textAlign: 'center', marginRight: 10 }]}>{'$ ' + getTotalCapsula()}</Text>
                                </View>
                            </View>
                        </View>
                        : <View></View>
                }
                <Text style={[styles.subtitle, { fontWeight: 400, marginTop: 30 }]}>ELEMENTOS DE LA FÓRMULA</Text>
                {generarElementosFormula()}
                <View style={[styles.tableRow, { borderWidth: 0 }]}>
                    <View style={{ width: '80%', borderWidth: 0 }}>
                        <Text style={[styles.tableCellGray, { fontWeight: 400, textAlign: 'right', marginRight: 10 }]}>Total:</Text>
                    </View>
                    <View style={{ width: '20%', borderWidth: 0 }}>
                        <Text style={[styles.tableCell, { fontWeight: 200, textAlign: 'center', marginRight: 10 }]}>{'$ ' + getTotalElementos()}</Text>
                    </View>
                </View>
                <Text style={[styles.subtitle, { fontWeight: 400, marginTop: 30 }]}>OTROS DETALLES</Text>
                <View style={styles.table}>
                    <View style={styles.tableRow}>
                        <View style={[styles.tableColGray, { width: '40%' }]}>
                            <Text style={[styles.tableCellGray, { fontWeight: 200, textAlign: 'right', marginRight: 10 }]}>Costo de Fabricación por envase:</Text>
                        </View>
                        <View style={[styles.tableCol, { width: '60%' }]}>
                            <Text style={[styles.tableCell, { fontWeight: 100, marginLeft: 10 }]}>{'$ ' + getCostoEnvase()}</Text>
                        </View>
                    </View>
                    <View style={styles.tableRow}>
                        <View style={[styles.tableColGray, { width: '40%' }]}>
                            <Text style={[styles.tableCellGray, { fontWeight: 200, textAlign: 'right', marginRight: 10 }]}>Porcentaje de ganancia por envase:</Text>
                        </View>
                        <View style={[styles.tableCol, { width: '60%' }]}>
                            <Text style={[styles.tableCell, { fontWeight: 100, marginLeft: 10 }]}>{getPorcentajeGanancia()}</Text>
                        </View>
                    </View>
                    <View style={styles.tableRow}>
                        <View style={[styles.tableColGray, { width: '40%' }]}>
                            <Text style={[styles.tableCellGray, { fontWeight: 200, textAlign: 'right', marginRight: 10 }]}>Precio final:</Text>
                        </View>
                        <View style={[styles.tableCol, { width: '60%' }]}>
                            <Text style={[styles.tableCell, { fontWeight: 100, marginLeft: 10 }]}>{'$ ' + getPrecioFinal()}</Text>
                        </View>
                    </View>
                    <View style={styles.tableRow}>
                        <View style={[styles.tableColGray, { width: '40%' }]}>
                            <Text style={[styles.tableCellGray, { fontWeight: 200, textAlign: 'right', marginRight: 10 }]}>Ganancia:</Text>
                        </View>
                        <View style={[styles.tableCol, { width: '60%' }]}>
                            <Text style={[styles.tableCell, { fontWeight: 100, marginLeft: 10 }]}>{'$ ' + (getPrecioFinal() - getCostoEnvase()).toFixed(4)}</Text>
                        </View>
                    </View>
                </View>
                <Text style={styles.pageNumber} render={({ pageNumber, totalPages }) => (
                    `${pageNumber} / ${totalPages}`
                )} fixed />
            </Page>
        </Document>
    )
}

Font.register(
    {
        family: "Roboto", fonts: [
            { src: srcRoboto1, fontWeight: 100 },
            { src: srcRoboto3, fontWeight: 300 },
            { src: srcRoboto2, fontWeight: 200 },
            { src: srcRoboto4, fontWeight: 400 },
        ]
    }
)

const styles = StyleSheet.create({
    table: {
        display: "table",
        width: "auto",
        borderStyle: "solid",
        borderWidth: 1,
        borderRightWidth: 0,
        borderBottomWidth: 0
    },
    tableRow: {
        margin: "auto",
        flexDirection: "row"
    },
    tableRowGray: {
        margin: "auto",
        flexDirection: "row",
        backgroundColor: 'gray',
    },
    tableCol: {
        width: "70%",
        borderStyle: "solid",
        borderWidth: 1,
        borderLeftWidth: 0,
        borderTopWidth: 0
    },
    tableColGray: {
        width: "30%",
        borderStyle: "solid",
        borderWidth: 1,
        borderLeftWidth: 0,
        borderTopWidth: 0,
        backgroundColor: '#efefef'
    },
    tableCell: {
        marginTop: 5,
        fontSize: 12,
        fontFamily: 'Roboto'
    },
    tableCellGray: {
        marginTop: 5,
        fontSize: 14,
        fontFamily: 'Roboto'
    },
    tableCellGray2: {
        marginTop: 5,
        fontSize: 12,
        fontFamily: 'Roboto'
    },
    body: {
        paddingTop: 35,
        paddingBottom: 65,
        paddingHorizontal: 35,
    },
    title: {
        fontSize: 18,
        textAlign: 'center',
        fontFamily: 'Roboto'
    },
    author: {
        fontSize: 12,
        textAlign: 'center',
        marginBottom: 40,
        fontFamily: 'Roboto'
    },
    subtitle: {
        fontSize: 14,
        margin: 12,
        textAlign: "center",
        fontFamily: 'Roboto',
        marginTop: 20
    },
    text: {
        margin: 12,
        fontSize: 14,
        textAlign: 'justify',
        fontFamily: 'Roboto'

    },
    image: {
        position: 'absolute',
        left: 0,
        margin: 30,
        width: 100

    },
    header: {
        fontSize: 12,
        marginBottom: 20,
        textAlign: 'center',
        color: 'grey',
    },
    pageNumber: {
        position: 'absolute',
        fontSize: 12,
        bottom: 30,
        left: 0,
        right: 0,
        textAlign: 'center',
        color: 'grey',
        fontFamily: 'Roboto'

    },

});

export default CotizacionPDF
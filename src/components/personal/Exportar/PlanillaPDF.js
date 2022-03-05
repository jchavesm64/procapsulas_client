import React from "react";
import { Page, Text, View, Document, StyleSheet, Image, Font } from '@react-pdf/renderer';
import srcRoboto1 from "../../Cotizaciones/pdf/assets/Roboto-Light.ttf";
import srcRoboto2 from "../../Cotizaciones/pdf/assets/Roboto-Regular.ttf";
import srcRoboto3 from "../../Cotizaciones/pdf/assets/Roboto-Bold.ttf";
import srcRoboto4 from "../../Cotizaciones/pdf/assets/Roboto-Black.ttf";
import logo from "../../Cotizaciones/pdf/assets/logo.png";

const PlanillaPDF = ({ ...props }) => {
    const { info, fecha1, fecha2, total } = props

    return (
        <Document>
            <Page style={styles.body} orientation="landscape">
                <Image style={styles.image} src={logo} />
                <Text style={[styles.title, { fontWeight: 400, fontSize: 12, color: '#777777' }]}>{'PLANILLA DEL ' + fecha1 + ' AL ' + fecha2}</Text>
                {
                    info.p.length > 0 &&
                    <View style={{ marginTop: 10 }}>
                        <View>
                            <View style={{ width: '100%' }}>
                                <Text style={[styles.subtitle, { fontWeight: 400, textAlign: 'center', marginRight: 10 }]}>PLANILLA OPERATIVA</Text>
                            </View>
                        </View>
                        <View style={styles.table}>
                            <View style={styles.tableRow}>
                                <View style={[styles.tableColGray, { width: '30%' }]}>
                                    <Text style={[styles.tableCellGray, { fontWeight: 200, textAlign: 'center', marginRight: 10 }]}>Nombre</Text>
                                </View>
                                <View style={[styles.tableColGray, { width: '15%' }]}>
                                    <Text style={[styles.tableCellGray, { fontWeight: 200, textAlign: 'center', marginRight: 10 }]}>Cédula</Text>
                                </View>
                                <View style={[styles.tableColGray, { width: '20%' }]}>
                                    <Text style={[styles.tableCellGray, { fontWeight: 200, textAlign: 'center', marginRight: 10 }]}>Horas Laboradas</Text>
                                </View>
                                <View style={[styles.tableColGray, { width: '15%' }]}>
                                    <Text style={[styles.tableCellGray, { fontWeight: 200, textAlign: 'center', marginRight: 10 }]}>Precio Hora</Text>
                                </View>
                                <View style={[styles.tableColGray, { width: '20%' }]}>
                                    <Text style={[styles.tableCellGray, { fontWeight: 200, textAlign: 'center', marginRight: 10 }]}>Total</Text>
                                </View>
                            </View>
                            {
                                info.p.map((item, index) =>
                                    <View key={index} style={styles.tableRow}>
                                        <View style={[styles.tableCol, { width: '30%', borderLeftWidth: 1 }]}>
                                            <Text style={[styles.tableCell, { fontWeight: 200, textAlign: 'center', marginRight: 10 }]}>{item.empleado.nombre}</Text>
                                        </View>
                                        <View style={[styles.tableCol, { width: '15%' }]}>
                                            <Text style={[styles.tableCell, { fontWeight: 200, textAlign: 'center', marginRight: 10 }]}>{item.empleado.cedula}</Text>
                                        </View>
                                        <View style={[styles.tableCol, { width: '20%' }]}>
                                            <Text style={[styles.tableCell, { fontWeight: 200, textAlign: 'center', marginRight: 10 }]}>{item.horas}</Text>
                                        </View>
                                        <View style={[styles.tableCol, { width: '15%' }]}>
                                            <Text style={[styles.tableCell, { fontWeight: 200, textAlign: 'center', marginRight: 10 }]}>{item.empleado.puesto.salario}</Text>
                                        </View>
                                        <View style={[styles.tableCol, { width: '20%' }]}>
                                            <Text style={[styles.tableCell, { fontWeight: 200, textAlign: 'center', marginRight: 10 }]}>{item.horas * item.empleado.puesto.salario}</Text>
                                        </View>
                                    </View>
                                )
                            }
                        </View>
                    </View>
                }
                {
                    info.c.length > 0 &&
                    <View style={{ marginTop: 10 }}>
                        <View>
                            <View style={{ width: '100%' }}>
                                <Text style={[styles.subtitle, { fontWeight: 400, textAlign: 'center', marginRight: 10 }]}>PRODUCCION DE CAPSULAS</Text>
                            </View>
                        </View>
                        <View style={styles.table}>
                            <View style={styles.tableRow}>
                                <View style={[styles.tableColGray, { width: '30%' }]}>
                                    <Text style={[styles.tableCellGray, { fontWeight: 200, textAlign: 'center', marginRight: 10 }]}>Nombre</Text>
                                </View>
                                <View style={[styles.tableColGray, { width: '15%' }]}>
                                    <Text style={[styles.tableCellGray, { fontWeight: 200, textAlign: 'center', marginRight: 10 }]}>Cédula</Text>
                                </View>
                                <View style={[styles.tableColGray, { width: '20%' }]}>
                                    <Text style={[styles.tableCellGray, { fontWeight: 200, textAlign: 'center', marginRight: 10 }]}>Horas Laboradas</Text>
                                </View>
                                <View style={[styles.tableColGray, { width: '15%' }]}>
                                    <Text style={[styles.tableCellGray, { fontWeight: 200, textAlign: 'center', marginRight: 10 }]}>Precio Hora</Text>
                                </View>
                                <View style={[styles.tableColGray, { width: '20%' }]}>
                                    <Text style={[styles.tableCellGray, { fontWeight: 200, textAlign: 'center', marginRight: 10 }]}>Total</Text>
                                </View>
                            </View>
                            {
                                info.c.map((item, index) =>
                                    <View key={index} style={styles.tableRow}>
                                        <View style={[styles.tableCol, { width: '30%', borderLeftWidth: 1 }]}>
                                            <Text style={[styles.tableCell, { fontWeight: 200, textAlign: 'center', marginRight: 10 }]}>{item.empleado.nombre}</Text>
                                        </View>
                                        <View style={[styles.tableCol, { width: '15%' }]}>
                                            <Text style={[styles.tableCell, { fontWeight: 200, textAlign: 'center', marginRight: 10 }]}>{item.empleado.cedula}</Text>
                                        </View>
                                        <View style={[styles.tableCol, { width: '20%' }]}>
                                            <Text style={[styles.tableCell, { fontWeight: 200, textAlign: 'center', marginRight: 10 }]}>{item.horas}</Text>
                                        </View>
                                        <View style={[styles.tableCol, { width: '15%' }]}>
                                            <Text style={[styles.tableCell, { fontWeight: 200, textAlign: 'center', marginRight: 10 }]}>{item.empleado.puesto.salario}</Text>
                                        </View>
                                        <View style={[styles.tableCol, { width: '20%' }]}>
                                            <Text style={[styles.tableCell, { fontWeight: 200, textAlign: 'center', marginRight: 10 }]}>{item.horas * item.empleado.puesto.salario}</Text>
                                        </View>
                                    </View>
                                )
                            }
                        </View>
                    </View>
                }
                {
                    info.a.length > 0 &&
                    <View style={{ marginTop: 10 }}>
                        <View>
                            <View style={{ width: '100%' }}>
                                <Text style={[styles.subtitle, { fontWeight: 400, textAlign: 'center', marginRight: 10 }]}>PLANILLA ADMINISTRATIVA</Text>
                            </View>
                        </View>
                        <View style={styles.table}>
                            <View style={styles.tableRow}>
                                <View style={[styles.tableColGray, { width: '30%' }]}>
                                    <Text style={[styles.tableCellGray, { fontWeight: 200, textAlign: 'center', marginRight: 10 }]}>Nombre</Text>
                                </View>
                                <View style={[styles.tableColGray, { width: '15%' }]}>
                                    <Text style={[styles.tableCellGray, { fontWeight: 200, textAlign: 'center', marginRight: 10 }]}>Cédula</Text>
                                </View>
                                <View style={[styles.tableColGray, { width: '20%' }]}>
                                    <Text style={[styles.tableCellGray, { fontWeight: 200, textAlign: 'center', marginRight: 10 }]}>Horas Laboradas</Text>
                                </View>
                                <View style={[styles.tableColGray, { width: '15%' }]}>
                                    <Text style={[styles.tableCellGray, { fontWeight: 200, textAlign: 'center', marginRight: 10 }]}>Precio Hora</Text>
                                </View>
                                <View style={[styles.tableColGray, { width: '20%' }]}>
                                    <Text style={[styles.tableCellGray, { fontWeight: 200, textAlign: 'center', marginRight: 10 }]}>Total</Text>
                                </View>
                            </View>
                            {
                                info.a.map((item, index) =>
                                    <View key={index} style={styles.tableRow}>
                                        <View style={[styles.tableCol, { width: '30%', borderLeftWidth: 1 }]}>
                                            <Text style={[styles.tableCell, { fontWeight: 200, textAlign: 'center', marginRight: 10 }]}>{item.empleado.nombre}</Text>
                                        </View>
                                        <View style={[styles.tableCol, { width: '15%' }]}>
                                            <Text style={[styles.tableCell, { fontWeight: 200, textAlign: 'center', marginRight: 10 }]}>{item.empleado.cedula}</Text>
                                        </View>
                                        <View style={[styles.tableCol, { width: '20%' }]}>
                                            <Text style={[styles.tableCell, { fontWeight: 200, textAlign: 'center', marginRight: 10 }]}>{item.horas}</Text>
                                        </View>
                                        <View style={[styles.tableCol, { width: '15%' }]}>
                                            <Text style={[styles.tableCell, { fontWeight: 200, textAlign: 'center', marginRight: 10 }]}>{item.empleado.puesto.salario}</Text>
                                        </View>
                                        <View style={[styles.tableCol, { width: '20%' }]}>
                                            <Text style={[styles.tableCell, { fontWeight: 200, textAlign: 'center', marginRight: 10 }]}>{item.horas * item.empleado.puesto.salario}</Text>
                                        </View>
                                    </View>
                                )
                            }
                        </View>
                    </View>
                }
                <View style={styles.tableRow}>
                    <View style={{ width: '70%' }}>
                        <Text style={[styles.tableCellGray, { fontWeight: 200, textAlign: 'right', marginRight: 10 }]}>TOTAL:</Text>
                    </View>
                    <View style={{ width: '30%' }}>
                        <Text style={[styles.tableCell, { fontWeight: 100, marginLeft: 10 }]}>{total}</Text>
                    </View>
                </View>
            </Page>
        </Document >
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

export default PlanillaPDF
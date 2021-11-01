/* eslint-disable react/jsx-no-target-blank */
import React, { useState } from 'react'
import { Panel } from 'rsuite';
import { withRouter, Link } from 'react-router-dom';
import Label from '../../shared/Label'
import { Icon } from 'rsuite';
import Action from '../../shared/Action'

const CardMovimiento = ({ ...props }) => {
    const [state, setState] = useState(false);
    const { movimiento } = props;
    const moneda = {
        'US Dollar': '$',
        'Colón': '₡',
        'Yen': '¥'
    }

    function getFecha(fecha) {
        var date = new Date(fecha);
        var day = (date.getDate() < 9) ? '0' + (date.getDate() + 1) : date.getDate() + 1;
        var mes = (date.getMonth() < 9) ? '0' + (date.getMonth() + 1) : date.getMonth() + 1;
        return date.getFullYear() + ' / ' + mes + ' / ' + day;
    }

    return (
        <Panel shaded bordered bodyFill style={{ width: 600, maxWidth: 600 }}
            className={` ${state ? 'shadow-lg' : ' '} mx-4 my-4`}
            onMouseEnter={() => setState(true)}
            onMouseLeave={() => setState(false)}
        >
            <>
                <h4 className="mt-4 text-center">{"Datos del Movimiento"}</h4>
                <div className="mx-1 row">
                    <div className="col-md-6">
                        <h6>Tipo</h6>
                        <Label icon="list" value={movimiento.tipo} />
                        <h6>Lote</h6>
                        <Label icon="hashtag" value={movimiento.lote} />
                        <h6>Código</h6>
                        <Label icon="barcode" value={movimiento.codigo} />
                        <h6>Proveedor</h6>
                        <Label icon="shopping-cart" value={movimiento.proveedor ? movimiento.proveedor.empresa : "No especificado"} />
                        {movimiento.tipo === 'ENTRADA' &&
                            <>
                                {movimiento.fechaFabricacion &&
                                    <>
                                        <h6>Fabricación</h6>
                                        <Label icon="calendar-o" value={getFecha(movimiento.fechaFabricacion)} />
                                    </>
                                }
                                {movimiento.fechaVencimiento &&
                                    <>
                                        <h6>Vencimiento</h6>
                                        <Label icon="calendar-o" value={getFecha(movimiento.fechaVencimiento)} />
                                    </>
                                }
                            </>
                        }
                        <h6>Cantidad</h6>
                        <Label icon="hashtag" value={movimiento.cantidad} />
                        {movimiento.tipo === 'SALIDA' &&
                            <div style={{ height: 150 }}></div>
                        }
                    </div>
                    <div className="col-md-6">
                        {movimiento.tipo === 'ENTRADA' &&
                            <>
                                <h6>Existencias</h6>
                                <Label icon="hashtag" value={movimiento.existencia} />
                                <h6>Precio unidad</h6>
                                <Label icon="hashtag" value={movimiento.precio_unidad} />
                                <h6>Total</h6>
                                <Label icon="hashtag" value={moneda[movimiento.moneda] + ' ' + movimiento.precio} />
                            </>
                        }
                        <h6>Registrado por</h6>
                        <Label icon="user" value={movimiento.usuario.nombre} />
                        <h6>Fecha de registro</h6>
                        <Label icon="calendar-o" value={getFecha(movimiento.fecha)} />
                    </div>
                </div>
                <div className="m-1 row">
                    {movimiento.tipo === 'ENTRADA' &&
                        <>
                            <h6>Archivo COA</h6>
                            <div className="col-md-5 float-left bg-primary rounded py-1 my-1">
                                <a className="text-white" href={movimiento.cao} target="_blank"><Icon icon="eye" />  Ver Archivo COA</a>
                            </div>
                        </>
                    }
                    <div className="col-md-2"></div>
                    {/* 
                    <div className="justify-content-end col-md-5 float_right bg-success rounded py-1 my-1">
                        <a className="text-white" href={"https://storage.cloud.google.com/bucket_pro_capsulas/archivos_coa/" + movimiento.cao} download={movimiento.cao}><Icon icon="download" />   Descargar Archivo COA</a>s
                    </div>*/}
                </div>
            </>
        </Panel>
    )
}

export default withRouter(CardMovimiento)
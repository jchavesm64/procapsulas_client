import React from 'react';
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';
import Login from '../components/authentication/Login';
import Clave from '../components/authentication/CambiarClave';
import NavMenu from '../components/layout/NavMenu';
import Session from '../components/Session';
import Sidebar from '../components/layout/Sidebar';
import Perfil from '../components/Perfil/Perfil';
import Configuracion from '../components/ConfiguracionesGenerales/Configuraciones';
import TipoProductos from '../components/ConfiguracionesGenerales/TipoProducto/TipoProducto';
import TipoProveduria from '../components/ConfiguracionesGenerales/Proveduria/TipoProveduria';
import Roles from '../components/ConfiguracionesGenerales/Roles/GestionarRoles';
import Usuarios from '../components/usuarios/usuarios';
import NuevoUsuario from '../components/usuarios/NuevoUsuario';
import EditarUsuario from '../components/usuarios/EditarUsuario';
import Clientes from '../components/clientes/Clientes';
import NuevoCliente from '../components/clientes/NuevoCliente';
import EditarCliente from '../components/clientes/EditarCliente';
import Proveedores from '../components/proveedores/Proveedores';
import NuevoProveedor from '../components/proveedores/NuevoProveedor';
import EditarProveedor from '../components/proveedores/EditarProveedor';
import MateriasPrimas from '../components/materias_primas/MateriasPrimas';
import NuevaMateriaPrima from '../components/materias_primas/Nuevo';
import EditarMateriaPrima from '../components/materias_primas/Editar';
import Movimientos from '../components/materias_primas/Movimientos/Movimientos';
import NuevoMovimiento from '../components/materias_primas/Movimientos/Nuevo';
import Formulas from '../components/ConfiguracionesGenerales/Formula/formulas';
import NuevaFormula from '../components/ConfiguracionesGenerales/Formula/nuevo';
import EditarFormula from '../components/ConfiguracionesGenerales/Formula/Editar';
import Cotizaciones from '../components/Cotizaciones/Cotizaciones';
import Cotizador from '../components/Cotizaciones/Cotizador';
import FormulasBase from '../components/ConfiguracionesGenerales/FormulaBase/Bases';
import NuevaFormulaBase from '../components/ConfiguracionesGenerales/FormulaBase/nuevo';
import EditarFormulaBase from '../components/ConfiguracionesGenerales/FormulaBase/Editar';
import EditarCotizacion from '../components/Cotizaciones/Editar';
import Salida from '../components/materias_primas/Movimientos/Salida';
import Categoria from '../components/ConfiguracionesGenerales/Categoria/Categoria';
import Maquinaria from '../components/Maquinaria/Maquinaria';
import NuevaMaquina from '../components/Maquinaria/Nuevo';
import EditarMaquina from '../components/Maquinaria/Editar';
import Incidentes from '../components/Maquinaria/Incidentes/Incidentes';
import NuevoIncidente from '../components/Maquinaria/Incidentes/Nuevo';
import EditarIncidente from '../components/Maquinaria/Incidentes/Editar';
import Mantenimientos from '../components/Maquinaria/Mantenimientos/Mantenimientos';
import NuevoMantenimiento from '../components/Maquinaria/Mantenimientos/Nuevo';
import EditarMantenimiento from '../components/Maquinaria/Mantenimientos/Editar';
import InformacionMaquinaria from '../components/Maquinaria/Informacion';
import Ubicacion from '../components/ConfiguracionesGenerales/Ubicacion/Ubicacion';

const Router = ({ refetch, session }) => {

    const { obtenerUsuarioAutenticado } = session;
    const { estado, data } = obtenerUsuarioAutenticado;
    let info = window.location.href.toString().includes('info')
    var mensaje = (!session || !estado) ? info ? '' : <Redirect to="/login" /> : ''
    return (
        <BrowserRouter>
            <>
                {mensaje}
                <div className="wrapper">
                    {estado ? info ? '' : <Sidebar session={data} /> : ''}
                    <div id="content">
                        <NavMenu session={data} refetch={refetch} />
                        <div className="container-fluid p-5">
                            <Switch>
                                {!estado ? <Route exact path="/login" render={() => <Login refetch={refetch} />} /> : ''}
                                {!estado ? <Route exact path="/olvido_clave" render={() => <Clave refetch={refetch} />} /> : ''}
                                <Route exact path="/perfil" render={() => <Perfil refetch={refetch} />} />
                                <Route exact path="/config" render={() => <Configuracion session={data} refetch={refetch} />} />
                                <Route exact path="/info/maquina/:id" render={() => <InformacionMaquinaria refetch={refetch} />} />

                                <Route exact path="/config/tipoproductos" render={() => <TipoProductos session={data} refetch={refetch} />} />
                                <Route exact path="/config/tipoproveduria" render={() => <TipoProveduria session={data} refetch={refetch} />} />
                                <Route exact path="/config/roles" render={() => <Roles session={data} refetch={refetch} />} />
                                <Route exact path="/config/formulas" render={(props) => <Formulas session={data} refetch={refetch} {...props} />} />
                                <Route exact path="/config/formulas/editar/:id" render={(props) => <EditarFormula uso={true} session={data} refetch={refetch} {...props} />} />
                                <Route exact path="/config/formulas/detalles/:id" render={(props) => <EditarFormula uso={false} session={data} refetch={refetch} {...props} />} />
                                <Route exact path="/config/formulas/nuevo" render={(props) => <NuevaFormula session={data} refetch={refetch} {...props} />} />
                                <Route exact path="/config/formulasbase" render={(props) => <FormulasBase session={data} refetch={refetch} {...props} />} />
                                <Route exact path="/config/formulasbase/nuevo" render={(props) => <NuevaFormulaBase session={data} refetch={refetch} {...props} />} />
                                <Route exact path="/config/formulasbase/editar/:id" render={(props) => <EditarFormulaBase uso={true} session={data} refetch={refetch} {...props} />} />
                                <Route exact path="/config/formulasbase/detalles/:id" render={(props) => <EditarFormulaBase uso={false} session={data} refetch={refetch} {...props} />} />
                                {/*<Route exact path="/config/puestos" render={(props) => <Puestos session={data} refetch={refetch} {...props} />} />*/}
                                <Route exact path="/config/categorias" render={(props) => <Categoria session={data} refetch={refetch} {...props} />} />
                                <Route exact path="/config/ubicaciones" render={(props) => <Ubicacion session={data} refetch={refetch} {...props} />} />

                                <Route exact path="/usuarios" render={(props) => <Usuarios session={data} refetch={refetch} {...props} />} />
                                <Route exact path="/usuarios/nuevo" render={(props) => <NuevoUsuario session={data} refetch={refetch} {...props} />} />
                                <Route exact path="/usuarios/editar/:id" render={(props) => <EditarUsuario uso={true} session={data} refetch={refetch} {...props} />} />
                                <Route exact path="/usuarios/detalles/:id" render={(props) => <EditarUsuario uso={false} session={data} refetch={refetch} {...props} />} />

                                <Route exact path="/clientes" render={(props) => <Clientes session={data} refetch={refetch} {...props} />} />
                                <Route exact path="/clientes/nuevo" render={(props) => <NuevoCliente session={data} refetch={refetch} {...props} />} />
                                <Route exact path="/clientes/editar/:id" render={(props) => <EditarCliente uso={true} session={data} refetch={refetch} {...props} />} />
                                <Route exact path="/clientes/detalles/:id" render={(props) => <EditarCliente uso={false} session={data} refetch={refetch} {...props} />} />

                                {/*
                                <Route exact path="/personal" render={(props) => <Personal session={data} refetch={refetch} {...props} />} />
                                <Route exact path="/personal/nuevo" render={(props) => <NuevoPersonal session={data} refetch={refetch} {...props} />} />
                                <Route exact path="/personal/editar/:id" render={(props) => <EditarPersonal uso={true} session={data} refetch={refetch} {...props} />} />
                                */}

                                <Route exact path="/proveedores" render={(props) => <Proveedores session={data} refetch={refetch} {...props} />} />
                                <Route exact path="/proveedores/nuevo" render={(props) => <NuevoProveedor session={data} refetch={refetch} {...props} />} />
                                <Route exact path="/proveedores/editar/:id" render={(props) => <EditarProveedor uso={false} session={data} refetch={refetch} {...props} />} />
                                <Route exact path="/proveedores/detalles/:id" render={(props) => <EditarProveedor uso={true} session={data} refetch={refetch} {...props} />} />

                                <Route exact path="/materias_primas" render={(props) => <MateriasPrimas session={data} refetch={refetch} {...props} />} />
                                <Route exact path="/materias_primas/nuevo" render={(props) => <NuevaMateriaPrima session={data} refetch={refetch} {...props} />} />
                                <Route exact path="/materias_primas/editar/:id" render={(props) => <EditarMateriaPrima session={data} refetch={refetch} {...props} />} />
                                <Route exact path="/movimientos/:id/:nombre" render={(props) => <Movimientos session={data} refetch={refetch} {...props} />} />
                                <Route exact path="/movimiento/nuevo/:id" render={(props) => <NuevoMovimiento session={data} refetch={refetch} {...props} />} />
                                <Route exact path="/salida/:id" render={(props) => <Salida session={data} refetch={refetch} {...props} />} />
                                {/* 
                                <Route exact path="/productos" render={(props) => <Productos session={data} refetch={refetch} {...props} />} />
                                <Route exact path="/productos/nuevo" render={(props) => <NuevoProducto session={data} refetch={refetch} {...props} />} />
                                <Route exact path="/productos/editar/:id" render={(props) => <EditarProducto session={data} refetch={refetch} {...props} />} />
                                <Route exact path="/movimientos_productos/:id/:nombre" render={(props) => <MovimientosProductos session={data} refetch={refetch} {...props} />} />
                                <Route exact path="/movimiento_producto/nuevo/:id" render={(props) => <NuevoMovimientoProducto session={data} refetch={refetch} {...props} />} />

                                <Route exact path="/seleccion" render={(props) => <Seleccion session={data} refetch={refetch} {...props} />} />
                                <Route exact path="/seleccion/nuevo" render={(props) => <NuevaSeleccion session={data} refetch={refetch} {...props} />} />
                                <Route exact path="/seleccion/editar/:id" render={(props) => <EditarSeleccion session={data} refetch={refetch} {...props} />} />
                                <Route exact path="/movimientos_seleccion/:id/:nombre" render={(props) => <MovimientosSeleccion session={data} refetch={refetch} {...props} />} />
                                <Route exact path="/movimiento_seleccion/nuevo/:id" render={(props) => <NuevoMovimientoSeleccion session={data} refetch={refetch} {...props} />} />
                                <Route exact path="/salida_seleccion/:id" render={(props) => <SalidaMovimientoSeleccion session={data} refetch={refetch} {...props} />} />

                                <Route exact path="/dispensado" render={(props) => <Dispensado session={data} refetch={refetch} {...props} />} />
                                <Route exact path="/dispensado/nuevo" render={(props) => <NuevoDispensado session={data} refetch={refetch} {...props} />} />
                                <Route exact path="/dispensado/editar/:id" render={(props) => <EditarDispensado session={data} refetch={refetch} {...props} />} />
                                <Route exact path="/movimientos_dispensado/:id/:nombre" render={(props) => <MovimientosDispensado session={data} refetch={refetch} {...props} />} />
                                <Route exact path="/movimiento_dispensado/nuevo/:id" render={(props) => <NuevoMovimientoDispensado session={data} refetch={refetch} {...props} />} />
                                <Route exact path="/salida_dispensado/:id" render={(props) => <SalidaMovimientoDispensado session={data} refetch={refetch} {...props} />} />
                                */}
                                <Route exact path="/maquinaria" render={(props) => <Maquinaria session={data} refetch={refetch} {...props} />} />
                                <Route exact path="/maquinaria/nuevo" render={(props) => <NuevaMaquina session={data} refetch={refetch} {...props} />} />
                                <Route exact path="/maquinaria/editar/:id" render={(props) => <EditarMaquina uso={true} session={data} refetch={refetch} {...props} />} />
                                <Route exact path="/maquinaria/detalles/:id" render={(props) => <EditarMaquina uso={false} session={data} refetch={refetch} {...props} />} />
                                <Route exact path="/incidentes/:id" render={(props) => <Incidentes session={data} refetch={refetch} {...props} />} />
                                <Route exact path="/incidentes/nuevo/:id" render={(props) => <NuevoIncidente session={data} refetch={refetch} {...props} />} />
                                <Route exact path="/incidentes/editar/:id" render={(props) => <EditarIncidente session={data} refetch={refetch} {...props} />} />
                                <Route exact path="/mantenimientos/:id" render={(props) => <Mantenimientos session={data} refetch={refetch} {...props} />} />
                                <Route exact path="/mantenimientos/nuevo/:id" render={(props) => <NuevoMantenimiento session={data} refetch={refetch} {...props} />} />
                                <Route exact path="/mantenimientos/editar/:id" render={(props) => <EditarMantenimiento session={data} refetch={refetch} uso={true} {...props} />} />
                                <Route exact path="/mantenimientos/detalles/:id" render={(props) => <EditarMantenimiento session={data} refetch={refetch} uso={false} {...props} />} />

                                <Route exact path="/cotizar" render={(props) => <Cotizador session={data} refetch={refetch} {...props} />} />
                                <Route exact path="/cotizaciones" render={(props) => <Cotizaciones session={data} refetch={refetch} {...props} />} />
                                <Route exact path="/cotizaciones/editar/:id" render={(props) => <EditarCotizacion session={data} refetch={refetch} {...props} />} />
                                {/* 
                                <Route exact path="/puestos_limpieza" render={(props) => <PuestosLimpieza session={data} refetch={refetch} {...props} />} />
                                <Route exact path="/puestos_limpieza/nuevo" render={(props) => <NuevoPuestoLimpieza session={data} refetch={refetch} {...props} />} />
                                <Route exact path="/puestos_limpieza/editar/:id" render={(props) => <EditarPuestoLimpieza uso={true} session={data} refetch={refetch} {...props} />} />
                                <Route exact path="/puestos_limpieza/detalles/:id" render={(props) => <EditarPuestoLimpieza uso={false} session={data} refetch={refetch} {...props} />} />
                                */}
                                {(estado && localStorage.getItem('rol')) ? <Redirect to='/perfil' /> : <Redirect to="/login" />}
                            </Switch>
                        </div>
                    </div>
                </div>
            </>
        </BrowserRouter>
    );
}
export default Router;

const RootSession = Session(Router)
export { RootSession };
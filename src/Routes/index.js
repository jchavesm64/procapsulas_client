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

const Router = ({ refetch, session }) => {

    const { obtenerUsuarioAutenticado } = session;
    const {estado, data} = obtenerUsuarioAutenticado;
    var mensaje = (!session || !estado) ? <Redirect to="/login" /> : ''
    return (
        <BrowserRouter>
            <>
                {mensaje}
                <div className="wrapper">
                    {estado ? <Sidebar session={data} /> : ''}
                    <div id="content">
                        <NavMenu session={data} refetch={refetch} />
                        <div className="container">
                            <Switch>
                                {!estado ? <Route exact path="/login" render={() => <Login refetch={refetch} />} /> : ''}
                                {!estado ? <Route exact path="/olvido_clave" render={() => <Clave refetch={refetch}/>}/>: ''}
                                <Route exact path="/perfil" render={() => <Perfil refetch={refetch} />} />
                                <Route exact path="/config" render={() => <Configuracion session={data} refetch={refetch} />} />
                                <Route exact path="/config/tipoproductos" render={() => <TipoProductos session={data} refetch={refetch}/>}/>
                                <Route exact path="/config/tipoproveduria" render={() => <TipoProveduria session={data} refetch={refetch}/>}/>
                                <Route exact path="/config/roles" render={() => <Roles session={data} refetch={refetch}/>}/>
                                <Route exact path="/usuarios" render={(props) => <Usuarios session={data} refetch={refetch} {...props}/>}/>
                                <Route exact path="/usuarios/nuevo" render={(props) => <NuevoUsuario session={data} refetch={refetch} {...props}/>}/>
                                <Route exact path="/usuarios/editar/:id" render={(props) => <EditarUsuario uso={true} session={data} refetch={refetch} {...props}/>}/>
                                <Route exact path="/usuarios/detalles/:id" render={(props) => <EditarUsuario uso={false} session={data} refetch={refetch} {...props}/>}/>
                                <Route exact path="/clientes" render={(props) => <Clientes session={data} refetch={refetch} {...props}/>}/>
                                <Route exact path="/clientes/nuevo" render={(props) => <NuevoCliente session={data} refetch={refetch} {...props}/>}/>
                                <Route exact path="/clientes/editar/:id" render={(props) => <EditarCliente uso={true} session={data} refetch={refetch} {...props}/>}/>
                                <Route exact path="/clientes/detalles/:id" render={(props) => <EditarCliente uso={false} session={data} refetch={refetch} {...props}/>}/>
                                <Route exact path="/proveedores" render={(props) => <Proveedores session={data} refetch={refetch} {...props}/>}/>
                                <Route exact path="/proveedores/nuevo" render={(props) => <NuevoProveedor session={data} refetch={refetch} {...props}/>}/>
                                <Route exact path="/proveedores/editar/:id" render={(props) => <EditarProveedor uso={false} session={data} refetch={refetch} {...props}/>}/>
                                <Route exact path="/proveedores/detalles/:id" render={(props) => <EditarProveedor uso={true} session={data} refetch={refetch} {...props}/>}/>
                                <Route exact path="/materias_primas" render={(props) => <MateriasPrimas session={data} refetch={refetch} {...props}/>}/>
                                <Route exact path="/materias_primas/nuevo" render={(props) => <NuevaMateriaPrima session={data} refetch={refetch} {...props}/>}/>
                                <Route exact path="/materias_primas/editar/:id" render={(props) => <EditarMateriaPrima session={data} refetch={refetch} {...props}/>}/>
                                <Route exact path="/movimientos/:id/:nombre" render={(props) => <Movimientos session={data} refetch={refetch} {...props}/>}/>

                                <Route exact path="/salida/:id" render={(props) => <Salida session={data} refetch={refetch} {...props}/>}/>

                                <Route exact path="/movimiento/nuevo/:id" render={(props) => <NuevoMovimiento session={data} refetch={refetch} {...props}/>}/>
                                <Route exact path="/config/formulas" render={(props) => <Formulas session={data} refetch={refetch} {...props}/>}/>
                                <Route exact path="/config/formulas/editar/:id" render={(props) => <EditarFormula uso={true} session={data} refetch={refetch} {...props}/>}/>
                                <Route exact path="/config/formulas/detalles/:id" render={(props) => <EditarFormula uso={false} session={data} refetch={refetch} {...props}/>}/>
                                <Route exact path="/config/formulas/nuevo" render={(props) => <NuevaFormula session={data} refetch={refetch} {...props}/>}/>
                                <Route exact path="/cotizar" render={(props) => <Cotizador session={data} refetch={refetch} {...props}/>}/>
                                <Route exact path="/cotizaciones" render={(props) => <Cotizaciones session={data} refetch={refetch} {...props}/>}/>
                                <Route exact path="/cotizaciones/editar/:id" render={(props) => <EditarCotizacion session={data} refetch={refetch} {...props}/>}/>
                                <Route exact path="/config/formulasbase" render={(props) => <FormulasBase session={data} refetch={refetch} {...props}/>}/>
                                <Route exact path="/config/formulasbase/nuevo" render={(props) => <NuevaFormulaBase session={data} refetch={refetch} {...props}/>}/>
                                <Route exact path="/config/formulasbase/editar/:id" render={(props) => <EditarFormulaBase uso={true} session={data} refetch={refetch} {...props}/>}/>
                                <Route exact path="/config/formulasbase/detalles/:id" render={(props) => <EditarFormulaBase uso={false} session={data} refetch={refetch} {...props}/>}/>
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
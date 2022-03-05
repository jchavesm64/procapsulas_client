import React from 'react';
import ReactExport from "react-export-excel";
import { IconButton, Icon } from "rsuite";
const ExcelFile = ReactExport.ExcelFile;
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;
const ExcelColumn = ReactExport.ExcelFile.ExcelColumn;

const PlanillaExcel = ({ props, data, general, name, color, filename }) => {
    return (
        <ExcelFile element={
            <IconButton className="mx-2" icon={<Icon icon="fas fa-file-excel" />} placement="left" color={color} size="lg">
                {name}
            </IconButton>
        } filename={filename}>
            <ExcelSheet data={data.general} name="Información de la Planilla">
                <ExcelColumn label="Fecha del Lunes" value="fecha1" />
                <ExcelColumn label="fecha del Domingo" value="fecha2" />
                <ExcelColumn label="Total de la Planilla" value="total" />
            </ExcelSheet>
            {
                data.operativa.length > 0 &&
                <ExcelSheet data={data.operativa} name="Planilla Operativa">
                    <ExcelColumn label="Nombre" value="nombre" />
                    <ExcelColumn label="Cédula" value="cedula" />
                    <ExcelColumn label="Horas Laboradas" value="horas" />
                    <ExcelColumn label="Precio Horas" value="precio" />
                    <ExcelColumn label="Total" value="total" />
                </ExcelSheet>
            }
            {
                data.produccion.length > 0 &&
                <ExcelSheet data={data.produccion} name="Producción de Cápsulas">
                    <ExcelColumn label="Nombre" value="nombre" />
                    <ExcelColumn label="Cédula" value="cedula" />
                    <ExcelColumn label="Horas Laboradas" value="horas" />
                    <ExcelColumn label="Precio Horas" value="precio" />
                    <ExcelColumn label="Total" value="total" />
                </ExcelSheet>
            }
            {
                data.administrativa.length > 0 &&
                <ExcelSheet data={data.administrativa} name="Planilla Administrativa">
                    <ExcelColumn label="Nombre" value="nombre" />
                    <ExcelColumn label="Cédula" value="cedula" />
                    <ExcelColumn label="Horas Laboradas" value="horas" />
                    <ExcelColumn label="Precio Horas" value="precio" />
                    <ExcelColumn label="Total" value="total" />
                </ExcelSheet>
            }
        </ExcelFile>
    )
}

export default PlanillaExcel
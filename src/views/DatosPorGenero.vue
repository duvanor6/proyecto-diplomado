<script setup>

import { ref, onMounted } from 'vue'
import BreadCrumb from '../components/BreadCrumb.vue'
import { BuildingOfficeIcon  } from '@heroicons/vue/24/solid'
import axios from "axios";

const datos = ref([])
const datosAux = ref([])

const genero = "";
const periodo = "";

function loadData() {
    datos.value = []
    axios.get('https://www.datos.gov.co/resource/r86y-229a.json')
        .then(function (response) {
            datos.value = response.data
        })
        .catch(function (error) {
            console.log(error);
        });
}

onMounted(() => {
    datos.value = []
    axios.get('https://www.datos.gov.co/resource/r86y-229a.json')
        .then(function (response) {
            datos.value = response.data
            const programasUnicos = obtenerValoresUnicos(datos.value, "programa");
            console.log(programasUnicos);
            const periodosUnicos = obtenerValoresUnicos(datos.value, "periodo");
            llenarSelect("selectPeriodos", periodosUnicos);
        })
        .catch(function (error) {
            console.log(error);
        });
})

function resetFiltros() {
            // Limpiar los valores de los selectores
            this.periodo = '';
            this.facultad = '';
            this.programa = '';

            // Aquí puedes restaurar los datos originales de la tabla si es necesario
            this.datos = this.datosAux;            
        }

function llenarSelect(selectId, opciones) {
    const select = document.getElementById(selectId);
    opciones.forEach(opcion => {
        const option = document.createElement("option");
        option.text = opcion;
        select.add(option);
    });
}
function obtenerValoresUnicos(datos, propiedad) {
    // Verificar si datos es un array
    if (Array.isArray(datos)) {
        return [...new Set(datos.map(dato => dato[propiedad]))];
    } else {
        console.error("Los datos no están en el formato esperado.");
        return [];
    }
}

function filtrarDatos() {

    if(this.datosAux.length > 0) {
    this.datos = this.datosAux;
    }

    
    // Obtener los valores seleccionados
    const periodoSeleccionado = this.periodo;
    const facultadSeleccionada = this.facultad;
    const programaSeleccionado = this.programa;

    console.log("datos: "+this.periodo+" "+this.facultad+" "+this.programa);
    // Filtrar los datos de la tabla según los valores seleccionados

    let datosFiltrados = [];

    datosFiltrados = this.datos.filter(dato => {
        // Verificar si hay un valor seleccionado para cada filtro
        const filtroPeriodo = !periodoSeleccionado || dato.periodo === periodoSeleccionado;
        const filtroFacultad = !facultadSeleccionada || dato.facultad === facultadSeleccionada;
        const filtroPrograma = !programaSeleccionado || dato.programa === programaSeleccionado;

        // Retornar true si todos los filtros coinciden, de lo contrario false
        return filtroPeriodo && filtroFacultad && filtroPrograma;
    });

    // Actualizar los datos de la tabla con los datos filtrados
    this.datosAux = this.datos;
    this.datos = datosFiltrados;
}

</script>


<template>
    <BreadCrumb modulo="Datos" accion="Datos por Genero" />
    

    <div class="my-2 text-gray-700">

        <div class="flex items-center">
            
            <h2 class="mb-1 text-4xl font-bold dark:text-black">Listado de datos</h2>
        </div>
        
        <div class="flex justify-end ">
            <select @change="filtrarDatos()" id="selectPeriodos" class="m-3 w-24 text-black" v-model="periodo">
                <option class="dark:text-black" disabled value="">Periodos</option>
            </select>  
            <select @change="filtrarDatos()" id="selectGenero" class="m-3 w-24 text-black" v-model="genero">
                <option disabled value="">Genero</option>
                <option>Masculino</option>
                <option>Femenino</option>
            </select>  
            <button @click="resetFiltros()" type="button warning" class="boton-1 m-2">Limpiar</button>
        </div>
    </div>



    <div class="relative overflow-x-auto">
        <table class="w-full text-sm text-left text-gray-500 dark:text-gray-400">
            <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                <tr>
                    <th scope="col" class="px-6 py-3">Periodo</th>
                    <th scope="col" class="px-6 py-3">Facultad</th>
                    <th scope="col" class="px-6 py-3">Programa</th>
                    <th scope="col" class="px-6 py-3">Total matricula</th>
                    <th scope="col" class="px-6 py-3">Masculino</th>
                    <th scope="col" class="px-6 py-3">Femenino</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="fila in datos" class="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                    <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                        {{ fila.periodo }}
                    </th>
                    <td class="px-6 py-4">{{ fila.facultad }}</td>
                    <td class="px-6 py-4">{{ fila.programa }}</td>
                    <td class="px-6 py-4">{{ fila.total_matricula }}</td>
                    <td class="px-6 py-4">{{ fila.sexo_masc }}</td>
                    <td class="px-6 py-4">{{ fila.sexo_feme }}</td>
                </tr>

            </tbody>
            
        </table>
        <paginate :page-count="pageCount" :click-handler="paginateHandler" :prev-text="'Anterior'" :next-text="'Siguiente'">
        </paginate>
    </div>
</template>
<script setup>

import BreadCrumb from '../components/BreadCrumb.vue'

import { ref, onMounted } from 'vue'
import axios from "axios";

const contador = ref(0)
const errores = ref([])
const ciudades = ref([])

const formulario = ref({
    'city_id': null,
    'name': null,
    'nit': null,
    'address': null,
    'num_rooms': null
});


onMounted(() => {
    axios.get('cities')
        .then(function (response) {
            console.log(response.data)
            ciudades.value = response.data
        })
        .catch(function (error) {
            console.log(error);
        });
})

function enviar() {
    axios.post('hotels', formulario.value)
        .then(function (response) {
            // console.log(response.data)
        })
        .catch(function (error) {
            errores.value = error.response.data.errors
        });
}


</script>


<template>

    <div class="grid grid-cols-2 my-6 text-gray-700">
        <div class="flex items-center">
            <BuildingOfficeIcon class="w-10" />
            <h2 class="mb-1 text-4xl font-bold dark:text-black">PROYECTO DIPLOMADO</h2>
        </div>
        <div class="flex justify-end">
            <!-- <button @click="loadData()" type="button" class="boton-1">Crear nuevo</button> -->
        </div>
    </div>



 
</template>
<template>
    <div class="hidden pt-10 w-56 bg-gray-100 overflow-y-auto md:block">

        <div class="font-medium text-lg ml-3 mb-3">
            Menú
        </div>
        
        <router-link to="/datos-facultad">
            <div class=" bg-gray-200 mb-2 w-48 ml-3 rounded-lg hover:bg-gray-400 p-1 pl-3 text-gray-500">
                Datos por Facultad
            </div>
        </router-link>

        <router-link to="/datos-genero">
            <div class=" bg-gray-200 mb-2 w-48 ml-3 rounded-lg hover:bg-gray-400 p-1 pl-3 text-gray-500">
                Datos por Genero
            </div>
        </router-link>

        <router-link to="/graficas">
            <div class=" bg-gray-200 mb-2 w-48 ml-3 rounded-lg hover:bg-gray-400 p-1 pl-3 text-gray-500">
                Graficas
            </div>
        </router-link>  
        
    </div>

</template>
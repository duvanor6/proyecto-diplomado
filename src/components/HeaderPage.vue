<template>

    <!-- HEADER -->
    <div class="md:flex md:flex-shrink-0">
        <router-link to="/home">
        <div class="flex items-center justify-between px-6   md:flex-shrink-0 md:justify-center md:w-56">
            <div class="logo-container"></div>
        </div>
    </router-link>
        <div class="md:text-md flex items-center justify-between p-4 w-full text-sm bg-white border-b md:px-12 md:py-0">
        
        <div class="mr-4 mt-1">Duban Ortega Pacheco</div>
        
        </div>
    </div>
    <!-- // HEADER -->


</template>
<style>
.logo-container {
    width: 100%; /* ajusta el ancho según lo necesites */
    height: 70px; /* ajusta la altura según lo necesites */
    background-size: cover; /* ajusta el tamaño de la imagen para cubrir el contenedor */
    background-position: center; /* centrar la imagen */
    background-image: url('../fondo2.jpg');
}
</style>
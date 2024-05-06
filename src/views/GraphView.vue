<script lang="ts">
import { ref, onMounted } from "vue";
import BreadCrumb from "../components/BreadCrumb.vue";
import { BuildingOfficeIcon } from "@heroicons/vue/24/solid";
import axios from "axios";
import Chart from "chart.js/auto";

export default {
  data() {
    return {
      datos: [],
      datosAux: [],
      totalMatriculados: 0,
      totalMujeres: 0,
      totalHombres: 0,
      // Mantener una referencia al gráfico
      graficoGenero: null,
      graficoEstrato: null,
      graficoPeriodos: null,
      periodo: "",
      selectPeriodo: "",
    };
  },
  methods: {
    loadData() {
      axios
        .get("https://www.datos.gov.co/resource/r86y-229a.json")
        .then((response) => {
          console.log(response.data);
          this.datos = response.data;
          const periodosUnicos = this.obtenerValoresUnicos(
            this.datos,
            "periodo"
          );
          this.llenarSelect("selectPeriodos", periodosUnicos);
          this.renderGraphEstratos();
          this.renderGraphGender();
          this.totales();
          this.selectPeriodo = "Todos";
          this.renderGraphPeriodos();
        });
    },
    resetFiltros() {
      // Limpiar los valores de los selectores
      this.periodo = "";
      this.genero = "";

      // Aquí puedes restaurar los datos originales de la tabla si es necesario
      this.datos = this.datosAux;
      this.selectPeriodo = "Todos";
      this.renderGraphGender();
      this.renderGraphEstratos();
    },
    llenarSelect(selectId, opciones) {
      const select = document.getElementById(selectId);
      opciones.forEach((opcion) => {
        const option = document.createElement("option");
        option.text = opcion;
        select.add(option);
      });
    },
    totales() {
      let totalMujeres = 0;
      let totalHombres = 0;

      this.datos.forEach((dato) => {
        totalMujeres += parseInt(dato.sexo_feme);
        totalHombres += parseInt(dato.sexo_masc);
      });

      this.totalMujeres = totalMujeres;
      this.totalHombres = totalHombres;
      this.totalMatriculados = totalMujeres + totalHombres;
    },
    obtenerValoresUnicos(datos, propiedad) {
      // Verificar si datos es un array
      if (Array.isArray(datos)) {
        return [...new Set(datos.map((dato) => dato[propiedad]))];
      } else {
        console.error("Los datos no están en el formato esperado.");
        return [];
      }
    },
    calcularTotalPorPeriodo() {
      const totalPorPeriodo = {};
      this.datos.forEach((dato) => {
        if (!totalPorPeriodo[dato.periodo]) {
          totalPorPeriodo[dato.periodo] = 0;
        }
        totalPorPeriodo[dato.periodo] += parseInt(dato.total_matricula);
      });
      return totalPorPeriodo;
    },
    renderGraphGender() {
      if (this.graficoGenero) {
        this.graficoGenero.destroy();
      }
      const ctx = document.getElementById("graficoGenero").getContext("2d");

      const totalFemenino = this.datos.reduce(
        (total, dato) => total + parseInt(dato.sexo_feme),
        0
      );
      const totalMasculino = this.datos.reduce(
        (total, dato) => total + parseInt(dato.sexo_masc),
        0
      );

      this.graficoGenero = new Chart(ctx, {
        type: "doughnut",
        data: {
          labels: ["Femenino", "Masculino"],
          datasets: [
            {
              label: "Genero",
              data: [totalFemenino, totalMasculino],
              backgroundColor: ["rgb(255, 99, 132)", "rgb(54, 162, 235)"],
              hoverOffset: 4,
            },
          ],
        },
        options: {
          responsive: true,
        },
      });
    },
    renderGraphEstratos() {
      if (this.graficoEstrato) {
        this.graficoEstrato.destroy();
      }
      const ctx = document.getElementById("graficoEstrato").getContext("2d");

      const estratoLabels = [
        "Estrato 1",
        "Estrato 2",
        "Estrato 3",
        "Estrato 4",
        "Estrato 5",
        "Estrato 6",
      ];
      const estratoData = [
        this.datos.reduce((total, dato) => total + parseInt(dato.estrato_1), 0),
        this.datos.reduce((total, dato) => total + parseInt(dato.estrato_2), 0),
        this.datos.reduce((total, dato) => total + parseInt(dato.estrato_3), 0),
        this.datos.reduce((total, dato) => total + parseInt(dato.estrato_4), 0),
        this.datos.reduce((total, dato) => total + parseInt(dato.estrato_5), 0),
        this.datos.reduce((total, dato) => total + parseInt(dato.estrato_6), 0),
      ];

      this.graficoEstrato = new Chart(ctx, {
        type: "bar",
        data: {
          labels: estratoLabels,
          datasets: [
            {
              label: "Estrato",
              data: estratoData,
              backgroundColor: [
                "rgb(75, 192, 192)",
                "rgb(153, 102, 255)",
                "rgb(255, 159, 64)",
                "rgb(255, 99, 132)",
                "rgb(54, 162, 235)",
                "rgb(255, 205, 86)",
              ],
              hoverOffset: 4,
            },
          ],
        },
        options: {
          responsive: true,
        },
      });
    },
    renderGraphPeriodos() {
      const ctx = document.getElementById("graficoPeriodos").getContext("2d");

      const totalPorPeriodo = this.calcularTotalPorPeriodo();
      const periodos = Object.keys(totalPorPeriodo);
      const totales = Object.values(totalPorPeriodo);

      console.log(periodos)
      this.graficoPeriodos = new Chart(ctx, {
        type: "line",
        data: {
          labels: periodos,
          datasets: [
            {
              label: "Total matriculados",
              data: totales,
              backgroundColor: "rgba(54, 162, 235, 0.6)",
              borderColor: "rgba(54, 162, 235, 1)",
              borderWidth: 1
            },
          ],
        },
        options: {
          responsive: true,
        }
      });
    },
    filtrarDatos() {
      if (this.datosAux.length > 0) {
        this.datos = this.datosAux;
      }

      // Obtener los valores seleccionados
      const periodoSeleccionado = this.periodo;
      this.selectPeriodo = periodoSeleccionado;
      console.log("datos: " + periodoSeleccionado);
      // Filtrar los datos de la tabla según los valores seleccionados

      const datosFiltrados = this.datos.filter((dato) => {
        // Verificar si hay un valor seleccionado para cada filtro
        const filtroPeriodo =
          !periodoSeleccionado || dato.periodo === periodoSeleccionado;

        // Retornar true si todos los filtros coinciden, de lo contrario false
        return filtroPeriodo;
      });

      // Actualizar los datos de la tabla con los datos filtrados
      this.datosAux = this.datos;
      this.datos = datosFiltrados;
      console.log(datosFiltrados);
      this.renderGraphEstratos();
      this.renderGraphGender();
      this.totales();
    },
  },
  mounted() {
    this.loadData();
  },
};
</script>

<template>
  <BreadCrumb modulo="Datos" accion="Graficas" />

  <div class="grid grid-cols-3 gap-4 my-2 text-gray-700">
    <div>
      <div class="">
        <h2 class="mb-1 text-4xl font-bold dark:text-black">
          Listado de datos
        </h2>

        <h5 class="mb-1 text-xl font-medium leading-tight">
          Total matriculados: {{ this.totalMatriculados.toLocaleString() }}
        </h5>
        <h6
          class="mb-2 text-base font-medium leading-tight text-surface/75 dark:text-neutral-300"
        >
          Por genero: {{ this.totalHombres.toLocaleString() }} M -
          {{ this.totalMujeres.toLocaleString() }} F
        </h6>
        <h6
          class="mb-2 text-base font-medium leading-tight text-surface/75 dark:text-neutral-300"
        >
          Periodo: {{ this.selectPeriodo }}
        </h6>
      </div>
    </div>

    <div class="flex justify-end">
      <div >
        <select
          @change="filtrarDatos()"
          id="selectPeriodos"
          class="m-3 w-24 text-black"
          v-model="periodo"
        >
          <option class="dark:text-black" disabled value="">Periodos</option>
        </select>

        <button
          @click="resetFiltros()"
          type="button warning"
          class="boton-1 m-2"
        >
          Limpiar
        </button>
      </div>
    </div>
  </div>

  <div class="grid grid-cols-2 gap-2">
    <!-- Each <div> is a single column.
Place some content inside to see the effect. -->
    <div>
      <div
        class="block max-w-[18rem] rounded-lg bg-white text-left text-surface shadow-secondary-1 dark:bg-surface-dark dark:text-white"
      >
        <div class="p-6">
          <h5 class="mb-1 text-xl font-medium leading-tight">
            Estudiantes matriculados
          </h5>
          <h6
            class="mb-2 text-base font-medium leading-tight text-surface/75 dark:text-neutral-300"
          >
            Por genero
          </h6>

          <div class="">
            <canvas id="graficoGenero"></canvas>
          </div>
         
        </div>
      </div>
    </div>

    <div>
      <div
        class="block max-w-[18rem] rounded-lg bg-white text-left text-surface shadow-secondary-1 dark:bg-surface-dark dark:text-white"
      >
        <div class="p-6">
          <h5 class="mb-1 text-xl font-medium leading-tight">
            Estudiantes matriculados
          </h5>
          <h6
            class="mb-2 text-base font-medium leading-tight text-surface/75 dark:text-neutral-300"
          >
            Por Estrato
          </h6>

          <div class="">
            <canvas id="graficoEstrato"></canvas>
          </div>
         
        </div>
      </div>
    
      
      <div
        class="block max-w-[18rem] rounded-lg bg-white text-left text-surface shadow-secondary-1 dark:bg-surface-dark dark:text-white"
      >
        <div class="p-6">
          <h5 class="mb-1 text-xl font-medium leading-tight">
            Estudiantes matriculados
          </h5>
          <h6
            class="mb-2 text-base font-medium leading-tight text-surface/75 dark:text-neutral-300"
          >
            Por Periodo
          </h6>

          <div class="">
            <canvas id="graficoPeriodos"></canvas>
          </div>
         
        </div>
      </div>
    </div>

    <div></div>
  </div>

  <div class="relative overflow-x-auto"></div>
</template>

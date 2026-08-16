import { boot } from 'quasar/wrappers';
import VueApexCharts from 'vue3-apexcharts';

// Registra o componente globalmente como <apexchart>.
// Os componentes de Feedback usam a tag <apexchart> no template; dentro de
// <script setup> o Vue resolve componentes pelo nome da variável importada,
// então o `import VueApexCharts` local não dava match com a tag e os gráficos
// ficavam em branco.
export default boot(({ app }) => {
  app.use(VueApexCharts);
});

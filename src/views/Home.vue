<template>
  <div class="home">
    <h1>Què es la Borsa</h1>
    <p>La Borsa de Treball del CIP FP Batoi és un punt de trobada 
      entre els nostres alumnes i ex-alumnes i
      les empreses que busquen professionals qualificats per a incorporar
      a les seues plantilles.
    </p>
    <h2>Sóc una empresa que busca un professional</h2>
    <p>Per a les empreses oferim una gran bolsa de professionals que
      s'han preparat en el nostre Centre y que pensem que s'adaptaran
      perfectament als seus requeriments.
    </p>
    <p>Una vegada publicada una oferta els aspirants rebren un email
      informant-los i es poden 'apuntar' a la mateixa de forma que
      com empresa podem veure les seues dades i el seu C.V. de manera
      que siga senzill posar-nos en contacte amb els que millor s'adapten a
      les nostres necessitats.
    </p>
    <h2>Sóc un ex-alumne que busque treball</h2>
    <p>Si busques treball l'únic que has de fer és registrar-te en la
      plataforma, indicant els cicles que has fet. Una vegada que el responsable
      de cada cicle els valide tindras accés a totes les ofertes on es 
      demanen persones amb algú dels teus cicles.
    </p>
    <h2>Com comence?</h2>
    <p>El primer pas per a participar en la Borsa, tant si eres empresa 
      com alumne, és <a @click.prevent="$router.push('/register')">
      registrar-te</a> i crear el teu compte. Si ja el tens només 
      t'has de <a @click.prevent="$router.push('/login')">loguejar</a>.
    </p>
    <h2>Privacitat</h2>
    <p>Si participes en aquesta borsa dones la teua conformitat per al tractament de les
      dades personals que introduïsques en els terminis i condicions indicades en la
      <a @click.prevent="$router.push('/privacitat')">política de privacitat</a>.
    </p>
    <h2>Obtindre ajuda</h2>
    <p>En la majoria de pantalles ens apareixerá a la part inferior esquerra
       una icona amb un interrogant que ens obrirà una nova
       finestra en el navegador amb l'ajuda per a eixa pantalla.
    </p>
      <p>També pots trobar un manual on s'explique tot el necessari segons el teu cas:
        <ul>
          <li><a target="_ajudaBorsa" :href="tutorialPage + 'empresa.html'">Manual per a l'empresa</a></li>
          <li><a target="_ajudaBorsa" :href="tutorialPage + 'alumne.html'">Manual per a l'alumne</a></li>
        </ul>
      </p>
    <help-button v-if="helpPage" :page="helpPage"></help-button>
  </div>
</template>

<script>
// @ is an alias to /src
import HelpButton from "@/components/HelpButton";

export default {
  name: "Home",
  components: { HelpButton },
  data: () => ({
    helpPage: "/",
  }),
  computed: {
    tutorialPage() {
      return process.env.VUE_APP_HELP_PAGES + 'tutorials/'
    }
  }
};
</script>

<style scoped>
  .home {
    margin: 10px;
  }
</style>
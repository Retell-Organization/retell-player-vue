<script>
import Vue from 'vue'
// Uncomment import and local "components" registration if library is not registered globally.
// import { RetellPlayerVueSample } from '@/entry.esm';

export default Vue.extend({
  name: 'ServeDev'
})
</script>

<template>
  <div id="app" style="width: 400px; margin: 0 auto;">
    <retell-player
      article-url="https://www.sports.ru/football/1095248415-karpin-o-vozmozhnom-vozvrashhenii-v-spartak-sejchas-v-rostove-chuvstvu.html"
    />
  </div>
</template>

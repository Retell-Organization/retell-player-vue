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
      article-url="https://obi-wan.space/grammys-2021-beyonce-becomes-most-decorated-female-artist/"
    />
  </div>
</template>

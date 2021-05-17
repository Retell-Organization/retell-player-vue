<script>
import Vue from 'vue'
// Uncomment import and local "components" registration if library is not registered globally.
// import { RetellPlayerVueSample } from '@/entry.esm';

export default Vue.extend({
  name: 'ServeDev',
  methods: {
    log (event) {
      console.log(event)
    }
  }
})
</script>

<template>
  <div id="app" style="width: 400px; margin: 0 auto;">
    <retell-player
      article-url="https://dev.retell.cc/2021/04/26/%d1%87%d0%b5%d1%85%d0%b8%d1%8f-%d1%81%d1%82%d0%b0%d0%bb%d0%b0-%d0%b2%d1%82%d0%be%d1%80%d0%be%d0%b9-%d0%b2-%d0%bc%d0%b8%d1%80%d0%b5-%d0%bf%d0%be-%d1%87%d0%b8%d1%81%d0%bb%d1%83-%d1%81%d0%bc%d0%b5%d1%80/"
      @opened="log($event)"
      @start="log($event)"
      @play="log($event)"
      @pause="log($event)"
      @progress="log($event)"
      @end="log($event)"
      @seek="log($event)"
      @next="log($event)"
      @prev="log($event)"
    />
  </div>
</template>

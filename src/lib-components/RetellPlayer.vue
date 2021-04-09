<template>
  <div ref="player" />
</template>

<script>
export default {
  props: {
    articleUrl: { type: String, required: false },
    buttonColor: { type: String, default: '#333333' },
    buttonColorHover: { type: String, default: '#4d4d4d' },
    buttonColorClick: { type: String, default: '#1a1a1a' },
    playerBackground: { type: String, default: 'transparent' },
    borderColor: { type: String, default: 'transparent' },
    borderRadius: { type: Number, default: 8 },
    fontColor: { type: String, default: '#444444' },
    pointerColor: { type: String, default: '#000000' },
    pointerColorHover: { type: String, default: '#000000' },
    pointerColorClick: { type: String, default: '#000000' },
    progressBarColor: { type: String, default: '#e5e5e5' },
    progressBarColorActive: { type: String, default: '#333333' }
  },
  data () {
    return {
      url: ''
    }
  },
  created () {
    this.url = this.articleUrl ? this.articleUrl : window.location.href
  },
  mounted () {
    const queryOptions = makeQuery(options)
    const iframe = document.createElement('iframe')
    const iframeSrc = __WIDGET_URL__ + queryOptions

    iframe.setAttribute('src', iframeSrc)
    iframe.className = 'retell-frame'
    iframe.style.background = 'transparent'
    iframe.style.visibility = 'visible'
    iframe.style.border = '0'
    iframe.style.width = '0'
    iframe.style.height = '0'

    window.addEventListener('message', handlePostMessage, false)

    this.$refs.player.parentNode.insertBefore(iframe, this.$refs.player.previousSibling)
  },
  methods: {
    handlePostMessage(event) {
      if (!event.data.type || !event.data.type.startsWith('Retell')) {
        return
      }
    },
    registerCallback (event, cb, options = null) {
      if (callbacks[event] && typeof cb === 'function') {
        callbacks[event].handler = cb

        if (options) {
          callbacks[event].options = options
        }
      }
    }
  }
}
</script>

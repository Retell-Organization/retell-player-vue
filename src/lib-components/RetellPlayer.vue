<template>
  <div ref="player" />
</template>

<script>
import {
  makeQuery,
  validateOptions,
  dispatchPostMessage,
  transformEvent,
  WidgetTypes
} from '../utils'

const __WIDGET_URL__ = 'https://widget.retell.cc/index.html'

const callbacks = [
  'opened',
  'start',
  'play',
  'pause',
  'progress',
  'end',
  'seek',
  'next',
  'prev'
]

export default {
  props: {
    rate: { type: Number, default: 1 },
    widget: {
      type: String,
      default: 'minimal',
      validator (value) {
        return WidgetTypes.includes(value)
      }
    },
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
    progressBarColorActive: { type: String, default: '#333333' },
    progressMarks: {
      type: Array,
      default: () => ([15, 25, 50, 75, 95]),
      validator (values) {
        return values
          .filter((value) => typeof value === 'number')
          .length === values.length
      }
    }
  },
  data () {
    return {
      url: ''
    }
  },
  computed: {
    options () {
      const options = {
        rate: this.rate,
        url: this.articleUrl,
        type: 'article',
        widget: this.widget,
        theme: {
          buttonColor: this.buttonColor,
          buttonColorHover: this.buttonColorHover,
          buttonColorClick: this.buttonColorClick,
          playerBackground: this.playerBackground,
          borderColor: this.borderColor,
          borderRadius: this.borderRadius,
          fontColor: this.fontColor,
          pointerColor: this.pointerColor,
          pointerColorHover: this.pointerColorHover,
          pointerColorClick: this.pointerColorClick,
          progressBarColor: this.progressBarColor,
          progressBarColorActive: this.progressBarColorActive
        }
      }
      return validateOptions(options)
    }
  },
  created () {
    this.url = this.articleUrl || window.location.href
  },
  mounted () {
    const queryOptions = makeQuery(this.options)
    const iframe = document.createElement('iframe')
    const iframeSrc = __WIDGET_URL__ + queryOptions

    iframe.setAttribute('src', iframeSrc)
    iframe.className = 'retell-frame'
    iframe.style.background = 'transparent'
    iframe.style.visibility = 'visible'
    iframe.style.border = '0'
    iframe.style.width = '0'
    iframe.style.height = '0'

    window.addEventListener('message', this.handlePostMessage, false)

    this.$refs.player.parentNode.insertBefore(iframe, this.$refs.player.previousSibling)
  },
  methods: {
    openIframe (height = 60) {
      // TODO this would be different for floating player etc

      const iframes = document.querySelectorAll('iframe.retell-frame')
      iframes.forEach((iframe) => {
        iframe.style.width = '100%'
        iframe.style.height = `${height}px`
      })
    },
    handlePostMessage (event) {
      if (!event.data.type || !event.data.type.startsWith('Retell')) {
        return
      }

      const data = transformEvent(event.data)

      switch (data.type) {
        case 'widgeterror':
          if (window.parent && window.parent !== window) {
            dispatchPostMessage({
              type: 'RetellWidgetError'
            })
          }
          break

        case 'widgetready':
          this.openIframe()
          this.$emit('opened', data)

          if (window.parent && window.parent !== window) {
            dispatchPostMessage({
              type: 'RetellWidgetReady'
            })
          }

          break

        case 'progress':
          if (this.progressMarks.includes(data.data.progress)) {
            this.$emit('progress', data)
          }
          break

        default:
          if (callbacks.includes(data.type)) {
            this.$emit(data.type, data)
          }
          break
      }
    }
  }
}
</script>

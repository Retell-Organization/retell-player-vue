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
    buttonColor: { type: String, default: null },
    buttonColorHover: { type: String, default: null },
    buttonColorClick: { type: String, default: null },
    backgroundColor: { type: String, default: null },
    border: { type: String, default: null },
    borderRadius: { type: Number, default: null },
    buttonSize: { type: Number, default: null },
    buttonSizeClick: { type: Number, default: null },
    buttonSizeHover: { type: Number, default: null },
    fontColor: { type: String, default: null },
    fontFamily: { type: String, default: null },
    pointerColor: { type: String, default: null },
    pointerColorClick: { type: String, default: null },
    pointerColorHover: { type: String, default: null },
    pointerSize: { type: Number, default: null },
    pointerSizeClick: { type: Number, default: null },
    pointerSizeHover: { type: Number, default: null },
    progressBarColor: { type: String, default: null },
    progressBarColorActive: { type: String, default: null },
    progressBarColorHover: { type: String, default: null },
    progressBarThickness: { type: Number, default: null },
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
      url: '',
      widgetParams: {
        minimal: {
          height: 60
        },
        schkulev: {
          height: 32
        },
        sports: {
          height: 48
        },
        superminimal: {
          height: 34
        },
        vzglyadMobile: {
          height: 42
        }
      }
    }
  },
  computed: {
    options () {
      const theme = {}
      const themeKeys = [
        'backgroundColor',
        'border',
        'borderRadius',
        'buttonColor',
        'buttonColorClick',
        'buttonColorHover',
        'buttonSize',
        'buttonSizeClick',
        'buttonSizeHover',
        'fontColor',
        'fontFamily',
        'pointerColor',
        'pointerColorClick',
        'pointerColorHover',
        'pointerSize',
        'pointerSizeClick',
        'pointerSizeHover',
        'progressBarColor',
        'progressBarColorActive',
        'progressBarColorHover',
        'progressBarThickness'
      ]

      themeKeys.forEach(key => this[key] && (theme[key] = this[key]))

      const options = {
        rate: this.rate,
        url: this.articleUrl,
        type: 'article',
        widget: this.widget,
        theme
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
          this.openIframe(this.widgetParams[this.widget].height)
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

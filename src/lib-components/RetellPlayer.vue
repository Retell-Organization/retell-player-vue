<template>
  <div v-if="!loading && !error" :style="cssProps" class="retell_player">
    <audio ref="player" :src="article.audio" @timeupdate="timeupdateHandler"/>
    <div class="retell_player__control" @click="togglePlayer()">
      <slot v-if="!isPlaying" name="pauseIcon">
        <svg width="30" height="30" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="30" cy="30" r="29" stroke-width="2" />
          <path
            d="M42.5 31.0199C43.1667 30.635 43.1667 29.6727 42.5 29.2878L24.7308 19.0287C24.0641 18.6438 23.2308 19.125 23.2308 19.8948L23.2308 40.4129C23.2308 41.1827 24.0641 41.6638 24.7308 41.2789L42.5 31.0199Z" />
        </svg>
      </slot>
      <slot v-else name="playIcon">
        <svg width="30" height="30" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="30" cy="30" r="29" stroke-width="2" />
          <rect y="21" x="23" width="4.5" height="18" />
          <rect y="21" x="33.8003" width="4.5" height="18" />
        </svg>
      </slot>
    </div>
    <div class="retell_player__container">
      <div class="retell_player__title">{{ article.title }}</div>
      <div
        class="retell_player__progress"
        @mouseleave="hovered = 0"
        @mousemove="onProgressBarHover"
        @click.prevent="onProgressBarClick"
      >
        <div ref="track" class="retell_player__progress--bar">
          <div class="retell_player__progress--active" :style="{width: `${progress}%`}">
            <div class="retell_player__progress--pointer" />
          </div>
          <div class="retell_player__progress--hovered" :style="{width: `${hovered}%`}" />
        </div>
      </div>
      <div class="retell_player__info">
        <div class="retell_player__time">{{ formatDuration(currentTime) }}</div>
        <a :href="retellLink" target="_blank" class="retell_player__powered">
          Powered by Retell
        </a>
      </div>
    </div>
  </div>
</template>

<script>
import GateApi from '@/api/gate'
import Api from '@/api/api'
import { makeid, formatDuration, getRetellLink, getRelativeX } from '@/utils'

export default {
  name: 'RetellPlayer',
  props: {
    articleUrl: { type: String, required: false },
    buttonColor: { type: String, default: '#333333' },
    buttonColorHover: { type: String, default: '#4d4d4d' },
    buttonColorClick: { type: String, default: '#1a1a1a' },
    playerBackground: { type: String, default: 'transparent' },
    borderColor: { type: String, default: 'transparent' },
    borderRadius: { type: Number, default: 0 },
    fontColor: { type: String, default: '#444444' }
  },
  data () {
    return {
      url: null,
      loading: true,
      error: false,
      isPlaying: false,
      deviceType: null,
      progress: 0,
      currentTime: 0,
      hovered: 60,
      article: {
        title: null,
        audio: null,
        duration: null,
        url: null,
        vim: [],
        id: null
      }
    }
  },
  computed: {
    cssProps () {
      return {
        '--button-color': this.buttonColor,
        '--button-color-hover': this.buttonColorHover,
        '--button-color-click': this.buttonColorClick,
        '--player-background': this.playerBackground,
        '--border-color': this.borderColor,
        '--border-radius': this.borderRadius,
        '--font-color': this.fontColor
      }
    },
    retellLink () {
      return getRetellLink({
        url: window.location.href,
        source: this.deviceType
      })
    }
  },
  created () {
    this.url = this.articleUrl ? this.articleUrl : window.location.href
    // TODO: Detect deviceType
    this.deviceType = 'desktop'

    this.fetchArticle()
  },
  methods: {
    fetchArticle () {
      this.loading = true
      const wstoken = makeid()

      return GateApi.check(this.url, this.deviceType)
        .then(() => {
          return Api.fetchAudio(this.url, wstoken)
        })
        .then((article) => {
          this.article = article
          this.loading = false
        })
        .catch((e) => {
          this.error = true
          this.loading = false
        })
    },
    togglePlayer () {
      this.isPlaying ? this.pause() : this.play()
    },
    seek (progress) {
      const second = (this.$refs.player.duration / 100) * progress
      this.currentTime = second
      this.progress = progress
      this.$refs.player.currentTime = this.currentTime
    },
    play () {
      this.$refs.player.play()
      this.isPlaying = true
    },
    pause () {
      this.$refs.player.pause()
      this.isPlaying = false
    },
    timeupdateHandler (event) {
      const progress = event.target.currentTime / event.target.duration * 100
      this.currentTime = event.target.currentTime
      this.progress = progress

      if (event.target.currentTime === event.target.duration) { this.pause() }
    },
    onProgressBarHover (event) {
      this.hovered = getRelativeX(this.$refs.track, event)
    },
    onProgressBarClick (event) {
      const progress = getRelativeX(this.$refs.track, event)
      this.seek(progress)
    },
    formatDuration
  }
}
</script>

<style>
body {
  font-family: "Roboto", sans-serif;
}

.retell_player {
  display: flex;
  align-items: center;
  justify-content: left;
  padding: 8px 12px;
  background-color: var(--player-background);
  border: 1px solid var(--border-color);
  border-radius: calc(var(--border-radius) * 1px);
}

.retell_player__control {
  cursor: pointer;
  padding-right: 10px;
}

.retell_player__control svg path,
.retell_player__control svg g,
.retell_player__control svg rect{
  fill: var(--button-color);
}

.retell_player__control svg circle {
  stroke: var(--button-color);
}

.retell_player__control:hover svg path,
.retell_player__control:hover svg g,
.retell_player__control:hover svg rect{
  fill: var(--button-color-hover);
}

.pretell_layer__control:hover svg circle {
  stroke: var(--button-color-hover);
}

.retell_player__control:active svg path,
.retell_player__control:active svg g,
.retell_player__control:active svg rect{
  fill: var(--button-color-click);
}

.retell_player__control:active svg circle {
  stroke: var(--button-color-click);
}

.retell_player__container {
  width: calc(100% - 40px);
}

.retell_player__title {
  max-width: 60%;
  overflow: hidden;
  text-overflow: ellipsis;
  font-size: 11px;
  color: var(--font-color);;
  white-space: nowrap;
}

.retell_player__info {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.retell_player__progress {
  padding: 5px 0;
  cursor: pointer;
}

.retell_player__progress--bar {
  position: relative;
  width: 100%;
  height: 4px;
  background: #e5e5e5;
  border-radius: 16px;
  cursor: pointer;
}

.retell_player__progress--active {
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  height: 4px;
  width: 0;
  border-radius: 16px;
  background: #333;
}

.retell_player__progress--hovered {
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  height: 4px;
  width: 0;
  border-radius: 16px;
  background: #ffffff;
  opacity: 0.2;
}

.retell_player__progress--pointer {
  position: absolute;
  top: 50%;
  right: 0;
  transform: translate(50%, -50%);
  width: 8px;
  height: 8px;
  background: #000;
  border-radius: 50%!important;
  cursor: pointer;
  box-shadow: 0 4px 10px rgb(0 0 0 / 25%);
  z-index: 1;
}

.retell_player__time {
  font-size: 11px;
  color: #444;
}

.retell_player__powered {
  font-size: 10px;
  opacity: 0;
  color: #c4c4c4;
  outline: none!important;
  text-decoration: none!important;
  transition: all .25s cubic-bezier(0.165, 0.84, 0.44, 1);
  line-height: 14px;
  white-space: nowrap;
}

.retell_player__powered:hover {
  color: #ababab;
}

.retell_player:hover .retell_player__powered {
  opacity: 1;
}
</style>

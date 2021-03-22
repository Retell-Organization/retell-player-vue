<template>
  <div v-if="!loading && !error" :style="cssProps" class="player">
    <audio ref="player" :src="article.audio" @timeupdate="timeupdateHandler"/>
    <div class="player__control" @click="togglePlayer()">
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
    <div class="player__container">
      <div class="player__title">{{ article.title }}</div>
      <div
        class="player__progress"
        @mouseleave="hovered = 0"
        @mousemove="onProgressBarHover"
        @click.prevent="onProgressBarClick"
      >
        <div ref="track" class="player__progress--bar">
          <div class="player__progress--active" :style="{width: `${progress}%`}">
            <div class="player__progress--pointer" />
          </div>
          <div class="player__progress--hovered" :style="{width: `${hovered}%`}" />
        </div>
      </div>
      <div class="player__info">
        <div class="player__time">{{ formatDuration(currentTime) }}</div>
        <a :href="retellLink" target="_blank" class="player__powered">
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
    buttonColorClick: { type: String, default: '#1a1a1a' }
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
        '--button-color-click': this.buttonColorClick
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

.player {
  display: flex;
  align-items: center;
  justify-content: left;
  padding: 20px 0;
}

.player__control {
  cursor: pointer;
  padding-right: 10px;
}

.player__control svg path,
.player__control svg g,
.player__control svg rect{
  fill: var(--button-color);
}

.player__control svg circle {
  stroke: var(--button-color);
}

.player__control:hover svg path,
.player__control:hover svg g,
.player__control:hover svg rect{
  fill: var(--button-color-hover);
}

.player__control:hover svg circle {
  stroke: var(--button-color-hover);
}

.player__control:active svg path,
.player__control:active svg g,
.player__control:active svg rect{
  fill: var(--button-color-click);
}

.player__control:active svg circle {
  stroke: var(--button-color-click);
}

.player__container {
  width: 100%;
}

.player__title {
  max-width: 60%;
  overflow: hidden;
  text-overflow: ellipsis;
  font-size: 11px;
  color: #444444;
  white-space: nowrap;
}

.player__info {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.player__progress {
  padding: 5px 0;
  cursor: pointer;
}

.player__progress--bar {
  position: relative;
  width: 100%;
  height: 4px;
  background: #e5e5e5;
  border-radius: 16px;
  cursor: pointer;
}

.player__progress--active {
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  height: 4px;
  width: 0;
  border-radius: 16px;
  background: #333;
}

.player__progress--hovered {
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

.player__progress--pointer {
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

.player__time {
  font-size: 11px;
  color: #444;
}

.player__powered {
  font-size: 10px;
  opacity: 0;
  color: #c4c4c4;
  outline: none!important;
  text-decoration: none!important;
  transition: all .25s cubic-bezier(0.165, 0.84, 0.44, 1);
  line-height: 14px;
  white-space: nowrap;
}

.player__powered:hover {
  color: #ababab;
}

.player:hover .player__powered {
  opacity: 1;
}
</style>

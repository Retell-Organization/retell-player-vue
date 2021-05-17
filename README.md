# Retell Player Vue

Vue component of Audio Player for [Retell](https://retell.cc)

## Installation

```bash
npm install @retell/retell-vue-player
```

Install the plugin into Vue:

```javascript
import Vue from 'vue'
import RetellPlayer from '@retell/retell-vue-player'

Vue.use(RetellPlayer)
```

## Usage

```vue
<template>
    <retell-player />
</template>
```

You can specify the `articleUrl` to create a player with the custom article at any place, if `articleUrl` not specified, by default will be used a current page URL

```vue
<template>
    <retell-player articleUrl="ABSOLUTE_LINK_TO_THE_ARTICLE" />
</template>
```

### SSR Example

```vue
<template>
    <client-only>
        <retell-player />
    </client-only>
</template>
```

## Props

| Name                   | Type             | Default              | Variants              |
| ---------------------- | ---------------- | -------------------- | --------------------- |
| articleUrl             | String           | Current page URL     |                       |
| rate                   | Number           | 1                    |                       |
| widget                 | String           | minimal              | minimal, superminimal |
| progressMarks          | Array of Numbers | [15, 25, 50, 75, 95] |                       |
| fontColor              | String           | #444444              |                       |
| buttonColor            | String           | #333333              |                       |
| buttonColorHover       | String           | #4d4d4d              |                       |
| buttonColorClick       | String           | #1a1a1a              |                       |
| playerBackground       | String           | transparent          |                       |
| borderColor            | String           | transparent          |                       |
| borderRadius           | Number           | 8                    |                       |
| pointerColor           | String           | #000000              |                       |
| pointerColorHover      | String           | #000000              |                       |
| pointerColorClick      | String           | #000000              |                       |
| progressBarColor       | String           | #e5e5e5              |                       |
| progressBarColorActive | String           | #333333              |                       |

## Events

| Event     | Meaning                                  |
| --------- | ---------------------------------------- |
| opened    | the widget received audio and opened     |
| start     | start of the first audio recording       |
| play      | repeated clicks on the play button       |
| pause     | pressing the Pause button                |
| end       | end of audio                             |
| seek      | rewinding                                |
| next      | go to the next audio in the playlist     |
| prev      | go to the previous audio in the playlist |
| progress* | listening progress                       |

**The progress event requires additional options; in the progressMarks field, an array must be passed with the marks at which the event should be sent. Integer multiples of 5 are supported.*

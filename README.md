# Retell Player Vue

Vue component of Audio Player for [Retell](https://retell.cc)

## Installation
```bash
npm install @retell-organization/retell-player-vue
```

Install the plugin into Vue:
```javascript
import Vue from 'vue'
import RetellPlayer from '@retell-organization/retell-player-vue'

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
    <retell-player articleUrl="ABSOLUTE_LINK_TO_ARTICLE" />
</template>
```


## Props
Coming soon



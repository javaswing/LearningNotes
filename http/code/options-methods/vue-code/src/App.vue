<template>
  <div id="app">
    <img alt="Vue logo" src="./assets/logo.png">
    <button @click="handleClick">发送请求</button>
  </div>
</template>

<script>
import { getList } from '@/api'
export default {
  name: 'App',
  components: {
  },
  methods: {
    async handleClick () {
      getList()
    }
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>

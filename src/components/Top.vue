<template>
  <v-app-bar app clipped-left dense>
    <v-btn :to="{path: '/'}" icon>
      <v-icon>mdi-home</v-icon>
    </v-btn>
    <span class="title">Ятѣ.<span class="font-weight-light">Kошелёк</span></span>
    <v-spacer></v-spacer>
    <v-btn :to="{path: '/help'}" icon>
      <v-icon>mdi-help-circle</v-icon>
    </v-btn>
  </v-app-bar>
</template>

<script>

export default {
  name: 'Top',

  data: () => ({})
}
</script>
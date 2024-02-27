<template>
  <v-bottom-navigation app>
    <v-btn :to="{path: '/contacts'}">
      <v-icon style="font-size: 25px">mdi-account-multiple</v-icon>
    </v-btn>
    <v-btn :to="{path: '/tx'}">
      <i class="fa-solid fa-right-left" style="font-size: 30px"></i>
    </v-btn>
    <v-btn :to="{path: '/qr'}">
      <v-icon class="text-h3">mdi-qrcode-scan</v-icon>
    </v-btn>
    <v-btn
      :to="{path: '/global'}">
      <i class="fa-solid fa-globe" style="font-size: 30px"></i>
    </v-btn>
    <v-btn :to="{path: '/settings'}">
      <v-icon style="font-size: 25px">mdi-account-cog</v-icon>
    </v-btn>
  </v-bottom-navigation>
</template>

<script>

export default {
  name: 'Bottom',

  data: () => ({
    
  }),
  computed : {
  },
  
}
</script>
<template>
    <div style="width:100%">
      <h1>Вложить</h1>
      <v-card v-for="user in users" :key="user.addr" style="margin-bottom: 2.5vh;">
        <v-img :src="user.cover" cover></v-img>
        <v-card-title>{{ user.name }}</v-card-title>
        <!--<v-card-subtitle>1,000 miles of wonder</v-card-subtitle>-->
        <v-card-actions>
          <v-btn color="secondary" rounded="pill" variant="contained-text" :to="{ name: 'user', params: { id: user.addr } }">Подписаться</v-btn>
          <v-spacer></v-spacer>
          <v-btn :icon="show[user.addr] ? 'mdi-chevron-up' : 'mdi-chevron-down'" @click="sh(user.addr)"></v-btn>
        </v-card-actions>
        <v-expand-transition>
          <div v-show="show[user.addr]">
            <v-divider></v-divider>
            <v-card-text class="raw_txt" v-html="user.desc"></v-card-text>
          </div>
        </v-expand-transition>
      </v-card>
    </div>
</template>

<script>
import ky from 'ky'

export default {
  name: 'Put',
  data: () => ({
    show: [],
    users: []
  }),
  async mounted () {
    this.users = await ky.get(import.meta.env.VITE_REST_SERVER + 'users').json()
  },
  methods: {
    sh (addr) {
      this.show[addr] = !this.show[addr]
    }
  }
}
</script>
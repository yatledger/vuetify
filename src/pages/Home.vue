<template>
  <div align="center" justify="center" style="margin-top: 10vh;">
    <notifications position="top center" width="100%" />
    <h1 :style="bStyles">{{ balance }} ѣ</h1>
    <div class="d-flex" style="margin-bottom: 4vh;">
      <v-btn :to="{path: '/get'}">получить</v-btn>
      <v-spacer></v-spacer>
      <v-btn :to="{path: '/put'}">вложить</v-btn>
    </div>
    <figure class="qrcode">
      <vue-qrcode 
      :value=url
      :options="{
        width: 250,
        color: {
          dark: '#3e007a',
          light: '#ffffff',
        },
        // version: 2,
        errorCorrectionLevel: 'M'
      }"
      ></vue-qrcode>
      <img
        class="qrcode__image"
        src="../assets/icon-qr.png"
      />
    </figure>
    <br /><br />
    <v-btn elevation="2" @click="refresh" icon><v-icon>mdi-refresh</v-icon></v-btn>&nbsp;
    <v-btn elevation="2" @click="copy" icon><v-icon>mdi-content-copy</v-icon></v-btn>&nbsp;
    <v-btn elevation="2" :href="tg" icon><i class="fa-brands fa-telegram" style="font-size:25px"></i></v-btn>&nbsp;
  </div>
</template>

<script>
// @ is an alias to /src
export default {
  name: 'Home',
  data: () => ({
    
  }),
  computed: {
    pub () {
      return this.$store.state.pub;
    },
    url () {
      return import.meta.env.VITE_HTTP_SERVER + 'user/' + this.pub;
    },
    balance () {
      return this.$store.state.balance
    },
    tg () {
      return `tg://msg_url?url=${this.url}&text=Отправь мне Ятѣ`;
    },
    bStyles () {
      return {'font-size': this.$store.state.size + 'vh'};
    }
  },
  async mounted () {
    if (this.pub) {
      const rest = import.meta.env.VITE_REST_SERVER + 'balance/' + this.pub;
      let b = 0;
      let s = 0;
      [b, s] = await this.$fetch.balance(rest);
      this.$store.commit('setbal', b);
      this.$store.commit('setsize', s);
    }
  },
  methods: {
    async refresh () {
      const rest = import.meta.env.VITE_REST_SERVER + 'balance/' + this.pub;
      let b = 0;
      let s = 0;
      [b, s] = await this.$fetch.balance(rest);
      this.$store.commit('setbal', b);
      this.$store.commit('setsize', s);
    },
    copy () {
      this.$copyText(this.url).then( (e) => {
        this.$notify({ text: "Адрес скопирован", type: 'success'});
      }, (e) => {
        this.$notify({ text: "Не могу скопировать адрес", type: 'warn'});
      })
    }
  }
}
</script>

<style scoped>
.qrcode {
  display: inline-block;
  font-size: 0;
  margin-bottom: 0;
  position: relative;
}

.qrcode__image {
  height: 48px;
  left: 50%;
  overflow: hidden;
  position: absolute;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 48px;
}
</style>
<template>
  <v-app>
    <Top />
    <v-main> 
      <v-container class="d-flex justify-center align-center fill-height" fluid>
      <router-view v-slot="{ Component }" :key="$route.fullPath">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
      </v-container>
    </v-main>
    <Bottom />
  </v-app>
</template>

<script>
  import Top from './components/Top.vue';
  import Bottom from './components/Bottom.vue';
  import Home from './pages/Home.vue';

  export default {
    name: 'App',
    data () {
      return {
        seed: null,
        sec: null,
        pub: null
    }},
    async created () {
      /* if old member - gen seed from sec */
      this.sec = await this.$db.get('settings', 'sec')
      if (this.sec !== undefined || typeof this.sec !== 'undefined') {
        this.seed = await this.$db.get('settings', 'seed')
        if (this.seed === undefined || typeof this.seed === 'undefined') {
          this.seed = this.sec.substr(0, 64)
          this.$db.set('settings', 'seed', this.seed)
          this.$store.commit('setseed', this.seed)
        }
        this.pub = await this.$db.get('settings', 'pub')
        console.log(`using an existing private key`)
      } else {
        console.log('private key generation')
        this.seed = await this.$crypt.genKey();
        [this.sec, this.pub] = await this.$crypt.recKey(this.seed)
        this.$db.set('settings', 'seed', this.seed)
        this.$db.set('settings', 'sec', this.sec)
        this.$db.set('settings', 'pub', this.pub)
      };
      this.$store.commit('setseed', this.seed);
      this.$store.commit('setsec', this.sec);
      this.$store.commit('setpub', this.pub);
      const rest = import.meta.env.VITE_REST_SERVER + 'balance/' + this.pub;
      let b = 0;
      let s = 0;
      [b, s] = await this.$fetch.balance(rest);
      this.$store.commit('setbal', b);
      this.$store.commit('setsize', s);
    },
    async mounted () {

    },
    components: { Top, Bottom, Home },
    
    data: () => ({
      
    }),
  }
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Roboto+Slab&display=swap');
.fade-enter-active,
.fade-leave-active { 
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
h1 {font-family: 'Roboto Slab', serif; font-size: 30px; font-weight: normal; margin-bottom: 1vh}
h2 {font-family: 'Roboto Slab', serif; font-size: 25px; font-weight: normal; margin-bottom: 1vh}
h2 {font-family: 'Roboto Slab', serif; font-size: 20px; font-weight: normal; margin-bottom: 1vh}
p {font-family: 'Roboto Slab', serif; font-size: 15px; font-weight: normal; margin-bottom: 0.5vh; line-height: 20px;}
a {color: #ac5de7; text-decoration: underline;}
p, li {margin-bottom: 10px;}
ul {list-style: none;}
img {max-width: 100%}
.raw_txt{white-space: pre-line; word-wrap: break-word;}
</style>

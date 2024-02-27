<template>
	<div style="width:100%">
		<notifications position="top center" width="100%" />
		<div>
			<h1 v-if="name">{{ name }}</h1>
			<img :src="cover" style="max-width: 100%;" />
			<p v-if="desc" class="raw_txt" v-html="desc"></p>
		</div>
		<h1>Настройки</h1>
		<v-text-field
			v-model="name"
      label="Имя"
      placeholder="На балансе должно быть более 100ѣ"
      variant="underlined"
    ></v-text-field>
		<v-file-input
      :rules="rules"
      v-model="file"
      show-size
      accept="image/png, image/jpeg"
      placeholder="Pick a cover"
      prepend-icon="mdi-camera"
      label="Добавьте обложку (500ѣ)"
      hint="На балансе должно быть более 500ѣ"
      @change="i2b"
	  ></v-file-input>
	  	<v-textarea auto-grow label="Описание" v-model="desc" no-resize outlined hint="Для хранения описания держите на балансе более 250ѣ"></v-textarea>
	  	<div class="d-flex"><v-btn @click="save">сохранить</v-btn></div>
	  	<br />
	  	<p class="text-purple-lighten-2"><small>
	  		<v-icon>mdi-exclamation-thick</v-icon>
	  		Для тюнинга страницы ваш баланс должен быть положительным: 100ѣ публикация имени; 250ѣ внесение описания; 500ѣ размещение обложки. Сумма не снимается, а хранится в качестве депозита.<br />
	  		«Секретный ключ» — это ваше всё!!! В случае утери, восстановить его не получиться!! Внимательно позаботьтесь о его сохранности перед тем, как начать активно пользоваться Ятѣ!
	  	</small></p>
        <h2>Секретный ключ 
        <v-icon @click="gen">mdi-refresh</v-icon>&nbsp;
        <v-icon @click="copySec">mdi-content-copy</v-icon></h2>
        <v-textarea rows="4" v-model="seed" no-resize outlined hint="Вставьте существующий ключ, оставьте этот или сгенерируйте новый"></v-textarea>
	    <h2>Адрес:</h2>
	    <p>{{ pub }} <v-icon @click="copyPub">mdi-content-copy</v-icon></p>
	</div>
</template>
<script>
import ky from 'ky'
export default {
  name: 'Settings',
  data: () => ({
    rules: [
      value => {
        return !value || !value.length || value[0].size < 2000000 || 'Размер обложки не должен превышать 2 MB!'
      }
    ],
    name: '',
    desc: '',
    file: [],
    cover: '',
    info: []
  }),
  computed: {
    seed: {
      get () {
        return this.$store.state.seed
      },
      async set (seed) {
        const [sec, pub] = await this.$crypt.recKey(seed)
        if (seed.length > 64) {
          seed = seed.substr(0, 64) // legacy
        }
        this.$db.set('settings', 'seed', seed)
        this.$db.set('settings', 'pub', pub)
        this.$db.set('settings', 'sec', sec)
        this.$store.commit('setseed', seed)
        this.$store.commit('setsec', sec)
        this.$store.commit('setpub', pub)
      }
    },
    pub () {
      return this.$store.state.pub
    },
    sec () {
      return this.$store.state.sec
    }
  },
  async mounted () {
    if (this.pub) { this.info = await ky.get(import.meta.env.VITE_REST_SERVER + 'user/' + this.pub).json() }
    if (this.info) {
      if (this.info.name) { this.name = this.info.name }
      if (this.info.desc) { this.desc = this.info.desc }
      if (this.info.cover) { this.cover = this.info.cover }
    }
  },
  methods: {
    async gen () {
      const seed = await this.$crypt.genKey()
      const [sec, pub] = await this.$crypt.recKey(seed)
      this.$db.set('settings', 'seed', seed)
      this.$db.set('settings', 'sec', sec)
      this.$db.set('settings', 'pub', pub)
      this.$store.commit('setseed', seed)
      this.$store.commit('setsec', sec)
      this.$store.commit('setpub', pub)
    },
    copySec () {
      this.$copyText(this.seed).then((e) => {
        this.$notify({ text: 'Секретный ключ скопирован!', type: 'success' })
      }, (e) => {
        this.$notify({ text: 'Не могу скопировать секретный ключ', type: 'warn' })
      })
    },
    copyPub () {
      this.$copyText(this.pub).then((e) => {
        this.$notify({ text: 'Публичный ключ скопирован!', type: 'success' })
      }, (e) => {
        this.$notify({ text: 'Не могу скопировать публичный ключ', type: 'warn' })
      })
    },
    i2b () {
      const reader = new FileReader()
      reader.readAsDataURL(this.file[0])
      reader.onload = () => {
        this.cover = reader.result
      }
    },
    async send (q) {
      try {
        const re = await ky.post(import.meta.env.VITE_REST_SERVER + 'user/', { json: q })
        if (!re.ok) {
          throw new HTTPError(`Fetch error: ${re.statusText}`)
        } else {
          const response = await re.json()
          if (response.detail[0].success === 1) {
            this.$notify({ text: response.detail[0].msg, type: 'success' })
          } else {
            this.$notify({ text: response.detail[0].msg, type: 'warn' })
          }
        }
      } catch (e) {
        console.error(e)
      }
    },
    async save () {
      const q = {
        addr: this.pub,
        req: '',
        time: Date.now(),
        content: '',
        sign: ''
      }
      if (!this.name && !this.desc && !this.cover) {
        this.$notify({ text: 'Пусто!', type: 'warn' })
      }
      if (this.name) {
        q.req = 'name'
        q.content = this.name
        q.sign = this.$crypt.sign(this.name, this.sec)
        await this.send(q)
      }
      if (this.desc) {
        q.req = 'desc'
        q.content = this.desc
        q.sign = this.$crypt.sign(this.desc, this.sec)
        await this.send(q)
      }
      if (this.cover) {
        q.req = 'cover'
        q.content = this.cover
        q.sign = this.$crypt.sign(this.cover, this.sec)
        await this.send(q)
      }
    }
  }
}
</script>

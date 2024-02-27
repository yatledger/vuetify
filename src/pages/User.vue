<template>
  <div justify="center" align="center" style="width: 100%">
    <notifications position="top center" width="100%" />
    <h1 :style="bStyles">{{ balance }} ѣ</h1>
    <div>
      <h1 v-if="name">{{ name }}</h1>
      <img :src="cover" style="max-width: 100%;" />
      <p v-if="desc" class="raw_txt" v-html="desc"></p>
    </div>
    <v-form style="margin-top: 50px">
        <v-text-field v-model="amount" label="Сумма" type="number"></v-text-field>
        <v-text-field v-model="msg" label="Сообщение" placeholder="Сумма должна быть больше 100ѣ"></v-text-field>
        <v-btn icon @click="add"><v-icon>mdi-account-plus</v-icon></v-btn>&nbsp;
        <v-btn icon @click="send"><v-icon>mdi-send</v-icon></v-btn>
    </v-form>
    <ul style="margin-top: 15px; text-align: left;">
        <li v-for="tx in txs" :key="tx.time">
          <span v-if="tx.credit == to">
            {{ tx.amount }}&nbsp;→&nbsp;<router-link :to="{ name: 'user', params: { id: tx.debit } }">{{ tx.debit.substr(0, 25) }}&hellip;</router-link><span v-if="tx.msg"> ({{ tx.msg }})</span>
          </span>
          <span v-if="tx.debit == to">
            <router-link :to="{ name: 'user', params: { id: tx.credit } }">{{ tx.credit.substr(0, 25) }}&hellip;</router-link>&nbsp;→&nbsp;{{ tx.amount }}<span v-if="tx.msg"> ({{ tx.msg }})</span>
          </span>
        </li>
    </ul>
  </div>
</template>

<script>
import ky from 'ky'

export default {
  name: 'User',
  data () {
    return {
      balance: 0,
      size: 0,
      msg: '',
      txs: [],
      to: null,
      amount: null,
      name: '',
      desc: '',
      cover: '',
      info: []
    }
  },
  computed: {
    sec () {
      return this.$store.state.sec
    },
    pub () {
      return this.$store.state.pub
    },
    bStyles () {
      return { 'font-size': this.size + 'vh' }
    }
  },
  async mounted () {
    this.to = this.$route.params.id;
    [this.balance, this.size] = await this.$fetch.balance(import.meta.env.VITE_REST_SERVER + 'balance/' + this.to)
    this.txs = await ky.get(import.meta.env.VITE_REST_SERVER + 'tx/' + this.to).json()
    this.info = await ky.get(import.meta.env.VITE_REST_SERVER + 'user/' + this.to).json()
    if (this.info) {
      if (this.info.name) { this.name = this.info.name }
      if (this.info.desc) { this.desc = this.info.desc }
      if (this.info.cover) { this.cover = this.info.cover }
    }
  },
  methods: {
    async send () {
      if (this.amount > 0) {
        if (this.msg && this.amount < 100) {
          this.$notify({ text: 'bad amount', type: 'warn' })
          return
        }
        const t = Date.now()
        const m = this.pub + this.to + this.amount.toString() + this.msg + t.toString()

        const q = {
          credit: this.pub, // test wrong name (outcome)
          debit: this.to,
          amount: parseInt(this.amount),
          time: t,
          msg: this.msg,
          sign: this.$crypt.sign(m, this.sec)
        }

        const api = ky.extend({
          hooks: {
            beforeRequest: [
              () => {
                this.amount = null
              }
            ]
          }
        })

        try {
          const re = await api.post(import.meta.env.VITE_REST_SERVER + 'send/', { json: q })
          if (!re.ok) {
            throw new HTTPError(`Fetch error: ${re.statusText}`)
          } else {
            const response = await re.json()
            // console.log(response.detail[0]);
            if (response.detail[0].success === 1) {
              [this.balance, this.size] = await this.$fetch.balance(import.meta.env.VITE_REST_SERVER + 'balance/' + this.to)
              this.$notify({ text: response.detail[0].msg, type: 'success' })
            } else {
              this.$notify({ text: response.detail[0].msg, type: 'warn' })
            }
          }
        } catch (e) {
          console.error(e)
        }
      } else {
        this.$notify({ text: 'no amount', type: 'warn' })
      }
    },
    async add () {
      const n = prompt('Введите имя')
      if (await this.$db.addContact(n, this.to)) {
        this.$notify({ text: 'Добавлен!', type: 'success' })
      }
    }
  }
}
</script>
import { createApp } from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify'
import { loadFonts } from './plugins/webfontloader'
import './registerServiceWorker'

import VueQrcode from '@chenfengyuan/vue-qrcode'
import { DateTime, Interval } from 'luxon'
import VueClipboard from 'vue-clipboard2'

import crypt from './lib/crypt'
import db from './lib/db'
import utils from './lib/utils'
import fetch from './lib/fetch'

import store from './store'
import router from './router'
import Notifications from '@kyvg/vue3-notification'
import blake from 'blakejs'

console.log(blake.blake2bHex('Attack at Dawn'))
// https://github.com/dcposch/blakejs

loadFonts()

const app = createApp(App)

app.config.globalProperties.$dt = DateTime
app.config.globalProperties.$intl = Interval
app.config.globalProperties.$fetch = fetch
app.config.globalProperties.$crypt = crypt
app.config.globalProperties.$db = db
app.config.globalProperties.$utils = utils

app.use(Notifications)
app.use(vuetify)
app.use(VueClipboard)
app.use(store)
app.use(router)
app.component(VueQrcode.name, VueQrcode)
app.mount('#app')
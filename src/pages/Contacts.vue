<template>
    <div justify="center" align="center" style="width: 100%; word-wrap: break-word; overflow: hidden;">
      <notifications position="top center" width="100%" />
      <h1>Контакты</h1>
      <v-card-actions v-for="contact in contacts" :key="contact.id">
        <v-btn :to="{ name: 'user', params: { id: contact.addr } }" variant="text" style="max-width: 80%; overflow: hidden; text-overflow: ellipsis">{{ contact.name }}</v-btn>
        <v-spacer></v-spacer>
        <v-btn @click="rm(contact.id)" icon><v-icon>mdi-delete</v-icon></v-btn>
      </v-card-actions>     

      <v-btn  @click="plus()">
        <v-icon style="font-size: 25px">mdi-account-multiple-plus</v-icon>
      </v-btn>
    </div>
</template>

<script>
export default {
  name: 'Contacts',
  data: () => ({
    contacts: [],
    name : "",
    addr : "",
  }),
  async mounted () {
    this.contacts = await this.$db.getContacts();
  },
  methods:{
    async plus () {
      this.addr = prompt("Введите адрес");
      this.name = prompt("Введите имя");
      if (await this.$db.addContact(this.name, this.addr)) {
        this.$notify({ text: "Добавлен!", type: 'success'});
        this.contacts = await this.$db.getContacts();
      }
    },
    async rm (i) {
      this.$db.delete('contacts', i);
      this.contacts = await this.$db.getContacts();
    }
  },
}
</script>
<template>
  <div>
    <form novalidate class="md-layout" @submit.prevent="validateUser">
      <md-card class="md-layout-item md-size-100 md-small-size-100">
        <md-card-header>
          <div class="md-title">Ingreso de Tweets</div>
          <div class="md-subheading">Ingresa los tweets ofensivos.</div>
          <div class="md-body-1">Copia la URL del Tweet de tu navegador o tu teléfono y
          pegala en este formulario. Toca el botón "Enviar" cuando estés listo. Al guardarse
          el tweet el formulario se limpiará automáticamente para que envies otro.</div>
        </md-card-header>

        <md-card-content>
          <div class="md-layout md-gutter">
            <div class="md-layout-item md-small-size-100">
              <md-field :class="getValidationClass('url')">
                <label for="url">URL del Tweet</label>
                <md-input name="url" id="url" v-model="form.url" :disabled="sending" />
                <span class="md-error" v-if="!$v.form.url.required">Debes ingresar la URL del tweet</span>
                <span class="md-error" v-else-if="!$v.form.url.url">URL inválida</span>
              </md-field>
            </div>

          </div>
        </md-card-content>

        <md-progress-bar md-mode="indeterminate" v-if="sending" />

        <md-card-actions>
          <md-button type="submit" class="md-primary" :disabled="sending">Enviar</md-button>
        </md-card-actions>
      </md-card>

      <md-snackbar :md-active.sync="tweetSaved">¡El tweet ha sido guardado!</md-snackbar>
    </form>
  </div>
</template>

<script>
  const axios = require('axios').default;
  import sha512 from 'crypto-js/sha512'
  import { validationMixin } from 'vuelidate'
  import {
    required,
    url
  } from 'vuelidate/lib/validators'

  export default {
    name: 'StoreTweet',
    mixins: [validationMixin],
    mounted() {
      this.sending = true
      axios
        .get('https://api.reca.bar/sessions/getsalt')
        .then(response => {
          this.salt = response.data
          this.sending = false
        })
    },
    props: ['hash_id'],
    data: () => ({
      form: {
        url: null,
      },
      tweetSaved: false,
      sending: false,
      salt: null,
      lastUser: null
    }),
    validations: {
      form: {
        url: {
          required,
          url
        }
      }
    },
    methods: {
      getValidationClass (fieldName) {
        const field = this.$v.form[fieldName]

        if (field) {
          return {
            'md-invalid': field.$invalid && field.$dirty
          }
        }
      },
      clearForm () {
        this.$v.$reset()
        this.form.url = null
      },
      saveUser () {
        this.sending = true
        const regex = /status\/(\d+)/
        const found = this.form.url.match(regex)
        
        if(found.length==2) {
          const record_hash = sha512(this.salt+found[1]).toString()
          
          axios.post(
            'https://api.reca.bar/tweets/push-offending',{
              hash_id: record_hash,
              status_id: parseInt(found[1]),
              user_hash: this.hash_id
            }).then(response => {
              this.salt = response.data
              this.sending = false
              this.$v.$reset()
              this.form.url = null
            })
          
        } else {
          window.alert("URL de tweet inválida.")
        }
                       
      },
      validateUser () {
        this.$v.$touch()

        if (!this.$v.$invalid) {
          this.saveUser()
        }
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
  .md-progress-bar {
    position: absolute;
    top: 0;
    right: 0;
    left: 0;
  }
</style>

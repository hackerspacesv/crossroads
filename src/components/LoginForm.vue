<template>
  <div>
    <form novalidate class="md-layout" @submit.prevent="validateUser">
      <md-card class="md-layout-item md-size-100 md-small-size-100">
        <md-card-header>
          <div class="md-title">¡Bienvenido a Reca.bar!</div>
          <div class="md-subheading">Reca.bar es la herramienta para identificar
          perfiles ofensivos en Twitter.</div>
          <div class="md-body-1">Antes de comenzar, selecciona un nombre de usuario
          y una clave. Este identificador y clave te servirá para recuperar tus
          reportes. Por el momento no es posible cambiar la clave, así que guarda
          esta información en un lugar seguro.</div>
        </md-card-header>

        <md-card-content>
          <div class="md-layout md-gutter">
            <div class="md-layout-item md-small-size-100">
              <md-field :class="getValidationClass('username')">
                <label for="username">Usuario</label>
                <md-input name="username" id="username" v-model="form.username" :disabled="sending" />
                <span class="md-error" v-if="!$v.form.username.required">El nombre de usuario es requerido</span>
                <span class="md-error" v-else-if="!$v.form.username.minlength">Usuario inválido</span>
              </md-field>
            </div>

            <div class="md-layout-item md-small-size-100">
              <md-field :class="getValidationClass('password')">
                <label for="password">Clave</label>
                <md-input name="password" id="password" v-model="form.password" :disabled="sending" type="password" />
                <span class="md-error" v-if="!$v.form.password.required">La clave es requerida</span>
                <span class="md-error" v-else-if="!$v.form.password.minlength">Invalid last name</span>
              </md-field>
            </div>
          </div>
        </md-card-content>

        <md-progress-bar md-mode="indeterminate" v-if="sending" />

        <md-card-actions>
          <md-button type="submit" class="md-primary" :disabled="sending">Iniciar</md-button>
        </md-card-actions>
      </md-card>

      <md-snackbar :md-active.sync="userSaved">¡El usuario {{ lastUser }} está listo para reportar!</md-snackbar>
    </form>
  </div>
</template>

<script>
  const axios = require('axios').default;
  import sha512 from 'crypto-js/sha512'
  import { validationMixin } from 'vuelidate'
  import {
    required,
    minLength
  } from 'vuelidate/lib/validators'

  export default {
    name: 'LoginForm',
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
    data: () => ({
      form: {
        username: null,
        password: null
      },
      userSaved: false,
      sending: false,
      lastUser: null,
      salt: null
    }),
    validations: {
      form: {
        username: {
          required,
          minLength: minLength(3)
        },
        password: {
          required,
          minLength: minLength(3)
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
        this.form.username = null
        this.form.password = null
      },
      saveUser () {
        this.sending = true
        
        // Hash salt+username+password
        const hashDigest = sha512(this.salt+this.form.username+this.form.password).toString()
        
        this.sending = false
        this.userSaved =  true
        this.lastUser = this.form.username
        this.$emit("hashGenerated", hashDigest)
        
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

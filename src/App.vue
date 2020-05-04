<template>
  <div class="page-container">
    <md-app md-waterfall md-mode="overlap">
      <md-app-toolbar class="md-primary md-large">
        <div class="md-toolbar-row">
        <!--
          <md-button class="md-icon-button" @click="menuVisible = !menuVisible">
            <md-icon>menu</md-icon>
          </md-button>
        -->
          <span class="md-title">Reca.bar</span>
        </div>
      </md-app-toolbar>

      <md-app-drawer :md-active.sync="menuVisible">
        <md-toolbar class="md-transparent" md-elevation="0">
          <div class="md-toolbar-row">
            <span class="md-title">Navegación</span>
          </div>
        </md-toolbar>

        <md-list>

          <md-list-item>
            <md-icon>done_outline</md-icon>
            <span class="md-list-item-text">Recabar</span>
          </md-list-item>
          
          <md-list-item>
            <md-icon>info</md-icon>
            <span class="md-list-item-text">Acerca de</span>
          </md-list-item>
        </md-list>
      </md-app-drawer>
      
      <md-app-content>
        <LoginForm v-if="userHash==null"
          @hashGenerated="storeUserHash"
          ></LoginForm>
        <StoreTweet v-if="userHash!=null" :hash_id="userHash"></StoreTweet>
      </md-app-content>
      
    </md-app>
  </div>
</template>

<script>
import LoginForm from './components/LoginForm.vue'
import StoreTweet from './components/StoreTweet.vue'

export default {
  name: 'App',
  components: {
    LoginForm,
    StoreTweet
  },
  data: () => ({
    menuVisible: false,
    dynamicComponent: 'loginForm',
    userHash: null
  }),
  methods: {
    storeUserHash(hashDigest) {
      this.userHash = hashDigest
    }
  }
}
</script>

<style lang="scss">
export default {
  name: 'Waterfall'
}
.md-app {
  height: 100vh;
  border: 1px solid rgba(#000, .12);
}

.md-drawer {
  width: 230px;
  max-width: calc(100vw - 125px);
}

.md-toolbar {
  background-image: url('/img/stacked-paper-sheets.jpg')
}

.white-color {
  color: #ffffff;
}
</style>

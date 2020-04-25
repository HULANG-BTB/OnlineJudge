<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: "App",
  components: {},
  created() {
    this.$store.dispatch("getUserInfo");
  },
  computed: {
    User() {
      return this.$store.state.User || {};
    }
  },
  watch: {
    User() {
      this.$store.dispatch("getPrivilegeInfo");
    }
  }
};
</script>

<style>
</style>

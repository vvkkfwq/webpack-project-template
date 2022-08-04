<template>
  <div class="HomeView">
    <div class="image-box">
      <img src="@/assets/image/home/vue.png" />
      +
      <img src="@/assets/image/home/webpack.png" />
    </div>
    <p>Hello</p>
    <p>This template builded with</p>
    <p>Vue2 | Webpack5 | Vuex</p>
  </div>
</template>
<script>
export default {
  name: 'HomeView',
};
</script>
<style lang="scss" scoped>
.HomeView {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  .image-box {
    display: flex;
    align-items: center;

    img {
      margin: 0 12px;
    }
  }
}
</style>

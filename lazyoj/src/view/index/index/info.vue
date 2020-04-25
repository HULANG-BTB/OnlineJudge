<template>
  <div>
    <Row :gutter="16" :style="{marginTop: '1.5rem'}">
      <Card>
        <span v-html="notice"></span>
      </Card>
    </Row>
    <Row v-for="(item, index) in newsList" :key="index" :gutter="16" :style="{marginTop: '1.5rem'}">
      <Card>
        <div slot="title">
          <h1>新闻： {{item.title}}</h1>
        </div>
        <span v-html="item.content"></span>
      </Card>
    </Row>
  </div>
</template>

<script>
export default {
  data() {
    return {
      notice: "没有公告！",
      newsList: []
    };
  },
  created() {
    this.$axios
      .get("/api/config/get", { params: { key: "notice" } })
      .then(res => {
        if (res.data.code === 1) {
          this.notice = res.data.data.val;
        }
      });
    this.$axios
      .get("/api/news/list", { params: { page: 1, limit: 30 } })
      .then(res => {
        this.newsList = res.data.data.data;
      });
  }
};
</script>

<style scoped>
</style>
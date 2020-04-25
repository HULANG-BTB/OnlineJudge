<template>
  <Row :gutter="16" :style="{marginTop: '1.5rem'}">
    <Col :span="18">
      <Card>
        <div slot="title">
          <h1 :style="{textAlign: 'center'}">提交排行</h1>
        </div>
        <h3 v-if="(new Date()) < (new Date(ContestInfo.start_time))">竞赛尚未开始！</h3>
        <Table
          v-else
          :columns="tableColumns"
          :data="tableData"
          ref="table"
          :loading="tableLoading"
          border
          stripe
          size="small"
        ></Table>
      </Card>
    </Col>
    <Col :span="6">
      <Row>
        <Card>
          <Button small long type="default" @click="handleProbemListClick">问题列表</Button>
          <Button
            small
            long
            type="default"
            @click="handleSubmitListClick"
            :style="{marginTop: '0.5rem'}"
          >全部提交</Button>
          <Button
            small
            long
            type="default"
            @click="handleRankListClick"
            :style="{marginTop: '0.5rem'}"
          >当前排名</Button>
        </Card>
      </Row>
    </Col>
  </Row>
</template>

<script>
export default {
  data() {
    return {
      tableLoading: true,
      page: {
        total: 0,
        limit: 10,
        page: 1
      },
      solutionList: []
    };
  },
  methods: {
    handleProbemListClick() {
      this.$router.push({
        path: "/Index/contest/detail",
        query: { cid: this.$route.query.cid }
      });
    },
    handleSubmitListClick() {
      this.$router.push({
        path: "/Index/Contest/Status",
        query: { cid: this.$route.query.cid }
      });
    },
    handleRankListClick() {
      this.$router.push({
        path: "/Index/Contest/Rank",
        query: { cid: this.$route.query.cid }
      });
    },
    fetchData() {
      this.tableLoading = true;
      let query = this.page;
      query.cid = this.$route.query.cid;
      this.$axios
        .get("/api/contest/rank", { params: { cid: this.$route.query.cid } })
        .then(res => {
          if (res.data.code === 1) {
            this.solutionList = res.data.data;
          }
          this.tableLoading = false;
        })
        .catch(() => {
          this.tableLoading = false;
        });
      if (!this.ContestInfo.cid) {
        this.$store.dispatch("getContestInfo", { id: this.$route.query.cid });
      }
      if (!this.ContestProblemList[0]) {
        this.$store.dispatch("getContestProblemList", {
          cid: this.$route.query.cid
        });
      }
    },
    renderTansPenalty(params) {
      const hour = parseInt(params.row.penalty / (60 * 60));
      const min = parseInt((params.row.penalty % (60 * 60)) / 60);
      const sec = params.row.penalty % 60;
      return `${hour}:${min}:${sec}`;
    },
    renderTansAnswer(h, problem) {
      let color = "#fff";
      let ret = "";
      const hour = parseInt(problem.time / (60 * 60));
      const min = parseInt((problem.time % (60 * 60)) / 60);
      const sec = problem.time % 60;
      if (this.ContestInfo.judgemode === 0) {
        if (problem.ac) {
          ret = `${hour}:${min}:${sec}`;
          color = "#3c3";
        }
        if (problem.wa) {
          ret += `(-${problem.wa})`;
          if (!problem.ac) {
            color = "#c33";
          }
        }
      } else {
        if (problem.ac) {
          ret = `${hour}:${min}:${sec}`;
          color = "#3c3";
        }
        else if (problem.time) {
          ret = `${hour}:${min}:${sec}( ${problem.pass_rate * 100} )`
          color = "#c33"
        }
      }
      return h(
        "div",
        {
          style: {
            backgroundColor: color,
            color: "#000"
          }
        },
        [h("span", ret)]
      );
    }
  },
  computed: {
    ContestInfo() {
      return this.$store.state.ContestInfo;
    },
    ContestProblemList() {
      return this.$store.state.ContestProblemList;
    },
    tableColumns() {
      let columns = [
        {
          title: "Rank",
          sortable: true,
          align: "center",
          minWidth: 80,
          ellipsis: true,
          type: "index"
        },
        {
          title: "Nick",
          key: "nickname",
          sortable: true,
          align: "center",
          minWidth: 80,
          ellipsis: true
        },
        {
          title: "Sloved",
          key: "sloved",
          sortable: true,
          align: "center",
          minWidth: 80,
          ellipsis: true
        },
        {
          title: "Penalty",
          key: "penalty",
          sortable: true,
          align: "center",
          minWidth: 80,
          ellipsis: true,
          render: (h, params) => {
            return h("div", [h("span", this.renderTansPenalty(params))]);
          }
        }
      ];
      if (this.ContestInfo.judgemode === 1) {
        columns.push({
          title: "Mark",
          sortable: true,
          minWidth: 100,
          align: "center",
          key: "mark"
        });
      }
      for (let i in this.ContestProblemList) {
        columns.push({
          title: `${String.fromCharCode(65 + parseInt(i))}`,
          sortable: true,
          minWidth: 100,
          align: "center",
          render: (h, params) => {
            return this.renderTansAnswer(h, params.row.problem[i]);
          }
        });
      }
      return columns;
    },
    tableData() {
      return this.solutionList;
    }
  },
  created() {
    this.fetchData();
  }
};
</script>

<style scoped>
</style>
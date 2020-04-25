<template>
  <div>
    <Row :gutter="16" :style="{marginTop: '1.5rem'}">
      <Col :span="18">
        <Row :gutter="16">
          <Card>
            <div slot="title">
              <h1 :style="{textAlign: 'center'}">{{ ContestInfo.title }}</h1>
              <p :style="{marginTop: '1rem'}">
                <span v-html="ContestInfo.description"></span>
              </p>
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
              :max-height="500"
              @on-row-dblclick="handleTableDbClick"
            ></Table>
          </Card>
        </Row>
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
        <Row :style="{marginTop: '1.5rem'}">
          <Card>
            <div slot="title">信息</div>
            <div class="info">
              <span>开始时间:</span>
              {{ `${(new Date(ContestInfo.start_time)).Format('yyyy-MM-dd hh:mm:ss')}` }}
            </div>
            <div class="info">
              <span>结束时间:</span>
              {{ `${(new Date(ContestInfo.end_time)).Format('yyyy-MM-dd hh:mm:ss')}` }}
            </div>
            <div class="info">
              <span>评测模式:</span>
              {{ `${ContestInfo.judgemode === 1 ? 'OI 模式' : 'ACM/ICPC'}` }}
            </div>
            <div class="info">
              <span>题目数量:</span>
              {{ tableData.length }}
            </div>
            <div class="info" v-if="ContestInfo.user">
              <span>创建者:</span>
              {{ ContestInfo.user.nickname }}
            </div>
          </Card>
        </Row>
      </Col>
    </Row>
  </div>
</template>

<script>
export default {
  data() {
    return {
      tableColumns: [
        {
          title: "编号",
          key: "id",
          sortable: true,
          align: "center",
          width: "80",
          render: (h, params) => {
            return h("div", [
              h("span", `${String.fromCharCode(parseInt(64 + params.row.num))}`)
            ]);
          }
        },
        {
          title: "标题",
          align: "center",
          ellipsis: true,
          render: (h, params) => {
            return h("div", [h("span", `${params.row.problem.title}`)]);
          }
        },
        {
          title: "正确",
          sortable: true,
          align: "center",
          key: "c_accepted",
          width: 80
        },
        {
          title: "标题",
          sortable: true,
          align: "center",
          key: "c_submit",
          width: 80
        }
      ],
      tableLoading: false
    };
  },
  methods: {
    handleTableDbClick(row) {
      this.$router.push({
        path: `/Index/Contest/Problem`,
        query: {
          cid: this.ContestInfo.cid,
          pid: row.num
        }
      });
    },
    handleProbemListClick() {
      this.$router.push({
        path: "/Index/contest/detail",
        query: { cid: this.ContestInfo.cid }
      });
    },
    handleSubmitListClick() {
      this.$router.push({
        path: "/Index/Contest/Status",
        query: { cid: this.ContestInfo.cid }
      });
    },
    handleRankListClick() {
      this.$router.push({
        path: "/Index/Contest/Rank",
        query: { cid: this.ContestInfo.cid }
      });
    },
    fetchData() {
      this.tableLoading = true;
      this.$store.dispatch("getContestInfo", { id: this.$route.query.cid });
      this.$store.dispatch("getContestProblemList", {
        cid: this.$route.query.cid
      });
      this.tableLoading = false
    }
  },
  computed: {
    ContestInfo() {
      return this.$store.state.ContestInfo;
    },
    ContestProblemList() {
      return this.$store.state.ContestProblemList;
    },
    tableData() {
      return this.ContestProblemList
    }
  },
  created() {
    this.fetchData();
  }
};
</script>

<style scoped>
.info {
  font-size: 1rem;
  margin-top: 0.3rem;
}
</style>
<template>
  <div>
    <el-button type="primary" @click="showCraw">采集</el-button>
    <el-table
      :data="list"
      v-loading="loading"
      element-loading-text="Loading"
      highlight-current-row
      border
      fit
    >
      <el-table-column prop="sourceName" label="采集网站"></el-table-column>
      <el-table-column prop="itemId" label="淘宝ID"></el-table-column>
      <el-table-column prop="title" label="标题"></el-table-column>
      <el-table-column prop="pic" label="图片">
        <template #default="scope">
          <img :src="scope.row.pic" class="item-img" />
        </template>
      </el-table-column>
      <el-table-column prop="price" label="价格"></el-table-column>
      <el-table-column prop="prePrice" label="原价"></el-table-column>
      <el-table-column prop="createTime" label="采集时间"></el-table-column>
    </el-table>
    <el-pagination
      :current-page="searchForm.current"
      :page-sizes="[20, 45, 80]"
      :page-size="searchForm.size"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
      :hide-on-single-page="true"
      @size-change="pageSizeChange"
      @current-change="pageNoChange"
    />
    <el-dialog
      v-model="crawDialogVisible"
      title="商品采集"
      width="40%"
      @close="crawDialogVisible = false"
    >
      <el-form :model="crawForm" label-position="left">
        <el-form-item prop="id" label="采集网站">
          <el-select v-model="crawForm.id" clearable placeholder="自定义">
            <el-option value="">自定义</el-option>
            <el-option
              v-for="website in websites"
              :key="website.id"
              :value="website.id"
              :label="website.name"
              @click="crawForm = website"
            >
              {{ website.name }}
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="code" label="网站名称" v-if="!crawForm.id">
          <el-input v-model="crawForm.code"></el-input>
        </el-form-item>
        <el-form-item prop="url" label="URL" v-if="!crawForm.id">
          <el-input v-model="crawForm.url"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="craw">采集</el-button>
          <el-button type="warning" @click="crawDialogVisible = false">
            取消
          </el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import { getCurrentInstance, reactive, toRefs, ref, onMounted } from 'vue'
import { list, craw } from '@/api/item'
import { list as websites } from '@/api/itemWebsite'

export default {
  setup() {
    const { proxy: ctx } = getCurrentInstance()
    const state = reactive({
      loading: false,
      searchForm: {
        current: 1,
        size: 20,
      },
      total: 0,
      list: [],
      websites: [],
      crawForm: {
        id: '',
        code: '',
        name: '',
        url: '',
      },
      crawDialogVisible: false,
      getList() {
        ctx.loading = true
        list(ctx.searchForm).then(res => {
          ctx.list = res.data.records
          ctx.list.forEach(item => {
            ctx.websites.forEach(website => {
              if (item.source == website.code) {
                item.sourceName = website.name
              }
            })
          })
          ctx.total = res.data.total
          ctx.loading = false
        })
      },
      pageSizeChange(pageSize) {
        ctx.searchForm.size = pageSize
        ctx.getList()
      },
      pageNoChange(pageNo) {
        ctx.searchForm.current = pageNo
        ctx.getList()
      },
      showCraw() {
        ctx.crawDialogVisible = true
      },
      craw() {
        craw(ctx.crawForm).then(res => {
          ctx.$message.success('采集完成')
          ctx.crawDialogVisible = false
          ctx.getList()
        })
      },
    })
    onMounted(() => {
      websites().then(res => {
        ctx.websites = res.data
        ctx.getList()
      })
    })
    return {
      ...toRefs(state),
    }
  },
}
</script>

<style>
.item-img {
  width: 200px;
}
</style>

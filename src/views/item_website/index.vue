<template>
  <div>
    <el-button type="primary" @click="edit(null)">添加</el-button>
    <el-table
      :data="list"
      v-loading="loading"
      element-loading-text="Loading"
      highlight-current-row
      border
      fit
    >
      <el-table-column prop="code" label="编码"></el-table-column>
      <el-table-column prop="name" label="名称"></el-table-column>
      <el-table-column label="操作">
        <template #default="scope">
          <el-button
            type="primary"
            @click="$router.push('/item/itemRegexp/' + scope.row.id)"
          >
            商品匹配规则
          </el-button>
          <el-button @click="edit(scope.row)">修改</el-button>
          <el-popconfirm title="确认删除?" @confirm="deleteById(scope.row.id)">
            <template #reference>
              <el-button type="danger">删除</el-button>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog
      v-model="editDialogVisible"
      :title="editForm.id ? '修改网站' : '添加网站'"
      width="40%"
      @close="editDialogVisible = false"
    >
      <el-form
        ref="editFormRef"
        :model="editForm"
        :rules="editFormRules"
        label-position="left"
      >
        <el-form-item prop="code" label="编码">
          <el-input v-model="editForm.code"></el-input>
        </el-form-item>
        <el-form-item prop="name" label="名称">
          <el-input v-model="editForm.name"></el-input>
        </el-form-item>
        <el-form-item prop="url" label="URL">
          <el-input v-model="editForm.url"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="save">保存</el-button>
          <el-button type="warning" @click="editDialogVisible = false">
            取消
          </el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import {
  getCurrentInstance,
  reactive,
  toRefs,
  ref,
  computed,
  watch,
  onMounted,
} from 'vue'
import { list, add, update, deleteById } from '@/api/itemWebsite'

export default {
  setup() {
    const { proxy: ctx } = getCurrentInstance()
    const state = reactive({
      loading: false,
      list: [],
      editDialogVisible: false,
      editForm: {
        id: '',
        code: '',
        name: '',
        url: '',
      },
      editFormRules: {
        code: [{ required: true, message: '编码不能为空' }],
        name: [{ required: true, message: '名称不能为空' }],
        url: [{ required: true, message: 'URL不能为空' }],
      },
      editFormRef: ref(null),
      save() {
        ctx.$refs.editFormRef.validate(valid => {
          if (valid) {
            if (ctx.editForm.id) {
              update(ctx.editForm).then(res => {
                ctx.$message.success('更新成功')
                ctx.editDialogVisible = false
                ctx.getList()
              })
            } else {
              add(ctx.editForm).then(res => {
                ctx.$message.success('添加成功')
                ctx.editDialogVisible = false
                ctx.getList()
              })
            }
          }
        })
      },
      edit(row) {
        if (row) {
          ctx.editForm = {
            id: row.id,
            code: row.code,
            name: row.name,
            url: row.url,
          }
        } else {
          ctx.editForm = {
            id: '',
            code: '',
            name: '',
            url: '',
          }
        }
        ctx.editDialogVisible = true
      },
      deleteById(id) {
        deleteById(id).then(res => {
          ctx.$message.success('删除成功')
          ctx.getList()
        })
      },
      getList() {
        ctx.loading = true
        list().then(res => {
          ctx.list = res.data
          ctx.loading = false
        })
      },
    })
    onMounted(() => {
      ctx.getList()
    })
    return {
      ...toRefs(state),
    }
  },
}
</script>

<style></style>

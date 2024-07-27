<template>
  <div style="margin: 10px;">{{ itemWebsite.name }}匹配规则</div>
  <div style="display: flex;">
    <div style="width: 60%">
      <div class="form">
        <div class="form_label">
          匹配开始字符串
        </div>
        <div class="form_field">
          <el-input v-model="itemWebsite.startStr"></el-input>
        </div>
        <div class="form_label">
          匹配结束字符串
        </div>
        <div class="form_field">
          <el-input v-model="itemWebsite.endStr"></el-input>
        </div>
      </div>
      <div
        class="regexp_item"
        v-for="(regexpItem, index) in regexpItems"
        :key="index"
      >
        {{ index + 1 }}
        <el-icon @click="regexpItems.splice(index, 1)"><CloseBold /></el-icon>
        <div class="line">
          <div class="label">类型</div>
          <div class="field">
            <el-select
              v-model="regexpItem.type"
              @change="changeType(regexpItem)"
            >
              <el-option
                v-for="(name, code) in types"
                :key="code"
                :value="code"
                :label="name"
              >
                {{ name }}
              </el-option>
            </el-select>
          </div>
        </div>
        <div class="line">
          <div class="label">匹配类型</div>
          <div class="field">
            <el-radio-group v-model="regexpItem.matchType">
              <el-radio value="number" label="number">数值</el-radio>
              <el-radio value="all" label="all">任意字符</el-radio>
              <el-radio value="exclude" label="exclude">除</el-radio>
              <el-input
                class="match_input"
                v-if="regexpItem.matchType == 'exclude'"
                v-model="regexpItem.matchStr"
              />
              <el-radio value="fix" label="fix">固定</el-radio>
              <el-input
                v-if="regexpItem.matchType == 'fix'"
                v-model="regexpItem.matchStr"
              />
            </el-radio-group>
          </div>
        </div>
      </div>
    </div>

    <div style="width: 180px; text-align: center;">
      <div style="margin-bottom: 10px;">
        <el-button round type="primary" @click="add">增加匹配项</el-button>
      </div>
      <div style="margin-bottom: 10px;">
        <el-button type="primary" round @click="save">保存</el-button>
      </div>
      <el-button type="primary" round @click="test">测试</el-button>
    </div>

    <div style="width: 40%;">
      <pre>{{ resultItems }}</pre>
    </div>
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
import { getById, update } from '@/api/itemWebsite'
import { test } from '@/api/item'
import { ElMessageBox } from 'element-plus'

export default {
  setup() {
    const { proxy: ctx } = getCurrentInstance()
    const state = reactive({
      id: '',
      itemWebsite: {},
      regexpItems: [],
      types: {
        title: '标题',
        pic: '图片',
        id: '商品id',
        price: '价格',
        prePrice: '原价',
        '': '其他',
      },
      resultItems: '',
      add() {
        ElMessageBox.prompt('请输入添加的位置下标', '添加匹配项', {
          inputPattern: /\d+/,
          inputErrorMessage: '下标必须为正整数',
        }).then(({ value }) => {
          const index = parseInt(value)
          ctx.regexpItems.splice(index - 1, 0, {
            type: '',
            matchType: '',
            matchStr: '',
          })
        })
      },
      changeType(regexpItem) {
        switch (regexpItem.type) {
          case 'price':
          case 'prePrice':
            regexpItem.matchType = 'number'
            break
          case 'pic':
          case 'itemId':
            regexpItem.matchType = 'exclude'
            regexpItem.matchStr = '"'
            break
          case 'title':
            regexpItem.matchType = 'exclude'
            regexpItem.matchStr = '<'
        }
      },
      save() {
        var regexpStr = ''
        ctx.regexpItems.forEach(item => {
          var str = ''
          if (item.matchType == 'all') {
            str = '.+?'
          } else if (item.matchType == 'exclude') {
            str = '[^' + item.matchStr + ']+'
          } else if (item.matchType == 'fix') {
            str = item.matchStr
          } else if (item.matchType == 'number') {
            str = '[\\d\\.]+'
          }
          if (item.type) {
            regexpStr += '(?<' + item.type + '>' + str + ')'
          } else {
            regexpStr += str
          }
        })
        update({
          startStr: ctx.itemWebsite.startStr,
          endStr: ctx.itemWebsite.endStr,
          regexpContents: JSON.stringify(ctx.regexpItems),
          regexpStr: regexpStr,
          id: ctx.id,
        }).then(res => {
          ctx.$message.success('保存成功')
        })
      },
      test() {
        var regexpStr = ''
        ctx.regexpItems.forEach(item => {
          var str = ''
          if (item.matchType == 'all') {
            str = '.+?'
          } else if (item.matchType == 'exclude') {
            str = '[^' + item.matchStr + ']+'
          } else if (item.matchType == 'fix') {
            str = item.matchStr
          } else if (item.matchType == 'number') {
            str = '[\\d\\.]+'
          }
          if (item.type) {
            regexpStr += '(?<' + item.type + '>' + str + ')'
          } else {
            regexpStr += str
          }
        })
        test({
          url: ctx.itemWebsite.url,
          startStr: ctx.itemWebsite.startStr,
          endStr: ctx.itemWebsite.endStr,
          regexpStr: regexpStr,
        }).then(res => {
          ctx.$message.success('测试成功')
          ctx.resultItems = JSON.stringify(
            res.data,
            ['itemId', 'title', 'pic', 'price', 'prePrice'],
            '\t'
          )
        })
      },
    })
    onMounted(() => {
      ctx.id = ctx.$route.params.id
      getById(ctx.id).then(res => {
        ctx.itemWebsite = res.data
        if (ctx.itemWebsite.regexpContents) {
          ctx.regexpItems = eval('(' + ctx.itemWebsite.regexpContents + ')')
        }
      })
    })
    return {
      ...toRefs(state),
    }
  },
}
</script>

<style>
.regexp_item {
  margin: 10px;
  border-top: 1px solid gray;
  border-right: 1px solid gray;
  position: relative;
  width: 100%;
}
.regexp_item .el-icon {
  position: absolute;
  right: -5px;
  top: -5px;
  color: red;

  cursor: pointer;
}
.line {
  display: flex;
}
.line > div {
  border-bottom: 1px solid gray;
  border-left: 1px solid gray;
  padding: 5px;
}
.label {
  width: 30%;
}
.field {
  width: 70%;
}
.match_input {
  width: 100px;
  margin-right: 15px;
}
.form {
  display: flex;
  align-items: center;
  margin: 10px;
  width: 100%;
}
.form_label {
  width: 20%;
  margin-left: 20px;
}
.form_field {
  width: 30%;
}
</style>

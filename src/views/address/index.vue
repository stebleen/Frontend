<template>
  <div class="dashboard-container">
    <div class="container">
      <div class="tableBar" style="display: inline-block; width: 100%">
        
        <label style="margin-right: 5px; margin-left: 20px">校区：</label>
        <el-select v-model="campus_Name" placeholder="请选择" clearable style="width: 15%" @clear="init">
          <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>


        <div style="float: right">
          <el-button type="primary" @click="addAddress()">
            + 新增地址
          </el-button>
        </div>

        <el-button class="normal-btn continue" @click="init(true)">
          查询
        </el-button>
      </div>
      <el-table v-if="tableData.length" :data="tableData" stripe class="tableBox">
        <el-table-column prop="id" label="地址ID" />
        <el-table-column prop="campusCode" label="校区号" />
        <el-table-column prop="campusName" label="校区名称" />
        <el-table-column prop="buildingCode" label="宿舍楼号" />
        <el-table-column prop="buildingName" label="宿舍楼" />

        <!-- <el-table-column label="状态">
          <template slot-scope="scope">
            <div class="tableColumn-status" :class="{ 'stop-use': String(scope.row.status) === '0' }">
              {{ String(scope.row.status) === '0' ? '禁用' : '启用' }}
            </div>
          </template>
        </el-table-column> -->

        <!-- <el-table-column prop="updateTime" label="操作时间" /> -->
        <el-table-column label="操作" width="200" align="center">
          <template slot-scope="scope">
            <el-button type="text" size="small" class="blueBug" @click="editHandle(scope.row)">
              修改
            </el-button>
            <el-button type="text" size="small" class="delBut" @click="deleteHandle(scope.row.id)">
              删除
            </el-button>

          </template>
        </el-table-column>
      </el-table>
     <Empty v-else :is-search="isSearch" />

    </div>
    <el-dialog :title="classData.title" :visible.sync="classData.dialogVisible" width="30%" :before-close="handleClose">
      <el-form ref="classData" :model="classData" class="demo-form-inline" :rules="rules" label-width="100px">
        
        <el-form-item label="校区号：" prop="campusCode">
          <el-input v-model="classData.campusCode" placeholder="请输入校区号" />
        </el-form-item>
        <el-form-item label="校区名称：" prop="campusName">
          <el-input v-model="classData.campusName" placeholder="请输入校区名称" maxlength="20" />
        </el-form-item>
        <el-form-item label="宿舍楼号：" prop="buildingCode">
          <el-input v-model="classData.buildingCode" placeholder="请输入宿舍楼号" />
        </el-form-item>
        <el-form-item label="宿舍楼：" prop="buildingName">
          <el-input v-model="classData.buildingName" placeholder="请输入宿舍楼" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button size="medium" @click="
            ; (classData.dialogVisible = false), $refs.classData.resetFields()
          ">取 消</el-button>
        <el-button type="primary" :class="{ continue: actionType === 'add' }" size="medium" @click="submitForm()">确
          定</el-button>
        <el-button v-if="action != 'edit'" type="primary" size="medium" @click="submitForm('go')">
          保存并继续添加
        </el-button>
      </span>
    </el-dialog>
  </div>
</template>


<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import HeadLable from '@/components/HeadLable/index.vue'
import {
  getAddressPage,
  deleAddress,
  editAddress,
  addAddress,
} from '@/api/address'
import Empty from '@/components/Empty/index.vue'

@Component({
  name: 'Address',
  components: {
    HeadLable,
    Empty
  }
})
export default class extends Vue {
  private options: any = [
    {
      value: '同济大学嘉定校区',
      label: '同济大学嘉定校区'
    },
    {
      value: '同济大学四平校区',
      label: '同济大学四平校区'
    },
    // {
    //   value: '同济大学沪西校区',
    //   label: '同济大学沪西校区'
    // }
  ]
  private actionType: string = ''
  private id = ''
  private campus_Name: any = ''
  private action: string = ''
  private tableData = []
  private isSearch: boolean = false
  private classData: any = {
    title: '添加地址',
    dialogVisible: false,
    buildingName:'',
    buildingCode:'',
    campusCode:'',
    campusName:'',
    id:'',
  }

  get rules() {
    return {
      campusName: [
        {
          required: true,
          trigger: 'blur',
          validator: (rule: any, value: string, callback: Function) => {
            // const reg = /[\u4e00-\u9fa5]/
            var reg = new RegExp('^[A-Za-z\u4e00-\u9fa5]+$')
            if (!value) {
              callback(new Error(this.classData.title + '不能为空'))
            } else if (value.length < 2) {
              callback(new Error('校区名称输入不符，请输入2-20个字符'))
            } else if (!reg.test(value)) {
              callback(new Error('校区名称包含特殊字符'))
            } else {
              callback()
            }
          }
        }
      ],
      buildingName: [
        {
          required: true,
          trigger: 'blur',
          validator: (rule: any, value: string, callback: Function) => {
            if (value || String(value) === '0') {
              callback()
            } else {
              callback(new Error('宿舍楼不能为空'))
            }
          }
        }
      ]
    }
  }

  created() {
    this.init()
  }

  // 初始化信息
  private async init(isSearch?) {
    this.isSearch = isSearch
    await getAddressPage({
      // page: this.page,
      // pageSize: this.pageSize,
      // id: this.id,
      campusName: this.campus_Name ? this.campus_Name : undefined,
      // building_name: this.domitory ? this.domitory : undefined
    })
      .then(res => {
        console.log("campusName:",this.campus_Name);
        console.log("res:",res);
        // if (String(res.data.code) === '1') {
        //   this.tableData =
        //     res && res.data && res.data.data && res.data.data.records
        //   this.counts = Number(res.data.data.total)
        // } else {
        //   this.$message.error(res.data.desc)
        // }
        this.tableData = res.data.data;
        // this.campus=res.data.data.campus_name;
        // this.tableData = res.data && res.data.data && res.data.data.records;
        console.log("tableData",this.tableData);
        // console.log("campus_name",this.campus);
        console.log("len",this.tableData.length);
            // res && res.data && res.data.data && res.data.data.records
          // this.counts = Number(res.data.data.total)
      })
      .catch(err => {
        console.log(err, 'err')
        this.$message.error('请求出错了：' + err.message)
      })
  }

  // 添加
  private addAddress() {
    this.classData.title = '校区'
    this.action = 'add'
    this.classData.buildingName = ''
    this.classData.campusName = ''
    this.classData.buildingCode = ''
    this.classData.campusCode = ''
    this.classData.dialogVisible = true
    this.actionType = 'add'
  }

  // 修改
  private editHandle(dat: any) {
    this.classData.title = '修改地址'
    this.action = 'edit'
    this.classData.campusName = dat.campusName
    this.classData.buildingName = dat.buildingName
     this.classData.buildingCode = dat.buildingCode
    this.classData.campusCode = dat.campusCode
    this.classData.id = dat.id
    this.classData.dialogVisible = true
    this.actionType = 'edit'
  }

  // 关闭弹窗
  private handleClose(st: string) {
    console.log(this.$refs.classData, 'this.$refs.classData')
    this.classData.dialogVisible = false
    //对该表单项进行重置，将其值重置为初始值并移除校验结果
    this.$refs.classData.resetFields()
  }


  //删除
  private deleteHandle(id: any) {
    this.$confirm('此操作将永久删除该地址，是否继续？', '确定删除', {
      confirmButtonText: '删除',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(() => {
      deleAddress(id)
        .then(res => {
          if (res.data.code === 1) {
            this.$message.success('删除成功！')
            this.init()
          } else {
            this.$message.error(res.data.msg)
          }
        })
        .catch(err => {
          this.$message.error('请求出错了：' + err.message)
        })
    })
  }

  $refs!: {
    classData: any
  }

  //数据提交
  submitForm(st: any) {
    if (this.action === 'add') {
      this.$refs.classData.validate((value: boolean) => {
        if (value) {
          addAddress({
            campusName: this.classData.campusName,
            buildingName: this.classData.buildingName,
            buildingCode: this.classData.buildingCode,
            campusCode: this.classData.campusCode
          })
            .then(res => {
              if (res.data.code === 1) {
                this.$message.success('地址添加成功！')
                this.$refs.classData.resetFields()
                if (!st) {
                  this.classData.dialogVisible = false
                }
                this.init()
              } else {
                this.$message.error(res.data.desc || res.data.msg)
              }
            })
            .catch(err => {
              this.$message.error('请求出错了：' + err.message)
            })
        }
      })
    } else {
      this.$refs.classData.validate((value: boolean) => {
        if (value) {
          editAddress({
            id: this.classData.id,
            campusName: this.classData.campusName,
            buildingName: this.classData.buildingName,
            buildingCode: this.classData.buildingCode,
            campusCode: this.classData.campusCode
          })
            .then(res => {
              if (res.data.code === 1) {
                this.$message.success('地址修改成功！')
                this.classData.dialogVisible = false
                this.$refs.classData.resetFields()
                this.init()
              } else {
                this.$message.error(res.data.desc || res.data.msg)
              }
            })
            .catch(err => {
              this.$message.error('请求出错了：' + err.message)
            })
        }
      })
    }
  }


}
</script>
<style lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;

    .container {
      background: #fff;
      position: relative;
      z-index: 1;
      padding: 30px 28px;
      border-radius: 4px;

      .tableBar {
        display: flex;
        margin-bottom: 20px;
        justify-content: space-between;
      }

      .tableBox {
        width: 100%;
        border: 1px solid $gray-5;
        border-bottom: 0;
      }

      .pageList {
        text-align: center;
        margin-top: 30px;
      }

      //查询黑色按钮样式
      .normal-btn {
        background: #333333;
        color: white;
        margin-left: 20px;
      }
    }
  }
}
</style>
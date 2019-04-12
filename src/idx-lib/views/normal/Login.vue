<template>
    <div class="main">
        <div class="form-container">
            <h2 class="form-title">登 陆</h2>
            <el-form label-position="right" label-width="50px" :model="formLogin">
                <el-form-item label="用户">
                    <el-input v-model="formLogin.admin_name"></el-input>
                </el-form-item>
                <el-form-item label="密码">
                    <el-input v-model="formLogin.admin_pass"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="submit()">登陆</el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>

<script>
import router from '@/router'
import RESTfulReq from '../../utils/RESTful-request'

let initObj = {
  tab: null,
  networkReq: null
}
export default {
  name: 'Login',
  components: {},
  mounted: function () {
  },
  beforeMount: function () {
    initObj.tab = this
    initObj.networkReq = new RESTfulReq(this.$attrs.url, initObj.tab)
  },
  methods: {
    submit: function () {
      initObj.networkReq.postReq(initObj.tab.formLogin, function (response) {
        window.localStorage.setItem('loginUserBaseInfo', JSON.stringify(response.data.data))
        initObj.tab.$attrs.success(response)
        router.push({ path: '/' })
      })
    }
  },
  data () {
    return {
      formLogin: {
        admin_name: '',
        admin_pass: ''
      }
    }
  },
  computed: {}
}
</script>

<style scoped>
    .main {
        width: 26%;
        height: 240px;
        background-color: white;
        left: 0;
        top: 170px;
        padding: 80px 37%;
    }

    .form-title {
        font-size: 20px;
        text-align: center;
        font-weight: 400;
    }

</style>

<template>
    <div class="main">
        <div class="form-container">
            <h2 class="form-title">登 陆</h2>
            <el-form label-position="right" label-width="50px" :model="formLogin">
                <el-form-item label="用户">
                    <el-input v-model="formLogin.user_name"></el-input>
                </el-form-item>
                <el-form-item label="密码">
                    <el-input v-model="formLogin.user_pass"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="submit()">登陆</el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>

<script>
import RESTfulReq from '../../utils/RESTful-request'

let initObj = {
  tab: null,
  networkReq: null
}
export default {
  name: 'Login',
  components: {},
  props: {
    url: {
      type: String,
      default: '/admin/login'
    },
    firstStep: {
      type: Function,
      default: function () {
      }
    },
    afterLoginSubmit: {
      type: Function,
      default: function (response) {
        window.localStorage.setItem('userInfo', JSON.stringify(response.data.data))
        this.$store.commit('userInfo', response.data.data)
        this.$router.push('/newActivity')
      }
    }
  },
  mounted: function () {
    this.firstStep()
  },
  beforeMount: function () {
    initObj.tab = this
    initObj.networkReq = new RESTfulReq(this.url)
  },
  methods: {
    submit: function () {
      initObj.networkReq.postReq(initObj.tab.formLogin)
        .then(function (response) {
          initObj.tab.afterLoginSubmit(response)
        })
    }
  },
  data () {
    return {
      formLogin: {
        user_name: '',
        user_pass: ''
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

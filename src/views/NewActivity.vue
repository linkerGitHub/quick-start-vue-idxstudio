<template>
  <el-card>
    <div slot="header" class="clearfix">
      <span>新建活动</span>
    </div>
    <activity-edit
      ref="actEdit"
      v-bind:activityData.sync="actData">
    </activity-edit>
    <div :style="{'padding-left': '120px'}">
      <el-button type="primary" @click="newAct">确认</el-button>
    </div>
  </el-card>
</template>

<script>

import ActivityEdit from '@/components/ActivityEdit'
import RESTfulReq from '@/idx-lib/utils/RESTful-request'

export default {
  name: 'newActivity',
  components: { ActivityEdit },
  mounted: function () {
  },
  beforeMount: function () {
  },
  methods: {
    newAct: function (e) {
      let theTab = this
      theTab.$refs['actEdit'].validForm()
        .then(function (res) {
          if (res) {
            this.req.postReq(theTab.actData)
              .then(function (response) {
              })
          }
        })
    }
  },
  data: function () {
    return {
      actData: {
        'involve_num_limit': 0,
        'activity_name': '',
        'activity_brief': '',
        'activity_run_start': '',
        'activity_run_end': '',
        'activity_apply_start': '',
        'activity_apply_end': '',
        'activity_pic_url': '',
        'activity_content': '',
        'input_field': []
      },
      req: new RESTfulReq('/activity')
    }
  },
  computed: {}
}
</script>

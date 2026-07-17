<script lang="ts">
import { addRandtime } from './utils';

export default {
  onLaunch: function () {
    console.log('App Launch')
  },
  onShow: function () {
    console.log('App Show')
  },
  onHide: function () {
    console.log('App Hide')
  },
  onPageNotFound: function (res) {
    uni.redirectTo({
      url: `/pages/public/errorPage?msg=你访问的页面不存在`,
    })
  },
  created() {
    // 给url 添加随机数，如果是微信环境，一定要记得防止微信缓存
    // addRandtime(true).then(state => {
    // }).catch(err => {
    // })
  },
  mounted() {

  }
}
</script>

<style lang="scss">
@import "uview-plus/index.scss";

.wftk_flex_row {
  display: flex;
  flex-direction: row;
  // justify-content: space-between;
  align-items: center;
}

.wftk_flex_row_center {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
}

.wftk_flex_row_sb {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
}

.wftk_flex_row_sa {
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  align-items: center;
}

.wftk_flex_column {
  display: flex;
  flex-direction: column;
  // justify-content: center;
  align-items: center;
}

.wftk_flex_column_center {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.wftk_flex_column_sb {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
}

.wftk_flex_column_sa {
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
}
</style>

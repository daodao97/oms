<template>
  <el-row ref="header" class="navbar" :style="{background: setting.envColor[user.env]}">
    <el-col :span="16">
      <hamburger
        :is-active="sidebar.opened"
        class="hamburger-container"
        @toggleClick="toggleSideBar"
      />
      <breadcrumb class="breadcrumb-container" />
    </el-col>
    <el-col :span="8">
      <div class="right-content">
        <div class="right-item">
          <VIcon
            name="ra-code"
            @click="gotoMenuEdit"
          />
        </div>
        <div
          v-if="showPageJsonSchemaIcon"
          class="right-item"
        >
          <PageEditor />
        </div>
        <div
          class="right-item-button"
          style="padding: 0"
        >
          <v-button :buttons="nav" />
        </div>
        <el-dropdown
          class="right-item"
          trigger="click"
        >
          <div class="user-info">
            <img
              :src="avatar ? avatar : defaultAvatar"
              class="user-avatar"
              alt="头像"
            > <span class="user-name">{{ nickname || name }}</span>
          </div>
          <template #dropdown>
            <el-dropdown-menu class="user-dropdown">
              <el-dropdown-item
                icon="oms-icon-index"
                @click="$router.push('/')"
              >首页</el-dropdown-item>
              <el-dropdown-item
                divided
                icon="el-icon-switch-button"
                @click="logout"
              >退出登录</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </el-col>
    <el-drawer
      v-if="showJsonSchema"
      :with-header="false"
      size="50%"
    />
  </el-row>
</template>

<script>
import { mapGetters } from 'vuex'
import Breadcrumb from './Breadcrumb/index.vue'
import Hamburger from './Hamburger/index.vue'
import PageEditor from './PageEditor.vue'
import { showEleByClassName, Cache, waterMarker } from '@okiss/utils'
import { VBtn as VButton } from '@okiss/vbtf'

export default {
  components: {
    Breadcrumb,
    Hamburger,
    VButton,
    PageEditor
  },
  data() {
    return {
      showExportPop: false,
      modulesList: this.getSetting('system_module'),
      showJsonSchema: false,
      json: '',
      key: 0,
      defaultAvatar: this.getSetting('defaultAvatar')
    }
  },
  computed: {
    ...mapGetters(['sidebar', 'avatar', 'name', 'nickname', 'nav']),
    hasNewMessage() {
      return this.$store.state.settings.hasNewMessage
    },
    moduleName() {
      return this.$store.state.app.moduleName
    },
    setting() {
      return this.$store.state.settings
    },
    user() {
      return this.$store.state.user
    },
    showPageJsonSchemaIcon() {
      return this.$store.state.settings.showPageJsonSchema || false
    }
  },
  mounted() {
    showEleByClassName('el-submenu is-active')
    const noticeStr = this.getSetting('navBarNotice')
    if (noticeStr.length > 0 && !this.getSetting('closeNavNotice') && this.showNotice(noticeStr)) {
      this.$notify({
        title: '提示',
        message: noticeStr,
        dangerouslyUseHTMLString: true,
        duration: 0,
        onClose: this.closeNavBarNotice
      })
    }
    if (this.user.env) {
      waterMarker({
        elRef: this.$refs.header.$el, 
        waterMark: this.user.env,
        color:"skyblue",
        size: "20"
      })
    }
  },
  methods: {
    toggleSideBar() {
      this.$store.dispatch('app/toggleSideBar')
    },
    async logout() {
      await this.$store.dispatch('user/logout')
      location.reload(`${location.origin}/#/login?redirect=${this.$route.fullPath}`)
    },
    getSetting(name) {
      return this.$store.state.settings[name]
    },
    async closeNavBarNotice() {
      await this.$store.commit('settings/updateSettings', { closeNavNotice: true })
      this.closeNotice(this.getSetting('navBarNotice'))
    },
    showPopover() {
      this.showExportPop = true
    },
    showNotice(text) {
      const key = 'dismiss:navbar_notice'
      if (!Cache.exist(key)) {
        return true
      }
      return Cache.get(key) !== text
    },
    closeNotice(text) {
      const key = 'dismiss:navbar_notice'
      Cache.set(key, text)
    },
    gotoMenuEdit() {
      if (this.$route?.meta?.pageId) {
        window.open(location.origin + location.pathname + '#/menu/' + this.$route?.meta?.pageId)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.el-dropdown-link {
  cursor: pointer;
  color: #409eff;
}

.el-icon-arrow-down {
  font-size: 12px;
}

.navbar {
  display: flex;
  height: 50px;
  /*overflow: hidden;*/
  position: relative;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);

  .hamburger-container {
    line-height: 50px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background 0.3s;
    -webkit-tap-highlight-color: transparent;

    &:hover {
      background: rgba(0, 0, 0, 0.025);
    }
  }

  .breadcrumb-container {
    float: left;
  }
}

.notice-setting {
  left: 50%;
  top: 50%;
  position: absolute;
  transform: translate(-50%, -50%);
}

.right-content {
  float: right;
  height: 100%;
  padding-right: 20px;
  color: rgba(0, 0, 0, 0.65);
  display: flex;

  .icon {
    font-size: 18px;

    &:focus {
      outline: none;
    }
  }

  .right-item {
    padding: 0 12px;
    height: 100%;
    transition: all 0.3s;
    cursor: pointer;
    display: flex;
    align-items: center;

    &:hover {
      background: rgba(0, 0, 0, 0.025);
    }
  }

  .right-item {
    padding: 0 12px;
    height: 100%;
    transition: all 0.3s;
    cursor: pointer;
    display: flex;
    align-items: center;

    &:hover {
      background: rgba(0, 0, 0, 0.025);
    }
  }

  .right-item-button {
    height: 100%;
    transition: all 0.3s;
    cursor: pointer;
    display: flex;
    align-items: center;
  }

  .user-info {
    height: 50px;
    line-height: 50px;
  }

  .user-avatar {
    width: 24px;
    height: 24px;
    line-height: 24px;
    border-radius: 50%;
    margin: 0 10px 0 0;
    color: #1890ff;
    vertical-align: middle;
    background: hsla(0, 0%, 100%, 0.85);
  }

  .user-name {
    vertical-align: middle;
  }
}
</style>

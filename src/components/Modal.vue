<template>
  <div>
    <div class="md-modal modal-msg md-modal-transition"
         :class="{'md-show':mdShow}"
         md-show>
      <div class="md-modal-inner">
        <div class="md-top">
          <button class="md-close"
                  @click="closePop()">Close</button>
        </div>
        <div class="md-content">
          <div class="confirm-tips">
            <slot name="message"></slot>
          </div>
          <div class="btn-wrap">
            <slot name="btnGroup"></slot>
          </div>
        </div>
      </div>
    </div>
    <div class="md-overlay"
         v-if="mdShow"></div>
  </div>
</template>
<script>
export default {
  data () {
    return {
      mdShow: true
    }
  },
  methods: {
    closePop () {
      this.$emit("modalshow")
      this.$emit("closeModal")
      this.$store.commit('closemodal')
    },
  }
}
</script>
<style>
</style>

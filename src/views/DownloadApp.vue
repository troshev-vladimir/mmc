<template>
  <div class="download-container">
    <p v-if="status === 'loading'">Preparing your download...</p>
    <p v-else-if="status === 'success'">Your download has started!</p>
    <p v-else-if="status === 'not-found'" class="error">
      ❌ File not found. Please check the link or contact support.
    </p>
    <p v-else-if="status === 'error'" class="error">
      ⚠️ Download failed. Please try again later.
    </p>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import axios from 'axios'

export default Vue.extend({
  data() {
    return {
      status: 'loading' as 'loading' | 'success' | 'not-found' | 'error'
    }
  },
  async mounted() {
    await this.downloadFile()
  },
  methods: {
    async downloadFile() {
      const virtualName = typeof this.$route.query.virtualName === 'string'
        ? this.$route.query.virtualName : ''
      const realUrl = `https://api.mmcflash.ru:8888/Releases?virtualName=${virtualName}`

      try {
        const response = await axios.get(realUrl, { responseType: 'blob', validateStatus: () => true })

        if (response.status === 404) {
          this.status = 'not-found'
          return
        }

        if (response.status < 200 || response.status >= 300) {
          this.status = 'error'
          return
        }

        const blob = new Blob([response.data])
        const link = document.createElement('a')
        link.href = window.URL.createObjectURL(blob)
        link.download = virtualName
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        window.URL.revokeObjectURL(link.href)

        this.status = 'success'

        // Optional: auto redirect after few seconds
        // setTimeout(() => this.$router.push('/'), 4000)
      } catch (error) {
        console.error('Download error:', error)
        this.status = 'error'
      }
    }
  }
})
</script>

<style scoped>
.download-container {
  text-align: center;
  margin-top: 50px;
  font-size: 1.1em;
}
.error {
  color: #000000;
}
</style>

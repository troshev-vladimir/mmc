<template>
  <div class="download-container">
    <!-- Initial state when no filename -->
    <div v-if="!hasFilename && status === 'init'" class="initial-state">
      <h2>{{ $t('download.releasesTitle') }}</h2>
      <p>{{ $t('download.releasesDescription') }}</p>
      <div class="releases-info">
        <p>{{ $t('download.releasesHint') }}</p>
      </div>
    </div>

    <!-- Download in progress -->
    <div v-else-if="status === 'loading'" class="progress-section">
      <p>{{ $t('download.preparing') }}</p>
      <div class="progress-bar">
        <div 
          class="progress-fill" 
          :style="{ width: progress + '%' }"
        ></div>
      </div>
      <p class="progress-text">{{ progress }}%</p>
      <p class="download-speed" v-if="downloadSpeed">
        {{ $t('download.speed') }}: {{ downloadSpeed }}
      </p>
    </div>

    <!-- Success state -->
    <div v-else-if="status === 'success'" class="success-section">
      <div class="success-icon">✅</div>
      <p>{{ $t('download.completed') }}</p>
      <p class="file-info">
        {{ $t('download.savedAs') }}: <strong>{{ filename }}</strong>
      </p>
   
    </div>

    <!-- Error states -->
    <p v-else-if="status === 'not-found'" class="error">
      ❌ {{ $t('download.notFound') }}
    </p>
    <p v-else-if="status === 'error'" class="error">
      ⚠️ {{ $t('download.failed') }}
    </p>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import axios from 'axios'

export default Vue.extend({
  name: 'DownloadApp',
  data() {
    return {
      status: 'init' as 'init' | 'loading' | 'success' | 'not-found' | 'error',
      hasFilename: false,
      progress: 0,
      downloadSpeed: '',
      filename: '' as string | null,
      cancelToken: null as any
    }
  },

  watch: {
    '$route.query': {
      handler: 'checkDownload',
      immediate: true
    }
  },

  methods: {
    checkDownload() {
      const filename = this.$route.query.filename as string
      
      if (!filename) {
        this.status = 'init'
        this.hasFilename = false
        return
      }

      this.filename = filename
      this.hasFilename = true
      this.status = 'loading'
      this.downloadFile()
    },

    async downloadFile() {
      if (!this.filename) return

      try {
        const realUrl = `https://api.mmcflash.ru:8888/Releases/${encodeURIComponent(this.filename)}`
        const source = axios.CancelToken.source()
        this.cancelToken = source

        const response = await axios.get(realUrl, {
          responseType: 'blob',
          validateStatus: () => true,
          cancelToken: source.token,
          onDownloadProgress: (progressEvent) => {
            if (progressEvent.total) {
              this.progress = Math.round((progressEvent.loaded / progressEvent.total) * 100)
            }
          }
        })

        if (response.status === 404) {
          this.status = 'not-found'
          return
        }

        if (response.status < 200 || response.status >= 300) {
          this.status = 'error'
          return
        }

        // Trigger download
        const blob = new Blob([response.data])
        const link = document.createElement('a')
        link.href = window.URL.createObjectURL(blob)
        link.download = this.filename
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        window.URL.revokeObjectURL(link.href)

        this.status = 'success'
      } catch (error) {
        if (axios.isCancel(error)) {
          this.status = 'init'
          this.progress = 0
        } else {
          console.error('Download error:', error)
          this.status = 'error'
        }
      }
    },

    downloadAgain() {
      this.status = 'loading'
      this.progress = 0
      this.downloadFile()
    }
  }
})
</script>

<style scoped>
.download-container {
  text-align: center;
  margin-top: 50px;
  font-size: 1.1em;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
}

.initial-state {
  padding: 40px 20px;
  background: #f8f9fa;
  border-radius: 10px;
  border: 1px solid #e9ecef;
}

.releases-info {
  margin-top: 20px;
  padding: 15px;
  background: white;
  border-radius: 5px;
  border-left: 4px solid #007bff;
}

.progress-bar {
  width: 100%;
  height: 20px;
  background-color: #f0f0f0;
  border-radius: 10px;
  overflow: hidden;
  margin: 20px 0;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #4CAF50, #45a049);
  transition: width 0.3s ease;
  border-radius: 10px;
}

.success-section {
  padding: 20px;
  background-color: #f8fff8;
  border-radius: 10px;
  border: 1px solid #4CAF50;
}

.error {
  color: #e53935;
  padding: 15px;
  background-color: #ffebee;
  border-radius: 5px;
  border: 1px solid #ffcdd2;
}

.download-again-btn {
  background-color: #2196F3;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  margin-top: 15px;
}
</style>

<i18n>
{
  "ru": {
    "download": {
      "releasesTitle": "Реализы",
      "releasesDescription": "Страница загрузки файлов",
      "releasesHint": "Файлы будут автоматически скачиваться при переходе по ссылкам скачивания",
      "preparing": "Подготовка к скачиванию...",
      "completed": "Скачивание завершено!",
      "savedAs": "Файл сохранен как",
      "speed": "Скорость",
      "again": "Скачать снова",
      "notFound": "Файл не найден",
      "failed": "Ошибка загрузки"
    }
  },
  "en": {
    "download": {
      "releasesTitle": "Releases",
      "releasesDescription": "File download page",
      "releasesHint": "Files will automatically download when you use download links",
      "preparing": "Preparing download...",
      "completed": "Download completed!",
      "savedAs": "File saved as",
      "speed": "Speed",
      "again": "Download again",
      "notFound": "File not found",
      "failed": "Download failed"
    }
  }
}
</i18n>
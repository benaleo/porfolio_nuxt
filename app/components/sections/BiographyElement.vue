<template>
  <div class="portfolio-page">
    <video autoplay muted loop class="background-video">
      <source src="/frame-about.mp4" type="video/mp4">
      Your browser does not support the video tag.
    </video>

    <div class="content-overlay">
      <div class="glowing-square">
        <div class="text-container">
          <p class="intro-text">Halo, saya seorang Fullstack Developer dengan keahlian utama pada bahasa pemrograman Java, Go, PHP, dan Vue.</p>
          <p class="detail-text">Saya berpengalaman menggunakan framework modern seperti Spring Boot (Java), Gin & Fiber (Go), Laravel (PHP), serta Nuxt.js (Vue).</p>
          <p class="detail-text">Dalam pengembangan aplikasi, saya terbiasa membangun REST API maupun GraphQL API, serta memiliki pemahaman mendalam tentang database SQL maupun NoSQL seperti MySQL, PostgreSQL, MongoDB, dan Elasticsearch.</p>
          <p class="detail-text">Selain itu, saya juga memiliki pengalaman bekerja di software house sebagai Project Manager sekaligus Developer, dengan portofolio proyek yang beragam, antara lain:</p>
          <ul class="project-list">
            <li>Aplikasi Event (Expo, pemerintahan, dan komunitas)</li>
            <li>Aplikasi Perbankan</li>
            <li>Website Company Profile dengan optimasi SEO</li>
          </ul>
          <p class="conclusion-text">Dengan kombinasi kemampuan teknis dan pengalaman manajemen proyek, saya mampu memberikan solusi end-to-end mulai dari perencanaan, pengembangan, hingga deployment aplikasi.</p>
        </div>
        <!-- close button -->
        <button @click="$emit('close')" class="close-button outline-2 outline-white px-6 py-2 rounded-xl cursor-pointer">Close</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PortfolioPage',
}
</script>

<style scoped>
.portfolio-page {
  position: relative;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; /* Contoh font yang mudah dibaca */
}

.background-video {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover; /* Pastikan video menutupi seluruh area */
  z-index: 1;
}

.content-overlay {
  position: relative;
  z-index: 10;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
}

.glowing-square {
  position: relative;
  width: 70%; /* Ukuran bingkai bisa disesuaikan */
  max-width: 900px;
  height: auto; /* Sesuaikan tinggi agar teks muat */
  padding: 2rem;
  border: 4px solid;
  border-image: linear-gradient(45deg, #ff007b, #ff8c00, #00ffff) 1; /* Gradien warna neon */
  box-shadow: 0 0 50px rgba(255, 0, 123, 0.7), 0 0 100px rgba(0, 255, 255, 0.7);
  animation: glowPulse 3s ease-in-out infinite alternate; /* Animasi kedip pada bingkai */
  background: rgba(0, 0, 0, 0.6); /* Latar belakang semi-transparan untuk teks */
  border-radius: 10px; /* Sedikit rounded corner */
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

@keyframes glowPulse {
  0% { box-shadow: 0 0 50px rgba(255, 0, 123, 0.7), 0 0 100px rgba(0, 255, 255, 0.7); }
  50% { box-shadow: 0 0 70px rgba(255, 140, 0, 0.8), 0 0 120px rgba(0, 255, 255, 0.8); }
  100% { box-shadow: 0 0 50px rgba(255, 0, 123, 0.7), 0 0 100px rgba(0, 255, 255, 0.7); }
}

.text-container {
  text-align: left;
  line-height: 1.8;
  font-size: 1.1rem;
  padding: 1rem;
}

.intro-text {
  font-size: 1.3rem;
  margin-bottom: 1rem;
  font-weight: bold;
  color: #00ffff; /* Warna teks yang kontras dengan latar belakang */
}

.detail-text, .conclusion-text {
  margin-bottom: 0.8rem;
}

.project-list {
  list-style-type: disc;
  margin-left: 20px;
  margin-bottom: 0.8rem;
}

.project-list li {
  margin-bottom: 0.4rem;
}
</style>
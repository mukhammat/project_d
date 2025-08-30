<template>
  <div class="catalog-bg" ref="catalogBg">
    <!-- Animated particles background -->
    <div class="particles-container">
      <div v-for="n in 20" :key="'particle-' + n" class="particle" :style="getParticleStyle()"></div>
    </div>

    <!-- Hero Section with 3D effects -->
    <div class="hero-section">
      <div class="hero-content">
          <!-- ЛОГОТИП -->
        <div class="hero-logo-wrapper">
            <img 
            :src="server + '/img/logo.png'"
            alt="Raqmet Логотип" 
            class="hero-logo" 
            />
        </div>
        <h1 class="hero-title">
          <span class="word word-1" data-text="Мясные">Мясные</span>
          <span class="word word-2" data-text="Деликатесы">Деликатесы</span>
          <span class="word word-3" data-text="Raqmet">Raqmet</span>
        </h1>
        
        <p class="hero-subtitle">
          <span class="typewriter">Авторские колбасы мастеров</span>
        </p>
        
        <div class="hero-stats">
          <div class="stat-item">
            <div class="stat-number" data-target="500000">0</div>
            <div class="stat-label">Довольных клиентов</div>
          </div>
          <div class="stat-item">
            <div class="stat-number" data-target="25">0</div>
            <div class="stat-label">Видов продукции</div>
          </div>
          <div class="stat-item">
            <div class="stat-number" data-target="15">0</div>
            <div class="stat-label">На рынке</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Interactive filter bar -->
    <div class="filter-section">
      <div class="filter-container">
        <div class="filter-title">Категории</div>
        <div class="filter-buttons">
          <button 
            v-for="category in categories" 
            :key="category"
            :class="['filter-btn', { active: activeFilter === category }]"
            @click="setActiveFilter(category)"
          >
            {{ category }}
          </button>
        </div>
      </div>
    </div>

    <!-- Main catalog -->
    <div class="catalog-container">
      <h2 class="catalog-title">
        <span class="title-3d">Наша</span>
        <span class="title-highlight"> продукция</span>
        <div class="title-underline"></div>
      </h2>
      
      <div v-if="loading" class="loading-state">
        <div class="loading-animation">
          <div class="loading-circle"></div>
          <div class="loading-circle"></div>
          <div class="loading-circle"></div>
        </div>
        <p class="loading-text">Загружаем деликатесы...</p>
      </div>
      
      <div v-else-if="error" class="error-state">
        <div class="error-animation">💥</div>
        <p>{{ error }}</p>
        <button class="retry-btn" @click="retryLoad">Попробовать снова</button>
      </div>
      
      <div v-else class="sausage-grid">
        <div 
          v-for="(sausage, index) in filteredSausages" 
          :key="sausage.id" 
          class="sausage-card"
          :style="{ 
            animationDelay: (index * 0.1) + 's',
            '--card-hue': (index * 60) % 360 
          }"
          @mouseenter="playHoverSound"
        >
          <!-- Card decorative elements -->
          <div class="card-decoration top-left"></div>
          <div class="card-decoration top-right"></div>
          <div class="card-decoration bottom-left"></div>
          <div class="card-decoration bottom-right"></div> 
          
          <!-- Image with advanced effects -->
          <div class="image-container">
            <div class="image-frame">
              <img :src="server + sausage.photo" :alt="sausage.name" class="sausage-photo" />
              <div class="image-reflection"></div>
            </div>
          </div>
          
          <!-- Product info with enhanced styling -->
          <div class="sausage-info">
            <h4 class="sausage-name">{{ sausage.name }}</h4>
            <p class="sausage-description">{{ sausage.description }}</p>
            
            <div class="rating">
              <span v-for="n in 5" :key="n" class="star" :class="{ filled: n <= sausage.rating }">⭐</span>
            </div>
            
            <div class="sausage-meta">
              <div class="meta-grid">
                <div class="meta-item weight">
                  <div class="meta-details">
                    <span class="meta-value">{{ sausage.weight }} г </span>
                    <span class="meta-label">Вес</span>
                  </div>
                </div>
              </div>
              
              <!-- <div class="price-section">
                <div class="old-price" v-if="sausage.oldPrice">{{ sausage.oldPrice }} ₽</div>
                <div class="current-price">{{ sausage.price }} ₽</div>
                <div class="price-per-kg">{{ Math.round(sausage.price / sausage.weight * 1000) }} ₽/кг</div>
              </div> -->
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Bottom CTA section -->
    <!-- <div class="cta-section">
      <div class="cta-content">
        <h3 class="cta-title">Готовы попробовать?</h3>
        <p class="cta-subtitle">Бесплатная доставка от 2000 ₽</p>
        <button class="cta-button">
          <span class="cta-btn-bg"></span>
          <span>Оформить заказ</span>
        </button>
      </div>
    </div> -->
    
    <div class="address-section">
      <p class="address-line">Улица Ахметова 20</p>
      <p class="address-line">г. Алматы</p>
    </div>

    <!-- Background decorative elements -->
    <div class="bg-decoration">
      <div class="mesh-gradient mesh-1"></div>
      <div class="mesh-gradient mesh-2"></div>
      <div class="mesh-gradient mesh-3"></div>
    </div>
  </div>
</template>

<script>


export default {
  name: 'SausageListPage',
  data() {
    return {
      server: 'http://45.63.43.62:5566',
      sausages: [],
      loading: true,
      error: null,
      activeFilter: 'Все',
      wishlist: [],
      cartItems: [],
      mousePosition: { x: 0, y: 0 }
    };
  },
  computed: {
    categories() {
      const cats = ['Все', ...new Set(this.sausages.map(s => s.category))];
      return cats;
    },
    filteredSausages() {
      if (this.activeFilter === 'Все') return this.sausages;
      return this.sausages.filter(s => s.category === this.activeFilter);
    }
  },
  async mounted() {
    this.fetchProducts();   // ← грузим с API
    
    this.animateCounters();
    this.setupMouseTracking();
    this.typeWriter();
  },
  methods: {
    async fetchProducts() {
      this.loading = true;
      this.error = null;
      try {
        const response = await fetch(`${this.server}/api/products`);
        if (!response.ok) throw new Error("Ошибка загрузки данных");
        const data = await response.json();
        console.log(data);
        this.sausages = data;
      } catch (err) {
        this.error = err.message || "Не удалось загрузить продукты";
      } finally {
        this.loading = false;
      }
    },

    getParticleStyle() {
      return {
        left: Math.random() * 100 + '%',
        animationDelay: Math.random() * 10 + 's',
        animationDuration: (Math.random() * 20 + 10) + 's'
      };
    },
    
    setActiveFilter(category) {
      this.activeFilter = category;
    },
    
    addToCart(sausage) {
      this.cartItems.push(sausage);
      this.showNotification(`${sausage.name} добавлен в корзину!`);
    },
    
    toggleWishlist(id) {
      const index = this.wishlist.indexOf(id);
      if (index > -1) {
        this.wishlist.splice(index, 1);
      } else {
        this.wishlist.push(id);
      }
    },
    
    playHoverSound() {
      // Визуальная обратная связь вместо звука
    },
    
    retryLoad() {
      this.fetchProducts();  // ← перезапрос
    },
    
    animateCounters() {
      setTimeout(() => {
        const counters = document.querySelectorAll('.stat-number');
        counters.forEach(counter => {
          const target = parseInt(counter.getAttribute('data-target'));
          let count = 0;
          const increment = target / 50;
          
          const timer = setInterval(() => {
            count += increment;
            if (count >= target) {
              counter.textContent = target + '+';
              clearInterval(timer);
            } else {
              counter.textContent = Math.floor(count) + '+';
            }
          }, 30);
        });
      }, 500);
    },
    
    setupMouseTracking() {
      document.addEventListener('mousemove', (e) => {
        this.mousePosition.x = e.clientX;
        this.mousePosition.y = e.clientY;
        
        const cards = document.querySelectorAll('.sausage-card');
        cards.forEach(card => {
          const rect = card.getBoundingClientRect();
          const x = e.clientX - rect.left - rect.width / 2;
          const y = e.clientY - rect.top - rect.height / 2;
          
          card.style.setProperty('--mouse-x', x + 'px');
          card.style.setProperty('--mouse-y', y + 'px');
        });
      });
    },
    
    typeWriter() {
      setTimeout(() => {
        const text = document.querySelector('.typewriter');
        if (text) {
          text.style.animation = 'typewriter 3s steps(40) 1s both, blink 0.75s step-end infinite';
        }
      }, 1000);
    },
    
    showNotification(message) {
      const notification = document.createElement('div');
      notification.className = 'notification';
      notification.textContent = message;
      notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: linear-gradient(135deg, #00c9ff, #92fe9d);
        color: white;
        padding: 15px 25px;
        border-radius: 50px;
        font-weight: 600;
        z-index: 10000;
        animation: slideInRight 0.3s ease-out;
        box-shadow: 0 8px 32px rgba(0,201,255,0.3);
      `;
      
      document.body.appendChild(notification);
      setTimeout(() => notification.remove(), 3000);
    }
  }
};
</script>


<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800;900&display=swap');

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.catalog-bg {
  min-height: 100vh;
  font-family: 'Poppins', sans-serif;
  background: 
    radial-gradient(circle at 20% 50%, rgba(255,107,107,0.3) 0%, transparent 50%),
    radial-gradient(circle at 80% 20%, rgba(72,202,228,0.3) 0%, transparent 50%),
    radial-gradient(circle at 40% 80%, rgba(254,202,87,0.3) 0%, transparent 50%),
    linear-gradient(135deg, #1e3c72 0%, #2a5298 50%, #667eea 100%);
  overflow-x: hidden;
  position: relative;
}

/* ---------- Hero Section ---------- */
.hero-section {
  padding: 80px 15px 60px;
  text-align: center;
  z-index: 1;
}

.hero-badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: rgba(255,255,255,0.2);
  backdrop-filter: blur(20px);
  border-radius: 50px;
  padding: 10px 20px;
  margin-bottom: 20px;
  color: white;
  font-weight: 500;
}

.badge-icon {
  font-size: 1.1rem;
}

.hero-title {
  font-size: 4rem;
  font-weight: 900;
  margin-bottom: 20px;
  line-height: 1.1;
  color: white;
}

.word {
  margin: 0 10px;
  display: inline-block;
  background: linear-gradient(45deg, #fff, #f0f9ff);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  font-size: 40%;
}

.hero-subtitle {
  font-size: 1.2rem;
  margin-bottom: 30px;
  color: rgba(255,255,255,0.9);
}

.hero-stats {
  display: flex;
  justify-content: center;
  gap: 30px;
  margin-top: 40px;
  flex-wrap: wrap;
}

.stat-item {
  text-align: center;
  color: white;
}

.stat-number {
  font-size: 2rem;
  font-weight: 700;
  background: linear-gradient(45deg, #feca57, #ff6b6b);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.stat-label {
  font-size: 0.9rem;
  margin-top: 5px;
}

/* ---------- Filter Section ---------- */
.filter-section {
  padding: 20px 0;
}

.filter-container {
  max-width: 1200px;
  margin: 0 auto;
  text-align: center;
  background: rgba(255,255,255,0.1);
  backdrop-filter: blur(20px);
  border-radius: 15px;
  padding: 20px;
}

.filter-title {
  color: white;
  font-size: 1.2rem;
  font-weight: 600;
  margin-bottom: 15px;
}

.filter-buttons {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 10px;
}

.filter-btn {
  background: rgba(255,255,255,0.1);
  border: 1px solid rgba(255,255,255,0.3);
  color: white;
  padding: 10px 18px;
  border-radius: 30px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.filter-btn:hover {
  background: rgba(255,255,255,0.2);
}

.filter-btn.active {
  background: linear-gradient(135deg, #ff6b6b, #feca57);
  border: none;
  color: white;
}

/* ---------- Catalog ---------- */
.catalog-container {
  max-width: 1200px;
  margin: 0 auto;
  background: rgba(255,255,255,0.95);
  border-radius: 20px;
  padding: 40px 20px 60px;
}

.catalog-title {
  text-align: center;
  font-size: 2.5rem;
  font-weight: 800;
  margin-bottom: 40px;
  color: #333;
}

/* Loading */
.loading-state {
  text-align: center;
  padding: 80px 0;
  color: #667eea;
}

.loading-animation {
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-bottom: 20px;
}

.loading-circle {
  width: 15px;
  height: 15px;
  border-radius: 50%;
  background: linear-gradient(45deg, #ff6b6b, #feca57, #48cae4);
  animation: bounce 1.4s infinite;
}

@keyframes bounce {
  0%, 80%, 100% { transform: scale(0); }
  40% { transform: scale(1); }
}

/* ---------- Product Grid ---------- */
.sausage-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 20px;
}

.sausage-card {
  background: white;
  border: 1px solid #eee;
  border-radius: 15px;
  padding: 20px 15px;
  display: flex;
  flex-direction: column;
  align-items: center;
  transition: transform 0.3s ease;
}

.sausage-card:hover {
  transform: translateY(-5px);
}

.image-container img {
  max-width: 100%;
  border-radius: 10px;
}

.sausage-info {
  text-align: center;
  margin-top: 15px;
}

.sausage-name {
  font-size: 1.1rem;
  font-weight: 700;
  margin-bottom: 8px;
}

.sausage-description {
  font-size: 0.9rem;
  color: #666;
  margin-bottom: 12px;
}

.rating {
  margin-bottom: 10px;
}

.star {
  color: #ddd;
}

.star.filled {
  color: gold;
}

.price-section {
  margin: 10px 0;
}

.old-price {
  text-decoration: line-through;
  color: #999;
  font-size: 0.9rem;
}

.current-price {
  font-size: 1.2rem;
  font-weight: 700;
  color: #333;
}

.price-per-kg {
  font-size: 0.8rem;
  color: #777;
}

.action-buttons {
  display: flex;
  gap: 10px;
  justify-content: center;
  margin-top: 15px;
}

.add-to-cart-btn,
.wishlist-btn {
  padding: 10px 15px;
  border: none;
  border-radius: 30px;
  cursor: pointer;
  font-weight: 600;
}

.add-to-cart-btn {
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
}

.wishlist-btn {
  background: #eee;
}

.wishlist-btn.active {
  background: pink;
}

/* ---------- CTA Section ---------- */
.cta-section {
  text-align: center;
  padding: 40px 20px;
  color: white;
}

.cta-button {
  margin-top: 20px;
  padding: 12px 25px;
  border: none;
  border-radius: 30px;
  background: linear-gradient(135deg, #ff6b6b, #feca57);
  color: white;
  font-weight: 600;
  cursor: pointer;
}

/* ---------- Адаптивность ---------- */
@media (max-width: 992px) {
  .hero-title { font-size: 3rem; }
  .hero-stats { gap: 20px; }
}

@media (max-width: 600px) {
  .hero-title { font-size: 2rem; }
  .hero-subtitle { font-size: 1rem; }
  .catalog-title { font-size: 1.8rem; }
  .sausage-grid { grid-template-columns: 1fr; }
  .hero-section { padding: 50px 10px 30px; }
}

.hero-logo-wrapper {
  display: flex;
  justify-content: center;
  margin-bottom: 10px;
}

.hero-logo {
  height: 350px;   /* можно увеличить/уменьшить */
  width: auto;
  object-fit: contain;
}

/* ---------- Address Section ---------- */
.address-section {
  text-align: center;
  margin: 80px 0 50px;
}

.address-line {
  font-size: 30px;        /* крупный текст */
  font-weight: 400;       /* жирный */
  color: #fff;            /* белый цвет */
  margin: 8px 0;
  line-height: 1.4;
}
</style>

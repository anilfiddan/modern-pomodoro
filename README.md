# Modern Pomodoro

Minimal, Apple/Notion esintili tasarıma sahip modern bir Pomodoro zamanlayıcısı. React + Vite ile geliştirilmiştir ve kullanım sürecini kaydedip kaldığınız yerden devam etmenizi sağlar.

![Pomodoro UI](./public/cover.png "Örnek arayüz") <!-- Opsiyonel: dilediğiniz görseli ekleyebilirsiniz -->

## Özellikler

- Pomodoro (25 dk), Kısa Mola (5 dk) ve Uzun Mola (15 dk) modları
- Mod seçici, büyük timer halkası ve sezgisel kontrol düğmeleri
- Başlat/Duraklat/Sıfırla denetimleri
- Sürenin arka planda doğru azalması (sekme değişse bile)
- Bitiş bildirimleri ve hafif ses efekti
- LocalStorage ile mod ve kalan sürenin saklanması
- Apple/Notion stilinde soft gri gradient, yuvarlatılmış kartlar ve kalın tipografi
- Tamamen responsive arayüz

## Teknoloji yığını

- [React 18](https://react.dev/)
- [Vite 5](https://vitejs.dev/)
- CSS ile el yapımı tasarım (Google Fonts: Manrope)

## Geliştirme ortamını çalıştırma

```bash
# Bağımlılıkları yükleyin
npm install

# Development server (http://localhost:5173)
npm run dev

# Production build
npm run build

# Build'i yerelde test edin
npm run preview
```

> İlk kez bildirim veya ses kullanılabilmesi için tarayıcıdan izin vermeniz gerekir. Chrome yeni sekmede açılmazsa `http://127.0.0.1:5173/` adresini elle yazın ve mevcut Vite prosesinin başka terminalde açık olmadığından emin olun.

## Proje yapısı

```
pomodoro
├── src
│   ├── App.jsx              # Ana state yönetimi ve layout
│   ├── main.jsx             # React root
│   ├── styles.css           # Global tasarım
│   └── components
│       ├── Header.jsx
│       ├── ModeSelector.jsx
│       ├── Timer.jsx
│       └── Controls.jsx
├── package.json
├── vite.config.js
└── README.md
```

## Vercel dağıtımı

1. Projeyi GitHub/GitLab/Bitbucket deposuna push edin.
2. [Vercel](https://vercel.com/) üzerinde **New Project** → depoyu seçin.
3. Varsayılan ayarlar yeterli, ancak gerekirse manuel olarak:
   - Framework: **Vite**
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`
4. Deploy tamamlandığında verilen URL üzerinden uygulamayı paylaşabilirsiniz.

Komut satırından dağıtmak isterseniz:

```bash
npm install
npm run build
npx vercel deploy --prod
```

## Notlar

- LocalStorage kullanıldığı için mod ve kalan süre tarayıcıya özel olarak saklanır.
- Ses efekti Web Audio API ile üretilir; tarayıcı kullanıcı etkileşimi gerektirebilir.
- Notification API yalnızca HTTPS veya `localhost` üzerinde çalışır.

## Lisans

Bu proje kişisel/öğrenim amaçlıdır. Gerektiğinde kendi lisansınızı ekleyebilirsiniz.

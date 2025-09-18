// Глобальні змінні
let displayedTitles = [];
let currentQuery = "Politics"; // За замовчуванням
let currentLang = "en"; // За замовчуванням
let currentCountry = "Any"; // За замовчуванням

// Елементи DOM
const stocks = document.querySelector("#stocks");
const finance = document.querySelector("#finance");
const politics = document.querySelector("#politics");
const technology = document.querySelector("#technology");
const searchInput = document.querySelector("#searchInput");
const languageToggle = document.querySelector("#languageToggle");
const countryToggle = document.querySelector("#countryToggle");
const countryMenu = document.querySelector("#countryMenu");
const menuToggle = document.querySelector("#menuToggle");
const mobileMenu = document.querySelector("#mobileMenu");
const mobileStocks = document.querySelector("#mobileStocks");
const mobileFinance = document.querySelector("#mobileFinance");
const mobilePolitics = document.querySelector("#mobilePolitics");
const mobileTechnology = document.querySelector("#mobileTechnology");
const mobileCountryToggle = document.querySelector("#mobileCountryToggle");
const mobileCountryMenu = document.querySelector("#mobileCountryMenu");

// Показ новин при завантаженні сторінки
window.addEventListener("load", () => {
  console.log("Сторінка завантажена, виклик fetchNews із параметрами:", { currentQuery, currentLang, currentCountry });
  fetchNews(currentQuery, currentLang, currentCountry);
});

// Обробники для десктоп меню
if (stocks) stocks.addEventListener("click", () => {
  currentQuery = "stocks";
  fetchNews(currentQuery, currentLang, currentCountry);
});
if (finance) finance.addEventListener("click", () => {
  currentQuery = "finance";
  fetchNews(currentQuery, currentLang, currentCountry);
});
if (politics) politics.addEventListener("click", () => {
  currentQuery = "politics";
  fetchNews(currentQuery, currentLang, currentCountry);
});
if (technology) technology.addEventListener("click", () => {
  currentQuery = "technology";
  fetchNews(currentQuery, currentLang, currentCountry);
});

// Обробники для мобільного меню
if (mobileStocks) mobileStocks.addEventListener("click", () => {
  currentQuery = "stocks";
  fetchNews(currentQuery, currentLang, currentCountry);
  toggleMenu();
});
if (mobileFinance) mobileFinance.addEventListener("click", () => {
  currentQuery = "finance";
  fetchNews(currentQuery, currentLang, currentCountry);
  toggleMenu();
});
if (mobilePolitics) mobilePolitics.addEventListener("click", () => {
  currentQuery = "politics";
  fetchNews(currentQuery, currentLang, currentCountry);
  toggleMenu();
});
if (mobileTechnology) mobileTechnology.addEventListener("click", () => {
  currentQuery = "technology";
  fetchNews(currentQuery, currentLang, currentCountry);
  toggleMenu();
});

// Пошук на Enter
if (searchInput) {
  searchInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      const value = searchInput.value.toLowerCase().trim();
      if (value) {
        currentQuery = value;
        fetchNews(currentQuery, currentLang, currentCountry);
      }
    }
  });
}

// Перемикач мови
if (languageToggle) {
  languageToggle.addEventListener("click", () => {
    currentLang = currentLang === "en" ? "uk" : "en";
    languageToggle.textContent = currentLang === "en" ? "En" : "Ua";
    fetchNews(currentQuery, currentLang, currentCountry);
  });
}

// Обробка випадаючих меню
function toggleDropdown(menu) {
  if (!menu) {
    console.error("Меню не знайдено");
    return;
  }
  menu.classList.toggle("hidden");
}

// Закриття випадаючих меню при кліку поза ними
document.addEventListener("click", (e) => {
  if (!e.target.closest(".dropdown")) {
    if (countryMenu) countryMenu.classList.add("hidden");
    if (mobileCountryMenu) mobileCountryMenu.classList.add("hidden");
  }
});

// Обробники для випадаючих меню країн
if (countryToggle) {
  countryToggle.addEventListener("click", () => toggleDropdown(countryMenu));
}
if (mobileCountryToggle) {
  mobileCountryToggle.addEventListener("click", () => toggleDropdown(mobileCountryMenu));
}

// Вибір країни (десктоп)
if (countryMenu) {
  countryMenu.querySelectorAll(".dropdown-item").forEach((item) => {
    item.addEventListener("click", (e) => {
      const value = e.target.dataset.value;
      currentCountry = value;
      countryToggle.textContent = e.target.textContent;
      mobileCountryToggle.textContent = e.target.textContent;
      countryMenu.classList.add("hidden");
      fetchNews(currentQuery, currentLang, currentCountry);
    });
  });
}

// Вибір країни (мобільне)
if (mobileCountryMenu) {
  mobileCountryMenu.querySelectorAll(".dropdown-item").forEach((item) => {
    item.addEventListener("click", (e) => {
      const value = e.target.dataset.value;
      currentCountry = value;
      countryToggle.textContent = e.target.textContent;
      mobileCountryToggle.textContent = e.target.textContent;
      mobileCountryMenu.classList.add("hidden");
      fetchNews(currentQuery, currentLang, currentCountry);
      toggleMenu();
    });
  });
}

// Перемикання мобільного меню
function toggleMenu() {
  if (!mobileMenu) {
    console.error("mobileMenu не знайдено");
    return;
  }
  console.log("Перемикання меню, поточний стан:", mobileMenu.classList.contains("hidden"));
  mobileMenu.classList.toggle("hidden");
  menuToggle.classList.toggle("active");
}

if (menuToggle) {
  menuToggle.addEventListener("click", toggleMenu);
} else {
  console.error("menuToggle не знайдено");
}

// Функція для отримання новин через проксі
async function fetchNews(query, lang, country) {
  try {
    const url = `/api/fetch-news?query=${encodeURIComponent(query)}&lang=${lang}${country !== 'Any' ? `&country=${country}` : ''}`;
    console.log("Надсилаємо запит до API:", url);
    const response = await fetch(url);
    if (!response.ok) {
      console.error("Помилка HTTP:", response.status, response.statusText);
      throw new Error(`Помилка отримання даних: ${response.status}`);
    }
    const data = await response.json();
    console.log("Отримано дані:", data);
    console.log("Кількість статей:", data.articles ? data.articles.length : 0);
    bindData(data.articles || []);
  } catch (error) {
    console.error("Помилка в fetchNews:", error);
  }
}

// Прив'язка даних до DOM
function bindData(articles) {
  const cardsContainer = document.querySelector("#cards-container");
  const cardTemplate = document.querySelector("#card-template");

  if (!cardsContainer || !cardTemplate) {
    console.error("cards-container або card-template не знайдено");
    return;
  }

  cardsContainer.innerHTML = "";
  displayedTitles = [];

  if (!articles || !Array.isArray(articles) || articles.length === 0) {
    console.warn("Немає статей для відображення");
    return;
  }

  articles.forEach((article) => {
    if (!article.title || !article.description) {
      console.warn("Стаття пропущена через відсутність даних:", article);
      return;
    }
    const cardClone = cardTemplate.content.cloneNode(true);
    fillData(cardClone, article);
    const appendedCard = cardsContainer.appendChild(cardClone.firstElementChild);
    if (appendedCard) {
      appendedCard.classList.add("animate-fadeIn");
      appendedCard.addEventListener("click", () => {
        window.open(article.url, "_blank");
      });
    } else {
      console.error("Не вдалося додати картку:", cardClone);
    }
  });
}

// Заповнення даних у картку
function fillData(cardClone, article) {
  const newsImg = cardClone.querySelector("#cardImg");
  const newsHeading = cardClone.querySelector("#cardHeading");
  const newsDate = cardClone.querySelector("#cardDate");
  const newsDes = cardClone.querySelector("#cardDescription");
  const newsSource = cardClone.querySelector("#cardSource");

  if (newsImg) newsImg.src = article.image || "https://via.placeholder.com/400x200";
  if (newsHeading) newsHeading.textContent = article.title;
  if (newsDes) newsDes.textContent = article.description;
  if (newsSource) newsSource.textContent = article.source.name;
  if (newsDate) newsDate.textContent = ` - ${new Date(article.publishedAt).toLocaleString("uk-UA")}`;
}
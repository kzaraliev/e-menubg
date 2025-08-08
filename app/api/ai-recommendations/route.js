import { NextResponse } from "next/server";
import { sendOpenAi } from "@/libs/gpt";
import { getUIText } from "@/libs/uiTranslations";

// Simple in-memory cache for cost optimization
const responseCache = new Map();
const CACHE_TTL = 10 * 60 * 1000; // 10 minutes cache

export async function POST(req) {
  try {
    const { message, menuData, currentLanguage = 'bg' } = await req.json();

    if (!message || !menuData) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const { restaurant, categories } = menuData;

    // Create cache key for cost optimization
    const cacheKey = `${restaurant._id}-${message.toLowerCase().trim()}-${currentLanguage}`;
    
    // Pre-filter obvious non-food questions to save API costs
    const isOffTopic = checkIfOffTopic(message, currentLanguage);
    if (isOffTopic) {
      console.log("🚫 Off-topic question blocked - saved API cost!");
      const offTopicResponse = getUIText('aiOffTopic', currentLanguage);
      
      return NextResponse.json({
        response: offTopicResponse,
        recommendations: []
      });
    }

    // Check cache first to save money
    const cached = responseCache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
      console.log("💰 Using cached response - saved API cost!");
      return NextResponse.json(cached.data);
    }

    // Prepare minimal menu data for AI analysis (cost optimization - fewer tokens)
    const menuForAI = categories.map(category => ({
      cat: category.name, // Shortened field names to save tokens
      items: category.products.map(product => ({
        n: product.name,
        d: product.description?.substring(0, 50) || '', // Limit description length
        p: product.priceBGN,
        s: product.size || '',
        a: product.allergens || [],
        veg: product.isVegetarian,
        vgn: product.isVegan,
        hot: product.isSpicy,
        pop: product.isPopular,
        avl: product.isAvailable,
        min: product.preparationTime || null,
        id: product._id
      }))
    }));

    // Create system prompt in the appropriate language
    const systemPrompt = createSystemPrompt(restaurant, menuForAI, currentLanguage);
    
    // Create messages for OpenAI
    const messages = [
      {
        role: "system",
        content: systemPrompt
      },
      {
        role: "user",
        content: message
      }
    ];

    // Get AI response with balanced optimization (accuracy + cost)
    const aiResponse = await sendOpenAi(messages, "ai-assistant", 200, 0.5);

    if (!aiResponse) {
      console.error("OpenAI API call failed - using fallback logic");
      // Use intelligent fallback logic when AI is not available
      const fallbackResult = getFallbackRecommendations(message, menuData, currentLanguage);
      
      return NextResponse.json({
        response: fallbackResult.response,
        recommendations: fallbackResult.recommendations
      });
    }

    // Parse AI response to extract recommendations
    const { response, productIds } = parseAIResponse(aiResponse);

    // Find recommended products
    const recommendations = [];
    if (productIds && productIds.length > 0) {
      categories.forEach(category => {
        category.products.forEach(product => {
          if (productIds.includes(product._id)) {
            recommendations.push(product);
          }
        });
      });
    }

    const finalResponse = {
      response,
      recommendations: recommendations.slice(0, 5) // Limit to 5 recommendations
    };

    // Cache successful responses to save money on future identical queries
    responseCache.set(cacheKey, {
      data: finalResponse,
      timestamp: Date.now()
    });

    // Clean old cache entries periodically
    if (responseCache.size > 1000) {
      const oldEntries = Array.from(responseCache.entries())
        .filter(([, value]) => Date.now() - value.timestamp > CACHE_TTL);
      oldEntries.forEach(([key]) => responseCache.delete(key));
    }

    return NextResponse.json(finalResponse);

  } catch (error) {
    console.error("AI recommendations error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

function createSystemPrompt(restaurant, menuData, language) {
  const restaurantName = restaurant.name;
  
  if (language === 'en') {
    return `You are an AI assistant for ${restaurantName}. ONLY ANSWER QUESTIONS ABOUT MENU AND FOOD.

MENU: ${JSON.stringify(menuData, null, 2)}

IMPORTANT - RESTRICTIONS:
- ONLY ANSWER questions about: food, dishes, menu, recommendations, allergens, prices, diet
- DO NOT ANSWER: geography, politics, math, general knowledge, personal advice
- If question is NOT about food: "Sorry, I only help with menu and food questions."

MENU ANALYSIS:
- "hot": true = SPICY dish
- "veg": true = vegetarian  
- "vgn": true = vegan
- "pop": true = popular

FOOD RULES:
1. Answer in 2-3 sentences maximum
2. Always check dish properties accurately
3. If spicy dishes exist (hot: true), recommend them for "spicy" requests
4. Include product IDs at end: "RECOMMENDED_IDS: [id1, id2]"
5. Explain why you recommend the dish

FOOD EXAMPLE:
"For spicy - I recommend Caesar Salad! It's marked as spicy and very popular (11.98 BGN).
RECOMMENDED_IDS: [507f1f77bcf86cd799439011]"

NON-FOOD EXAMPLE:
Question: "What is the capital of Austria?"
Answer: "Sorry, I only help with menu and food questions."`;
  }

  // Bulgarian system prompt - balanced for accuracy and cost
  return `Ти си AI асистент за ${restaurantName}. ОТГОВАРЯШ САМО НА ВЪПРОСИ ЗА МЕНЮТО И ХРАНАТА.

МЕНЮ: ${JSON.stringify(menuData, null, 2)}

ВАЖНО - ОГРАНИЧЕНИЯ:
- ОТГОВАРЯЙ САМО на въпроси за: храна, ястия, меню, препоръки, алергени, цени, диета
- НЕ ОТГОВАРЯЙ на: география, политика, математика, общи знания, личен съвет
- Ако въпросът НЕ Е за храната: "Извинявай, аз помагам само с въпроси за менюто и храната."

АНАЛИЗ НА МЕНЮТО:
- "hot": true = ЛЮТO ястие  
- "veg": true = вегетарианско
- "vgn": true = веган
- "pop": true = популярно

ПРАВИЛА ЗА ХРАНА:
1. Отговаряй в 2-3 изречения максимум
2. Винаги проверявай свойствата на ястията точно
3. Ако има люти ястия (hot: true), препоръчай ги за "люто"
4. Включи ID-та в края: "RECOMMENDED_IDS: [id1, id2]"
5. Обясни защо препоръчваш ястието

ПРИМЕР ЗА ХРАНА:
"За люто - препоръчвам Салата Цезар! Тя е означена като пикантна и е много популярна (11.98 лв).
RECOMMENDED_IDS: [507f1f77bcf86cd799439011]"

ПРИМЕР ЗА НЕ-ХРАНА:
Въпрос: "Коя е столицата на Австрия?"
Отговор: "Извинявай, аз помагам само с въпроси за менюто и храната."`;
}

function parseAIResponse(aiResponse) {
  // Look for RECOMMENDED_IDS at the end of the response
  const idPattern = /RECOMMENDED_IDS:\s*\[(.*?)\]/;
  const match = aiResponse.match(idPattern);
  
  let productIds = [];
  let response = aiResponse;

  if (match) {
    // Extract IDs and clean them
    const idString = match[1];
    productIds = idString
      .split(',')
      .map(id => id.trim().replace(/['"]/g, ''))
      .filter(id => id.length > 0);
    
    // Remove the RECOMMENDED_IDS line from the response
    response = aiResponse.replace(idPattern, '').trim();
  }

  return {
    response,
    productIds
  };
}

// Intelligent fallback system when OpenAI is not available
function getFallbackRecommendations(userMessage, menuData, language) {
  const { restaurant, categories } = menuData;
  const message = userMessage.toLowerCase();
  
  // Collect all products
  const allProducts = [];
  categories.forEach(category => {
    category.products.forEach(product => {
      allProducts.push({
        ...product,
        categoryName: category.category
      });
    });
  });
  
  let recommendations = [];
  let responseText = "";
  
  // Pattern matching for common queries (balanced accuracy and brevity)
  if (message.includes('люто') || message.includes('spicy') || message.includes('острое')) {
    recommendations = allProducts.filter(p => p.isSpicy);
    responseText = language === 'bg' 
      ? recommendations.length > 0 
        ? `Наши люти ястия - отлични за любителите на пикантното:`
        : `В момента няма люти ястия в менюто.`
      : recommendations.length > 0
        ? `Our spicy dishes - perfect for spice lovers:`
        : `No spicy dishes currently available.`;
  }
  else if (message.includes('вегетариан') || message.includes('vegetarian') || message.includes('вегетарианск')) {
    recommendations = allProducts.filter(p => p.isVegetarian);
    responseText = language === 'bg' 
      ? recommendations.length > 0 ? `Вегетариански опции:` : `Няма вегетариански ястия в менюто.`
      : recommendations.length > 0 ? `Vegetarian options:` : `No vegetarian dishes available.`;
  }
  else if (message.includes('веган') || message.includes('vegan')) {
    recommendations = allProducts.filter(p => p.isVegan);
    responseText = language === 'bg' 
      ? recommendations.length > 0 ? `Веган ястия:` : `Няма веган ястия в менюто.`
      : recommendations.length > 0 ? `Vegan dishes:` : `No vegan dishes available.`;
  }
  else if (message.includes('популярн') || message.includes('popular') || message.includes('препоръчай') || message.includes('recommend')) {
    recommendations = allProducts.filter(p => p.isPopular);
    responseText = language === 'bg' 
      ? recommendations.length > 0 ? `Популярни ястия - любими на клиентите:` : `Всички ястия са еднакво добри!`
      : recommendations.length > 0 ? `Popular dishes - customer favorites:` : `All dishes are equally great!`;
  }
  else if (message.includes('бърз') || message.includes('quick') || message.includes('fast') || message.includes('минут')) {
    recommendations = allProducts.filter(p => p.preparationTime && p.preparationTime <= 10);
    responseText = language === 'bg' ? `Бързи ястия:` : `Quick dishes:`;
  }
  else if (message.match(/под\s*(\d+)|under\s*(\d+)|до\s*(\d+)/)) {
    const priceMatch = message.match(/(\d+)/);
    const maxPrice = priceMatch ? parseInt(priceMatch[1]) : 20;
    recommendations = allProducts.filter(p => p.price <= maxPrice);
    responseText = language === 'bg' ? `Под ${maxPrice} лв:` : `Under ${maxPrice} BGN:`;
  }
  else if (message.includes('салат') || message.includes('salad')) {
    recommendations = allProducts.filter(p => 
      p.name.toLowerCase().includes('салат') || 
      p.name.toLowerCase().includes('salad') ||
      p.categoryName.toLowerCase().includes('салат')
    );
    responseText = language === 'bg' ? `Салати:` : `Salads:`;
  }
  else if (message.includes('пица') || message.includes('pizza')) {
    recommendations = allProducts.filter(p => 
      p.name.toLowerCase().includes('пица') || 
      p.name.toLowerCase().includes('pizza') ||
      p.categoryName.toLowerCase().includes('пица')
    );
    responseText = language === 'bg' ? `Пици:` : `Pizzas:`;
  }
  else {
    // Default: show popular items
    recommendations = allProducts.filter(p => p.isPopular).slice(0, 3);
    if (recommendations.length === 0) {
      recommendations = allProducts.slice(0, 3);
    }
    responseText = language === 'bg' ? `Препоръки:` : `Recommendations:`;
  }
  
  // Limit recommendations to 5
  recommendations = recommendations.slice(0, 5);
  
  return {
    response: responseText,
    recommendations: recommendations
  };
}

// Pre-filter function to catch obvious non-food questions and save API costs
function checkIfOffTopic(message, language) {
  const lowerMessage = message.toLowerCase();
  
  // Food-related keywords (allowed topics)
  const foodKeywords = [
    // Bulgarian
    'храна', 'ястие', 'ястия', 'меню', 'препорък', 'алерген', 'цена', 'лев', 'лв', 'вегетариан', 'веган', 
    'люто', 'пикантн', 'солен', 'сладк', 'киселин', 'горчив', 'салата', 'супа', 'пица', 'паста', 
    'месо', 'риба', 'пиле', 'свинско', 'телешко', 'млечн', 'сирене', 'масло', 'хляб', 'десерт',
    'напитка', 'вода', 'кафе', 'чай', 'сок', 'бира', 'вино', 'коктейл', 'диета', 'калори',
    'порция', 'размер', 'готвене', 'печен', 'пърж', 'варен', 'сурово', 'свеж', 'топъл', 'студен',
    'завтрак', 'обяд', 'вечеря', 'закуска', 'предястие', 'основно', 'гарнитура',
    
    // English  
    'food', 'dish', 'dishes', 'menu', 'recommend', 'allergen', 'price', 'cost', 'vegetarian', 'vegan',
    'spicy', 'hot', 'mild', 'sweet', 'sour', 'bitter', 'salty', 'salad', 'soup', 'pizza', 'pasta',
    'meat', 'fish', 'chicken', 'pork', 'beef', 'dairy', 'cheese', 'butter', 'bread', 'dessert',
    'drink', 'water', 'coffee', 'tea', 'juice', 'beer', 'wine', 'cocktail', 'diet', 'calories',
    'portion', 'size', 'cooking', 'baked', 'fried', 'boiled', 'raw', 'fresh', 'warm', 'cold',
    'breakfast', 'lunch', 'dinner', 'snack', 'appetizer', 'main', 'side'
  ];
  
  // Obvious non-food topics (blocked)
  const offTopicKeywords = [
    // Geography & Places
    'столица', 'град', 'държава', 'континент', 'океан', 'планина', 'река', 'море',
    'capital', 'city', 'country', 'continent', 'ocean', 'mountain', 'river', 'sea',
    'vienna', 'austria', 'sofia', 'bulgaria', 'europe', 'america', 'asia', 'africa',
    
    // Politics & History
    'политика', 'партия', 'избори', 'президент', 'министър', 'война', 'история',
    'politics', 'party', 'election', 'president', 'minister', 'war', 'history',
    
    // Math & Science
    'математика', 'химия', 'физика', 'биология', 'формула', 'уравнение',
    'mathematics', 'chemistry', 'physics', 'biology', 'formula', 'equation',
    
    // Technology (non-food related)
    'компютър', 'софтуер', 'програма', 'интернет', 'android', 'iphone',
    'computer', 'software', 'program', 'internet', 'android', 'iphone',
    
    // Personal advice
    'връзка', 'любов', 'работа', 'кариера', 'семейство',
    'relationship', 'love', 'job', 'career', 'family',
    
    // Entertainment
    'филм', 'музика', 'книга', 'игра', 'спорт', 'футбол', 'тенис',
    'movie', 'music', 'book', 'game', 'sport', 'football', 'tennis'
  ];
  
  // Check if message contains any food keywords
  const hasFoodKeywords = foodKeywords.some(keyword => lowerMessage.includes(keyword));
  
  // Check if message contains obvious off-topic keywords
  const hasOffTopicKeywords = offTopicKeywords.some(keyword => lowerMessage.includes(keyword));
  
  // If it has off-topic keywords and no food keywords, it's probably off-topic
  if (hasOffTopicKeywords && !hasFoodKeywords) {
    return true;
  }
  
  // If message is very short and has no food keywords, might be off-topic
  if (lowerMessage.length < 10 && !hasFoodKeywords) {
    return true;
  }
  
  // Questions that are clearly not about food
  const offTopicPatterns = [
    /коя е столицата/i, /what is the capital/i,
    /колко е \d+ \+ \d+/i, /what is \d+ \+ \d+/i,
    /кой е президент/i, /who is the president/i,
    /кога е роден/i, /when was.*born/i,
    /как да направя/i, /how to make.*money/i,
    /какво е времето/i, /what is the weather/i
  ];
  
  if (offTopicPatterns.some(pattern => pattern.test(lowerMessage))) {
    return true;
  }
  
  return false;
}

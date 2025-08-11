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

    // Prepare ultra-minimal menu data for AI analysis (aggressive token optimization)
    const menuForAI = categories.map(category => ({
      c: category.name, // cat -> c
      i: category.products
        .filter(product => product.isAvailable) // Only send available items
        .map(product => {
          // Create compact array format: [name, price, size, description_snippet, flags, id]
          const flags = 
            (product.isVegetarian ? 'v' : '') +
            (product.isVegan ? 'g' : '') +
            (product.isSpicy ? 'h' : '') +
            (product.isPopular ? 'p' : '');
          
          return [
            product.name,
            product.priceBGN,
            product.size || '',
            product.description?.substring(0, 50) || '', // Even shorter description
            flags,
            product._id,
            product.preparationTime || 0
          ];
        })
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

function createSystemPrompt(restaurant, menuData) {
  const restaurantName = restaurant.name;
  
  return `Ти си асистент за меню на ресторант ${restaurantName}. Отговаряй само на въпроси за храна/напитки.

МЕНЮ: ${JSON.stringify(menuData)}

ФОРМАТ: i=[име,цена,размер,описание,ФЛАГОВЕ,id,време]

ФЛАГОВЕ СА НА ПОЗИЦИЯ 5 В МАСИВА! ПРОВЕРЯВАЙ ГИ ЗАДЪЛЖИТЕЛНО:
- Ако ФЛАГЪТ съдържа буквата "h" = ЛЮТО ястие
- Ако ФЛАГЪТ съдържа буквата "p" = ПОПУЛЯРНО ястие  
- Ако ФЛАГЪТ съдържа буквата "v" = ВЕГЕТАРИАНСКО ястие
- Ако ФЛАГЪТ съдържа буквата "g" = ВЕГАН ястие

ПРИМЕР: ["Руска салата",9.99,"300 гр.","описание","h","id",3] - тук флагът е "h" което означава ЛЮТО!

КРИТИЧНО: Винаги отговаряй на СЪЩИЯ ЕЗИК, на който потребителят пита!

Правила: Кратък отговор (2-3 изречения). Включи "RECOMMENDED_IDS: [id1,id2]" в края.`;
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
function getFallbackRecommendations(userMessage, menuData) {
  const { categories } = menuData;
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
function checkIfOffTopic(message) {
  const msg = message.toLowerCase();
  
  // Simple food keywords check (multiple languages)
  const foodWords = [
    // Bulgarian
    'храна', 'ястие', 'меню', 'напитка', 'кафе', 'чай', 'пица', 'салата', 'цена', 'лв',
    // English  
    'food', 'dish', 'menu', 'drink', 'coffee', 'tea', 'pizza', 'salad', 'price',
    // Slovak
    'jedlo', 'pokrm', 'menu', 'nápoj', 'káva', 'čaj', 'pizza', 'šalát', 'cena',
    // German
    'essen', 'gericht', 'menü', 'getränk', 'kaffee', 'tee', 'pizza', 'salat', 'preis'
  ];
  
  // Obvious non-food topics (multiple languages)
  const badWords = [
    'столица', 'политика', 'математика', 'компютър', 'времето', 'спорт',
    'capital', 'politics', 'math', 'computer', 'weather', 'sport',
    'hlavné', 'politika', 'matematika', 'počítač', 'počasie', 'šport'
  ];
  
  const hasFoodWords = foodWords.some(word => msg.includes(word));
  const hasBadWords = badWords.some(word => msg.includes(word));
  
  return hasBadWords && !hasFoodWords;
}

import { NextResponse } from "next/server";
import { sendOpenAi } from "@/libs/gpt";

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
    return `You are an AI assistant for ${restaurantName}. Give accurate, concise recommendations.

MENU: ${JSON.stringify(menuData, null, 2)}

IMPORTANT - ANALYZE MENU CAREFULLY:
- "hot": true = SPICY dish
- "veg": true = vegetarian  
- "vgn": true = vegan
- "pop": true = popular

RULES:
1. Answer in 2-3 sentences maximum
2. Always check dish properties accurately
3. If spicy dishes exist (hot: true), recommend them for "spicy" requests
4. Include product IDs at end: "RECOMMENDED_IDS: [id1, id2]"
5. Explain why you recommend the dish

EXAMPLE:
"For spicy - I recommend Caesar Salad! It's marked as spicy and very popular (11.98 BGN).
RECOMMENDED_IDS: [507f1f77bcf86cd799439011]"`;
  }

  // Bulgarian system prompt - balanced for accuracy and cost
  return `Ти си AI асистент за ${restaurantName}. Давай точни, кратки препоръки.

МЕНЮ: ${JSON.stringify(menuData, null, 2)}

ВАЖНО - АНАЛИЗИРАЙ МЕНЮТО ВНИМАТЕЛНО:
- "hot": true = ЛЮТO ястие  
- "veg": true = вегетарианско
- "vgn": true = веган
- "pop": true = популярно

ПРАВИЛА:
1. Отговаряй в 2-3 изречения максимум
2. Винаги проверявай свойствата на ястията точно
3. Ако има люти ястия (hot: true), препоръчай ги за "люто"
4. Включи ID-та в края: "RECOMMENDED_IDS: [id1, id2]"
5. Обясни защо препоръчваш ястието

ПРИМЕР:
"За люто - препоръчвам Салата Цезар! Тя е означена като пикантна и е много популярна (11.98 лв).
RECOMMENDED_IDS: [507f1f77bcf86cd799439011]"`;
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

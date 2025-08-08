# 🚫 AI Assistant Topic Restrictions

## ✅ **Allowed Topics (Food-Related)**

### **Bulgarian Examples:**
- ✅ "Препоръчай ми нещо люто"
- ✅ "Какво вегетарианско имате?"
- ✅ "Имате ли ястия без глутен?"
- ✅ "Какво мога да хапна под 20 лв?"
- ✅ "Кои са алергените в салатата?"
- ✅ "Колко струва пицата?"
- ✅ "Имате ли десерти?"
- ✅ "Какво е популярно тук?"

### **English Examples:**
- ✅ "What spicy dishes do you have?"
- ✅ "Any vegetarian options?"
- ✅ "Do you have gluten-free food?"
- ✅ "What can I get under $20?"
- ✅ "What allergens are in this dish?"
- ✅ "How much is the pizza?"
- ✅ "Do you have desserts?"
- ✅ "What's popular here?"

## 🚫 **Blocked Topics (Non-Food)**

### **Geography & Places:**
- ❌ "Коя е столицата на Австрия?" → "Извинявай, аз помагам само с въпроси за менюто и храната..."
- ❌ "What is the capital of Austria?" → "Sorry, I only help with menu and food questions..."

### **Math & Science:**
- ❌ "Колко е 2 + 2?" → Blocked
- ❌ "What is 5 × 6?" → Blocked
- ❌ "How does gravity work?" → Blocked

### **Politics & History:**
- ❌ "Кой е президентът?" → Blocked
- ❌ "Who won the election?" → Blocked
- ❌ "When was World War 2?" → Blocked

### **Technology (Non-Food):**
- ❌ "How to fix my computer?" → Blocked
- ❌ "What's the best iPhone?" → Blocked
- ❌ "How to code in Python?" → Blocked

### **Personal Advice:**
- ❌ "Should I break up with my girlfriend?" → Blocked
- ❌ "How to get a better job?" → Blocked
- ❌ "What career should I choose?" → Blocked

### **Entertainment:**
- ❌ "What's a good movie to watch?" → Blocked
- ❌ "Who won the football game?" → Blocked
- ❌ "Best music artists?" → Blocked

## 🧠 **How It Works**

### **Two-Layer Protection:**

#### **1. Pre-Filter (Cost Saving)**
- **Keyword Detection**: Scans for obvious non-food keywords
- **Pattern Matching**: Recognizes common off-topic question patterns
- **Instant Response**: No API call needed = $0 cost
- **Examples Blocked**: "столица", "capital", "математика", "politics"

#### **2. AI Instructions (Backup)**
- **System Prompt**: Explicit instructions to refuse non-food questions
- **Fallback**: If pre-filter misses something, AI still refuses
- **Consistent Response**: Uses same polite refusal message

### **Smart Detection Logic:**

```javascript
// Has food keywords? ✅ Allow
"Какво вегетарианско имате?" → Contains "вегетарианско" → ✅ Allow

// Has off-topic keywords + no food keywords? ❌ Block  
"Коя е столицата на Австрия?" → Contains "столица" + no food words → ❌ Block

// Edge cases handled by AI instructions
"Tell me about Austrian cuisine" → Might pass pre-filter → AI decides
```

## 💰 **Cost Benefits**

### **Pre-Filter Savings:**
- **Blocked at API level**: No OpenAI tokens used
- **Instant response**: No processing delay
- **Estimated savings**: 10-20% of queries blocked before reaching AI

### **Example Savings:**
```
100 off-topic questions/month blocked = $0 cost
vs. 100 AI responses = ~$1.20

Monthly savings: $1.20 per restaurant
Annual savings: $14.40 per restaurant
```

## 🎯 **Response Examples**

### **Bulgarian Off-Topic Response:**
> "Извинявай, аз помагам само с въпроси за менюто и храната. Можеш да ме питаш за ястия, алергени, цени или препоръки!"

### **English Off-Topic Response:**
> "Sorry, I only help with menu and food questions. You can ask me about dishes, allergens, prices or recommendations!"

### **Helpful Redirect:**
The response guides users toward appropriate questions, improving user experience while maintaining focus.

## 🛡️ **Security & Professional Image**

### **Benefits:**
- ✅ **Professional**: Restaurant AI stays focused on its purpose
- ✅ **Safe**: Avoids controversial topics (politics, personal advice)
- ✅ **Consistent**: Reliable behavior across all interactions
- ✅ **Cost-Effective**: Saves money on irrelevant queries
- ✅ **User-Friendly**: Clear guidance on appropriate questions

### **Edge Cases Handled:**
- **Mixed Topics**: "Tell me about Vienna's food scene" → AI evaluates context
- **Ambiguous**: "What's hot?" → AI asks for clarification about food
- **Creative Queries**: Users trying to bypass restrictions → Consistent refusal

Your AI assistant now maintains professional focus while saving costs! 🎯💰

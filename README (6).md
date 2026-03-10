# 🤖 DSA ChatBot

A fully offline chatbot powered by **your own data** — no API key needed!

## ✨ Features
- 💬 Chat interface with typing animations
- 📷 **Camera capture** — take a photo of a coding problem
- 🖼️ **Gallery upload** — pick an image from your device
- 💡 Suggestion chips for quick questions
- 🟢 Works completely offline — no external API
- ☕ All answers in **Java code**

## 📁 Project Structure
```
chat/
└── index.html   ← The entire chatbot (single file!)
```

## 🚀 How to Deploy

### Option 1: GitHub Pages (Recommended)
1. Push `index.html` to your repository
2. Go to **Settings → Pages**
3. Set source to `main` branch, root folder
4. Your chatbot will be live at `https://yourusername.github.io/chat/`

### Option 2: Run Locally
Just open `index.html` in any browser — no server needed!

## 🧠 Adding Your Own Data

Open `index.html` and find the `knowledgeBase` array. Add your own entries:

```javascript
{
  keywords: ["your topic", "alias"],
  answer: `**Your Answer**\n\nExplanation here.\n\`\`\`java\n// Your Java code\n\`\`\``
}
```

## 📚 Current Knowledge Base Topics
- Binary Search
- Two Sum (LeetCode #1)
- Dynamic Programming
- BFS & DFS
- Sorting Algorithms
- Linked Lists
- Stack & Queue
- Binary Search Tree
- Graphs
- HashMap
- Time Complexity / Big-O
- Fibonacci

## 🛠️ Tech Stack
- Pure HTML + CSS + JavaScript
- No frameworks, no dependencies
- Works offline

---
Made with ❤️ — add your DSA solutions to the knowledge base!

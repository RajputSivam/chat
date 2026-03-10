# 🤖 DSA Chatbot

A web-based chatbot that answers DSA/algorithm questions using **your own data**, with image upload support (camera + gallery).

## Features
- 💬 Text-based Q&A from your DSA knowledge base
- 📷 Camera capture support
- 🖼️ Gallery image upload
- ☕ Answers with **Java code examples**
- 🚀 No backend needed — runs fully in the browser

## How to Use

1. Open `index.html` in any browser
2. Type a DSA question OR upload an image of a problem
3. Get instant answers with Java code

## Supported Topics (built-in)
- Binary Search
- Dynamic Programming
- Linked List
- Stack & Queue
- Trees & BST
- Graphs & BFS
- Sorting Algorithms
- Time Complexity

## Expanding the Knowledge Base

Open `index.html` and find the `DSA_KNOWLEDGE` object in the `<script>` tag.
Add new entries like this:

```javascript
"your topic": {
  answer: "Your explanation here",
  code: `// Java code here`
}
```

## Deploy to GitHub Pages

1. Push `index.html` to your repo
2. Go to **Settings → Pages**
3. Set source to `main` branch, `/ (root)`
4. Your chatbot will be live at `https://RajputSivam.github.io/chat/`

## Add Vision API (Optional)

To analyze images with AI, replace the image handler in the script with an API call to:
- **Google Cloud Vision API**
- **OpenAI GPT-4 Vision**
- **Anthropic Claude Vision**

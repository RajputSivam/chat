import { useState, useRef, useEffect } from "react";

// ═══════════════════════════════════════════════════════
//  DSA DATASET
// ═══════════════════════════════════════════════════════
const DSA_QUESTIONS = [
  {
    id: 1, topic: "Array", difficulty: "Easy",
    question: "Two Sum: Ek array aur target diya hai. Do numbers ke indices return karo jinका sum target ke barabar ho.",
    example: "Input: nums=[2,7,11,15], target=9 → Output: [0,1]",
    hint: "HashMap use karo — har element ke liye (target - element) ko map mein check karo.",
    solution: `def two_sum(nums, target):
    seen = {}
    for i, num in enumerate(nums):
        complement = target - num
        if complement in seen:
            return [seen[complement], i]
        seen[num] = i`,
    keywords: ["two sum", "twosum", "array sum", "target sum"]
  },
  {
    id: 2, topic: "Array", difficulty: "Easy",
    question: "Reverse Array: Ek array ko in-place reverse karo without extra space.",
    example: "Input: [1,2,3,4,5] → Output: [5,4,3,2,1]",
    hint: "Two pointers use karo — left aur right se swap karte jao middle tak.",
    solution: `def reverse_array(arr):
    left, right = 0, len(arr) - 1
    while left < right:
        arr[left], arr[right] = arr[right], arr[left]
        left += 1
        right -= 1
    return arr`,
    keywords: ["reverse array", "array reverse", "reverse"]
  },
  {
    id: 3, topic: "String", difficulty: "Easy",
    question: "Palindrome Check: Ek string palindrome hai ya nahi check karo.",
    example: "Input: 'racecar' → True, Input: 'hello' → False",
    hint: "String ko reverse karke original se compare karo, ya two pointers use karo.",
    solution: `def is_palindrome(s):
    s = s.lower().replace(" ", "")
    return s == s[::-1]`,
    keywords: ["palindrome", "string palindrome", "check palindrome"]
  },
  {
    id: 4, topic: "LinkedList", difficulty: "Medium",
    question: "Reverse Linked List: Ek singly linked list ko reverse karo.",
    example: "Input: 1→2→3→4→5 → Output: 5→4→3→2→1",
    hint: "Teen pointers use karo: prev=None, curr=head, next_node. Iteratively update karo.",
    solution: `def reverse_list(head):
    prev = None
    curr = head
    while curr:
        next_node = curr.next
        curr.next = prev
        prev = curr
        curr = next_node
    return prev`,
    keywords: ["reverse linked list", "linkedlist reverse", "linked list"]
  },
  {
    id: 5, topic: "Tree", difficulty: "Medium",
    question: "Binary Tree Inorder Traversal: Binary tree ka inorder traversal karo (Left → Root → Right).",
    example: "Tree: [1,null,2,3] → Output: [1,3,2]",
    hint: "Recursive approach: pehle left subtree, phir root, phir right subtree visit karo.",
    solution: `def inorder(root):
    result = []
    def traverse(node):
        if node:
            traverse(node.left)
            result.append(node.val)
            traverse(node.right)
    traverse(root)
    return result`,
    keywords: ["inorder", "tree traversal", "binary tree", "inorder traversal"]
  },
  {
    id: 6, topic: "Stack", difficulty: "Easy",
    question: "Valid Parentheses: String mein brackets valid hain ya nahi check karo.",
    example: "Input: '()[]{}' → True, Input: '(]' → False",
    hint: "Stack use karo — opening bracket push karo, closing bracket pe pop karke match check karo.",
    solution: `def is_valid(s):
    stack = []
    mapping = {')': '(', '}': '{', ']': '['}
    for char in s:
        if char in mapping:
            top = stack.pop() if stack else '#'
            if mapping[char] != top:
                return False
        else:
            stack.append(char)
    return not stack`,
    keywords: ["parentheses", "valid parentheses", "brackets", "stack"]
  },
  {
    id: 7, topic: "Sorting", difficulty: "Medium",
    question: "Bubble Sort: Array ko bubble sort algorithm se ascending order mein sort karo.",
    example: "Input: [64,34,25,12,22,11,90] → Output: [11,12,22,25,34,64,90]",
    hint: "Nested loops use karo — har pass mein adjacent elements compare aur swap karo.",
    solution: `def bubble_sort(arr):
    n = len(arr)
    for i in range(n):
        for j in range(0, n-i-1):
            if arr[j] > arr[j+1]:
                arr[j], arr[j+1] = arr[j+1], arr[j]
    return arr`,
    keywords: ["bubble sort", "sort", "sorting", "bubblesort"]
  },
  {
    id: 8, topic: "Graph", difficulty: "Medium",
    question: "BFS (Breadth First Search): Graph mein BFS traversal implement karo.",
    example: "Graph: {0:[1,2], 1:[2], 2:[0,3], 3:[3]} → BFS from 2: [2,0,3,1]",
    hint: "Queue use karo — start node enqueue karo, phir har node ke neighbors ko visit karo.",
    solution: `from collections import deque
def bfs(graph, start):
    visited = set()
    queue = deque([start])
    visited.add(start)
    result = []
    while queue:
        node = queue.popleft()
        result.append(node)
        for neighbor in graph[node]:
            if neighbor not in visited:
                visited.add(neighbor)
                queue.append(neighbor)
    return result`,
    keywords: ["bfs", "breadth first", "graph bfs", "breadth first search"]
  },
  {
    id: 9, topic: "Dynamic Programming", difficulty: "Medium",
    question: "Fibonacci: Fibonacci series ka nth number find karo using Dynamic Programming.",
    example: "Input: n=10 → Output: 55",
    hint: "Bottom-up DP use karo — dp[i] = dp[i-1] + dp[i-2], space optimize karne ke liye sirf 2 variables rakhho.",
    solution: `def fibonacci(n):
    if n <= 1:
        return n
    a, b = 0, 1
    for _ in range(2, n+1):
        a, b = b, a + b
    return b`,
    keywords: ["fibonacci", "fib", "dp", "dynamic programming"]
  },
  {
    id: 10, topic: "Binary Search", difficulty: "Easy",
    question: "Binary Search: Sorted array mein target element ka index find karo.",
    example: "Input: arr=[-1,0,3,5,9,12], target=9 → Output: 4",
    hint: "Left aur right pointers rakhho, mid calculate karo, target se compare karke range narrow karo.",
    solution: `def binary_search(arr, target):
    left, right = 0, len(arr) - 1
    while left <= right:
        mid = (left + right) // 2
        if arr[mid] == target:
            return mid
        elif arr[mid] < target:
            left = mid + 1
        else:
            right = mid - 1
    return -1`,
    keywords: ["binary search", "search", "sorted array", "binary"]
  },
];

// ═══════════════════════════════════════════════════════
//  COMMON CODE ERRORS DATABASE
// ═══════════════════════════════════════════════════════
const ERROR_PATTERNS = [
  { pattern: /def\s+\w+\([^)]*\)\s*[^:]/m, msg: "❌ Syntax Error: Function definition ke baad ':' missing hai!\nFix: `def function_name():` — colon zaroori hai." },
  { pattern: /for\s+\w+\s+in\s+\w+\s*[^:]/m, msg: "❌ Syntax Error: For loop ke baad ':' missing hai!\nFix: `for i in range(n):` — colon lagao." },
  { pattern: /while\s+.+[^:]\n/m, msg: "❌ Syntax Error: While loop ke baad ':' missing hai!\nFix: `while condition:` likhna chahiye." },
  { pattern: /if\s+.+[^:]\n/m, msg: "❌ Syntax Error: If statement ke baad ':' missing hai!\nFix: `if condition:` — colon zaroori hai." },
  { pattern: /print\s+[^(]/m, msg: "❌ Syntax Error: `print` function call mein parentheses missing!\nFix: `print(value)` — Python 3 mein brackets chahiye." },
  { pattern: /==[^=]|[^=!<>]=[^=>]/m, msg: "⚠️ Possible Error: Assignment (=) aur comparison (==) ka dhyan rakho!\nFix: Comparison ke liye `==` use karo, assignment ke liye `=`." },
  { pattern: /\blenght\b|\blenth\b|\blegth\b/i, msg: "❌ NameError: `lenght` galat spelling hai!\nFix: `len(array)` — sahi spelling hai." },
  { pattern: /\bapend\b|\bapnd\b/i, msg: "❌ AttributeError: `apend` galat spelling hai!\nFix: `list.append(value)` — sahi spelling hai." },
  { pattern: /\bretrun\b|\breturnn\b/i, msg: "❌ SyntaxError: `retrun` galat spelling!\nFix: `return value` — sahi spelling likhna zaroori hai." },
  { pattern: /range\(\d+,\s*\d+,\s*0\)/m, msg: "❌ ValueError: range() mein step=0 nahi ho sakta!\nFix: Step value 0 ke alawa koi bhi integer dena hoga." },
  { pattern: /\[\s*\]\s*\[\d+\]/m, msg: "❌ IndexError: Empty list mein index access karna!\nFix: Pehle list mein elements hain ya nahi check karo." },
  { pattern: /\/\s*0[^.]/m, msg: "❌ ZeroDivisionError: Zero se divide karna!\nFix: Denominator 0 hai ya nahi pehle check karo." },
];

function analyzeCode(code) {
  const errors = [];
  for (const ep of ERROR_PATTERNS) {
    if (ep.pattern.test(code)) errors.push(ep.msg);
  }

  // Indentation check
  const lines = code.split("\n");
  let hasIndentError = false;
  for (let i = 0; i < lines.length; i++) {
    if ((lines[i].trim().startsWith("def ") || lines[i].trim().startsWith("if ") ||
      lines[i].trim().startsWith("for ") || lines[i].trim().startsWith("while ")) &&
      lines[i].endsWith(":")) {
      if (i + 1 < lines.length && lines[i + 1].trim() !== "" && !lines[i + 1].startsWith("    ") && !lines[i + 1].startsWith("\t")) {
        hasIndentError = true;
      }
    }
  }
  if (hasIndentError) errors.push("❌ IndentationError: Code block ke andar indentation (4 spaces) zaroori hai!\nFix: if/for/while/def ke baad waali lines mein 4 spaces ya tab lagao.");

  if (errors.length === 0) {
    return { status: "ok", message: "✅ Code mein koi obvious syntax error nahi dikha!\n\nLogic sahi lag raha hai. Agar runtime error aa raha hai toh edge cases check karo:\n• Empty input\n• Negative numbers\n• Very large values\n\nBढiया kaam! 🎉" };
  }
  return { status: "error", message: errors.join("\n\n") + "\n\n💡 In errors ko fix karo aur dobara submit karo!" };
}

// ═══════════════════════════════════════════════════════
//  BOT BRAIN
// ═══════════════════════════════════════════════════════
function getBotResponse(input, mode, currentQ) {
  const lower = input.toLowerCase().trim();

  if (["hello","hi","hey","hii","salam","namaste"].some(w => lower.includes(w))) {
    return { text: "Hello! 👋 Main DSA Bot hoon!\n\n🧠 Main kar sakta hoon:\n• DSA questions poochna — likhna 'start quiz' ya topic name\n• Aapka code check karna — code paste karo\n• Hints dena — likhna 'hint'\n• Solution dikhana — likhna 'solution'\n\nKya shuru karein? 🚀", type: "info" };
  }
  if (lower.includes("start") || lower.includes("quiz") || lower.includes("question") || lower.includes("shuru")) {
    const q = DSA_QUESTIONS[Math.floor(Math.random() * DSA_QUESTIONS.length)];
    return { text: null, question: q, type: "question" };
  }
  if (lower.includes("hint") && currentQ) {
    return { text: `💡 **Hint:**\n${currentQ.hint}`, type: "hint" };
  }
  if ((lower.includes("solution") || lower.includes("answer") || lower.includes("jawab")) && currentQ) {
    return { text: `✅ **Solution:**\n\`\`\`python\n${currentQ.solution}\n\`\`\``, type: "solution", code: currentQ.solution };
  }
  if (lower.includes("next") || lower.includes("skip") || lower.includes("agle") || lower.includes("dusra")) {
    const q = DSA_QUESTIONS[Math.floor(Math.random() * DSA_QUESTIONS.length)];
    return { text: null, question: q, type: "question" };
  }

  // Topic-based questions
  for (const q of DSA_QUESTIONS) {
    if (q.keywords.some(k => lower.includes(k))) {
      return { text: null, question: q, type: "question" };
    }
    if (lower.includes(q.topic.toLowerCase())) {
      return { text: null, question: q, type: "question" };
    }
  }

  // Code detection
  if (lower.includes("def ") || lower.includes("for ") || lower.includes("while ") ||
    lower.includes("int ") || lower.includes("void ") || input.includes("{") ||
    input.includes("=>") || lower.includes("function") || lower.includes("return")) {
    const result = analyzeCode(input);
    return { text: `🔍 **Code Analysis:**\n\n${result.message}`, type: result.status === "ok" ? "success" : "error" };
  }
  if (lower.includes("help") || lower.includes("madad")) {
    return { text: "🆘 **Commands:**\n\n• `start` — Random DSA question\n• `array` / `tree` / `graph` — Topic question\n• `hint` — Current question ka hint\n• `solution` — Solution dekho\n• `next` — Agle question pe jao\n• Code paste karo — Error check hoga\n\nKya karna chahte ho? 😊", type: "info" };
  }
  return { text: "Hmm, samajh nahi aaya 🤔\n\n`start` likho — DSA question milega\nYa apna code paste karo — main errors check karunga!", type: "info" };
}

// ═══════════════════════════════════════════════════════
//  ICONS
// ═══════════════════════════════════════════════════════
const SendIcon = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width="18" height="18"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>;
const CodeIcon = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="16" height="16"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>;
const BrainIcon = () => <svg viewBox="0 0 24 24" fill="currentColor" width="22" height="22"><path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96-.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 4.44-1.66zm5 0a2.5 2.5 0 0 0-2.5 2.5v15a2.5 2.5 0 0 0 4.96-.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-4.44-1.66z"/></svg>;
const LightIcon = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="14" height="14"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>;

function TypingDots() {
  return (
    <div style={{ display: "flex", gap: 5, padding: "10px 14px", alignItems: "center" }}>
      {[0,1,2].map(i => (
        <span key={i} style={{ width: 7, height: 7, borderRadius: "50%", background: "#34d399", display: "inline-block", animation: "dsaBounce 1.2s infinite", animationDelay: `${i*0.2}s` }} />
      ))}
    </div>
  );
}

function QuestionCard({ q, onHint, onSolution, onNext }) {
  const diffColor = { Easy: "#34d399", Medium: "#fbbf24", Hard: "#f87171" };
  return (
    <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(52,211,153,0.2)", borderRadius: 16, overflow: "hidden", marginTop: 4 }}>
      <div style={{ padding: "10px 14px", background: "rgba(52,211,153,0.08)", borderBottom: "1px solid rgba(52,211,153,0.15)", display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
        <span style={{ fontSize: 11, fontWeight: 700, color: "#34d399", fontFamily: "'JetBrains Mono',monospace", letterSpacing: 1 }}>#{q.id} {q.topic.toUpperCase()}</span>
        <span style={{ fontSize: 10, padding: "2px 8px", borderRadius: 20, background: `${diffColor[q.difficulty]}22`, color: diffColor[q.difficulty], fontWeight: 600 }}>{q.difficulty}</span>
      </div>
      <div style={{ padding: "12px 14px" }}>
        <div style={{ color: "rgba(255,255,255,0.9)", fontSize: 13.5, lineHeight: 1.6, marginBottom: 8 }}>{q.question}</div>
        <div style={{ background: "rgba(0,0,0,0.3)", borderRadius: 8, padding: "8px 12px", fontSize: 12, color: "#94a3b8", fontFamily: "'JetBrains Mono',monospace", lineHeight: 1.5 }}>{q.example}</div>
        <div style={{ display: "flex", gap: 8, marginTop: 12, flexWrap: "wrap" }}>
          {[{ label: "💡 Hint", fn: onHint, color: "#fbbf24" }, { label: "✅ Solution", fn: onSolution, color: "#34d399" }, { label: "⏭ Next", fn: onNext, color: "#60a5fa" }].map(btn => (
            <button key={btn.label} onClick={btn.fn} style={{ padding: "5px 14px", borderRadius: 20, border: `1px solid ${btn.color}44`, background: `${btn.color}11`, color: btn.color, fontSize: 12, fontWeight: 600, cursor: "pointer", transition: "all 0.2s", fontFamily: "'JetBrains Mono',monospace" }}
              onMouseEnter={e => e.currentTarget.style.background = `${btn.color}25`}
              onMouseLeave={e => e.currentTarget.style.background = `${btn.color}11`}
            >{btn.label}</button>
          ))}
        </div>
      </div>
    </div>
  );
}

function CodeBlock({ code }) {
  const [copied, setCopied] = useState(false);
  const copy = () => { navigator.clipboard.writeText(code); setCopied(true); setTimeout(() => setCopied(false), 2000); };
  return (
    <div style={{ background: "rgba(0,0,0,0.5)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 10, overflow: "hidden", marginTop: 6 }}>
      <div style={{ padding: "6px 12px", borderBottom: "1px solid rgba(255,255,255,0.06)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontSize: 11, color: "#64748b", fontFamily: "'JetBrains Mono',monospace" }}>python</span>
        <button onClick={copy} style={{ fontSize: 10, color: copied ? "#34d399" : "#64748b", background: "none", border: "none", cursor: "pointer", fontFamily: "'JetBrains Mono',monospace" }}>{copied ? "✓ Copied!" : "Copy"}</button>
      </div>
      <pre style={{ margin: 0, padding: "12px", fontSize: 12.5, lineHeight: 1.6, color: "#e2e8f0", overflowX: "auto", fontFamily: "'JetBrains Mono',monospace", whiteSpace: "pre-wrap" }}>{code}</pre>
    </div>
  );
}

function MessageBubble({ msg, onHint, onSolution, onNext }) {
  const isUser = msg.from === "user";
  const typeColors = { error: "#f87171", success: "#34d399", hint: "#fbbf24", info: "#60a5fa", solution: "#a78bfa" };
  const accent = typeColors[msg.type] || "#34d399";

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: isUser ? "flex-end" : "flex-start", animation: "dsaFade 0.3s ease", marginBottom: 4 }}>
      {!isUser && (
        <div style={{ fontSize: 10, color: "#475569", marginBottom: 4, paddingLeft: 2, fontFamily: "'JetBrains Mono',monospace" }}>DSA_BOT</div>
      )}
      <div style={{
        maxWidth: "88%",
        background: isUser ? "linear-gradient(135deg, #059669, #047857)" : "rgba(15,23,42,0.8)",
        border: isUser ? "none" : `1px solid ${accent}33`,
        borderRadius: isUser ? "18px 18px 4px 18px" : "4px 18px 18px 18px",
        padding: msg.question ? "0" : "10px 14px",
        overflow: "hidden",
        boxShadow: isUser ? "0 4px 16px rgba(5,150,105,0.3)" : `0 2px 12px rgba(0,0,0,0.3)`,
      }}>
        {msg.question ? (
          <QuestionCard q={msg.question} onHint={onHint} onSolution={onSolution} onNext={onNext} />
        ) : msg.codeBlock ? (
          <div style={{ padding: "10px 14px" }}>
            <div style={{ color: "rgba(255,255,255,0.85)", fontSize: 13.5, lineHeight: 1.6, marginBottom: 6, whiteSpace: "pre-wrap" }}>
              {msg.text.replace(/```python[\s\S]*?```/, "").trim()}
            </div>
            <CodeBlock code={msg.codeBlock} />
          </div>
        ) : (
          <div style={{ color: isUser ? "rgba(255,255,255,0.95)" : "rgba(255,255,255,0.85)", fontSize: 13.5, lineHeight: 1.65, whiteSpace: "pre-wrap", fontFamily: msg.isCode ? "'JetBrains Mono',monospace" : "inherit", fontSize: msg.isCode ? 12.5 : 13.5 }}>
            {msg.text}
          </div>
        )}
      </div>
      <div style={{ fontSize: 10, color: "#1e293b", marginTop: 3, padding: "0 4px" }}>
        {msg.time?.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════
//  TOPIC PILLS
// ═══════════════════════════════════════════════════════
const TOPICS = ["Array", "String", "LinkedList", "Tree", "Stack", "Graph", "Sorting", "Binary Search", "DP"];

// ═══════════════════════════════════════════════════════
//  MAIN APP
// ═══════════════════════════════════════════════════════
export default function App() {
  const [messages, setMessages] = useState([
    {
      id: 1, from: "bot", type: "info",
      text: "Assalamualaikum! Main hoon DSA Bot 🤖\n\nMain aapki help karunga:\n🧠 DSA Questions — practice ke liye\n🔍 Code Error Check — aapka code analyze karunga\n💡 Hints & Solutions — jab zaroorat ho\n\n'start' likho ya neeche topic select karo! 👇",
      time: new Date()
    }
  ]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [currentQ, setCurrentQ] = useState(null);
  const [codeMode, setCodeMode] = useState(false);
  const bottomRef = useRef(null);
  const textRef = useRef(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, typing]);

  const addMsg = (msg) => setMessages(p => [...p, { id: Date.now() + Math.random(), time: new Date(), ...msg }]);

  const handleSend = (text = input) => {
    const trimmed = text.trim();
    if (!trimmed) return;
    addMsg({ from: "user", text: trimmed, isCode: codeMode });
    setInput("");
    setCodeMode(false);
    if (textRef.current) textRef.current.style.height = "auto";

    setTyping(true);
    setTimeout(() => {
      setTyping(false);
      const res = getBotResponse(trimmed, codeMode ? "code" : "chat", currentQ);
      if (res.question) setCurrentQ(res.question);

      const botMsg = {
        from: "bot", type: res.type,
        question: res.question || null,
        text: res.text,
        codeBlock: res.code || null,
      };
      addMsg(botMsg);
    }, 700 + Math.random() * 500);
  };

  const handleHint = () => {
    if (!currentQ) return;
    addMsg({ from: "bot", type: "hint", text: `💡 Hint:\n${currentQ.hint}` });
  };
  const handleSolution = () => {
    if (!currentQ) return;
    addMsg({ from: "bot", type: "solution", text: "✅ Solution:", codeBlock: currentQ.solution });
  };
  const handleNext = () => {
    const q = DSA_QUESTIONS[Math.floor(Math.random() * DSA_QUESTIONS.length)];
    setCurrentQ(q);
    addMsg({ from: "bot", type: "question", question: q });
  };

  const handleTopic = (topic) => handleSend(topic);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600;700&family=Outfit:wght@300;400;500;600;700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #020617; font-family: 'Outfit', sans-serif; }
        @keyframes dsaBounce { 0%,60%,100%{transform:translateY(0)} 30%{transform:translateY(-7px)} }
        @keyframes dsaFade { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }
        @keyframes scanline { 0%{transform:translateY(-100%)} 100%{transform:translateY(100vh)} }
        @keyframes glow { 0%,100%{opacity:0.5} 50%{opacity:1} }
        ::-webkit-scrollbar { width: 3px; }
        ::-webkit-scrollbar-thumb { background: #1e293b; border-radius: 4px; }
        textarea { resize: none; }
      `}</style>

      <div style={{
        minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center",
        background: "linear-gradient(135deg, #020617 0%, #0a1628 50%, #020c1a 100%)",
        padding: 16, position: "relative", overflow: "hidden",
      }}>
        {/* Grid background */}
        <div style={{ position: "fixed", inset: 0, backgroundImage: "linear-gradient(rgba(52,211,153,0.03) 1px,transparent 1px),linear-gradient(90deg,rgba(52,211,153,0.03) 1px,transparent 1px)", backgroundSize: "40px 40px", pointerEvents: "none" }} />
        {/* Glow orbs */}
        <div style={{ position: "fixed", top: "20%", left: "10%", width: 300, height: 300, borderRadius: "50%", background: "radial-gradient(circle,rgba(52,211,153,0.06) 0%,transparent 70%)", pointerEvents: "none", animation: "glow 4s ease-in-out infinite" }} />
        <div style={{ position: "fixed", bottom: "15%", right: "8%", width: 250, height: 250, borderRadius: "50%", background: "radial-gradient(circle,rgba(96,165,250,0.06) 0%,transparent 70%)", pointerEvents: "none", animation: "glow 5s ease-in-out infinite 1s" }} />

        <div style={{
          width: "100%", maxWidth: 500, height: "min(780px, 94vh)",
          background: "rgba(2,6,23,0.95)",
          backdropFilter: "blur(20px)",
          border: "1px solid rgba(52,211,153,0.2)",
          borderRadius: 24,
          display: "flex", flexDirection: "column",
          boxShadow: "0 0 0 1px rgba(52,211,153,0.05), 0 32px 80px rgba(0,0,0,0.8), 0 0 80px rgba(52,211,153,0.05)",
          overflow: "hidden",
          position: "relative",
        }}>
          {/* Header */}
          <div style={{ padding: "16px 20px", background: "rgba(52,211,153,0.05)", borderBottom: "1px solid rgba(52,211,153,0.15)", display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ width: 44, height: 44, borderRadius: 12, background: "linear-gradient(135deg,#059669,#0d9488)", display: "flex", alignItems: "center", justifyContent: "center", color: "white", boxShadow: "0 4px 16px rgba(5,150,105,0.4)", flexShrink: 0 }}>
              <BrainIcon />
            </div>
            <div>
              <div style={{ fontFamily: "'JetBrains Mono',monospace", fontWeight: 700, fontSize: 15, color: "#34d399", letterSpacing: "-0.3px" }}>DSA_BOT <span style={{ color: "#475569", fontSize: 12 }}>v2.0</span></div>
              <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 2 }}>
                <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#34d399", display: "inline-block", animation: "glow 2s infinite" }} />
                <span style={{ fontSize: 11, color: "#34d399", fontFamily: "'JetBrains Mono',monospace", opacity: 0.7 }}>ONLINE • NO API • LOCAL ENGINE</span>
              </div>
            </div>
            <div style={{ marginLeft: "auto", textAlign: "right" }}>
              <div style={{ fontSize: 10, color: "#1e3a2f", fontFamily: "'JetBrains Mono',monospace", fontWeight: 600 }}>{DSA_QUESTIONS.length} QNS</div>
              <div style={{ fontSize: 10, color: "#1e3a2f", fontFamily: "'JetBrains Mono',monospace" }}>LOADED</div>
            </div>
          </div>

          {/* Topic Pills */}
          <div style={{ padding: "10px 16px 0", display: "flex", gap: 6, flexWrap: "wrap", borderBottom: "1px solid rgba(255,255,255,0.04)", paddingBottom: 10 }}>
            {TOPICS.map(t => (
              <button key={t} onClick={() => handleTopic(t)} style={{
                padding: "3px 10px", borderRadius: 20, fontSize: 11, fontWeight: 600,
                border: "1px solid rgba(52,211,153,0.2)", background: "rgba(52,211,153,0.05)",
                color: "#34d399", cursor: "pointer", fontFamily: "'JetBrains Mono',monospace",
                transition: "all 0.2s", letterSpacing: "0.3px",
              }}
                onMouseEnter={e => { e.currentTarget.style.background = "rgba(52,211,153,0.15)"; e.currentTarget.style.borderColor = "rgba(52,211,153,0.5)"; }}
                onMouseLeave={e => { e.currentTarget.style.background = "rgba(52,211,153,0.05)"; e.currentTarget.style.borderColor = "rgba(52,211,153,0.2)"; }}
              >{t}</button>
            ))}
          </div>

          {/* Messages */}
          <div style={{ flex: 1, overflowY: "auto", padding: "16px 14px", display: "flex", flexDirection: "column", gap: 10 }}>
            {messages.map(msg => (
              <MessageBubble key={msg.id} msg={msg} onHint={handleHint} onSolution={handleSolution} onNext={handleNext} />
            ))}
            {typing && (
              <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", animation: "dsaFade 0.3s ease" }}>
                <div style={{ fontSize: 10, color: "#1e3a2f", marginBottom: 4, fontFamily: "'JetBrains Mono',monospace" }}>DSA_BOT</div>
                <div style={{ background: "rgba(15,23,42,0.8)", border: "1px solid rgba(52,211,153,0.2)", borderRadius: "4px 18px 18px 18px" }}>
                  <TypingDots />
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div style={{ padding: "12px 14px 16px", borderTop: "1px solid rgba(52,211,153,0.1)", background: "rgba(0,0,0,0.3)" }}>
            {codeMode && (
              <div style={{ fontSize: 11, color: "#fbbf24", fontFamily: "'JetBrains Mono',monospace", marginBottom: 6, display: "flex", alignItems: "center", gap: 6 }}>
                <CodeIcon /> CODE MODE — Aapka code analyze kiya jayega
              </div>
            )}
            <div style={{
              display: "flex", alignItems: "flex-end", gap: 8,
              background: codeMode ? "rgba(251,191,36,0.05)" : "rgba(255,255,255,0.03)",
              border: `1px solid ${codeMode ? "rgba(251,191,36,0.3)" : "rgba(52,211,153,0.15)"}`,
              borderRadius: 16, padding: "10px 10px 10px 14px",
              transition: "border-color 0.2s",
            }}>
              <textarea
                ref={textRef}
                rows={1}
                value={input}
                onChange={e => {
                  setInput(e.target.value);
                  e.target.style.height = "auto";
                  e.target.style.height = Math.min(e.target.scrollHeight, 120) + "px";
                }}
                onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
                placeholder={codeMode ? "Apna code yahan paste karo..." : "DSA question poochho ya code paste karo..."}
                style={{
                  flex: 1, background: "transparent", border: "none", outline: "none",
                  color: "rgba(255,255,255,0.9)", fontSize: codeMode ? 12.5 : 14,
                  lineHeight: 1.5, minHeight: 24, maxHeight: 120, overflowY: "auto",
                  fontFamily: codeMode ? "'JetBrains Mono',monospace" : "'Outfit',sans-serif",
                }}
              />
              <div style={{ display: "flex", gap: 6, alignItems: "center", flexShrink: 0 }}>
                <button
                  onClick={() => setCodeMode(p => !p)}
                  title="Code Mode"
                  style={{
                    width: 34, height: 34, borderRadius: 10, border: "none",
                    background: codeMode ? "rgba(251,191,36,0.2)" : "rgba(255,255,255,0.05)",
                    color: codeMode ? "#fbbf24" : "#475569",
                    cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
                    transition: "all 0.2s",
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = "rgba(251,191,36,0.15)"}
                  onMouseLeave={e => e.currentTarget.style.background = codeMode ? "rgba(251,191,36,0.2)" : "rgba(255,255,255,0.05)"}
                ><CodeIcon /></button>
                <button
                  onClick={() => handleSend()}
                  style={{
                    width: 34, height: 34, borderRadius: 10, border: "none",
                    background: input.trim() ? "linear-gradient(135deg,#059669,#0d9488)" : "rgba(255,255,255,0.05)",
                    color: input.trim() ? "white" : "#1e3a2f",
                    cursor: input.trim() ? "pointer" : "not-allowed",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    transition: "all 0.2s",
                    boxShadow: input.trim() ? "0 4px 14px rgba(5,150,105,0.4)" : "none",
                  }}
                ><SendIcon /></button>
              </div>
            </div>
            <div style={{ display: "flex", justifyContent: "center", gap: 16, marginTop: 8 }}>
              {[["💬 start", "start"], ["💡 hint", "hint"], ["✅ solution", "solution"], ["⏭ next", "next"]].map(([label, cmd]) => (
                <button key={cmd} onClick={() => handleSend(cmd)} style={{ fontSize: 10.5, color: "#1e3a2f", background: "none", border: "none", cursor: "pointer", fontFamily: "'JetBrains Mono',monospace", padding: "2px 4px", transition: "color 0.2s" }}
                  onMouseEnter={e => e.currentTarget.style.color = "#34d399"}
                  onMouseLeave={e => e.currentTarget.style.color = "#1e3a2f"}
                >{label}</button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

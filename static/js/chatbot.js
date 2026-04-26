// ===== LEARNERS TRACK CHATBOT =====
const CHATBOT_API = '/api/chatbot/';
let speaking = false;
let recognition = null;
let isTyping = false;

document.addEventListener('DOMContentLoaded', () => {
  const input = document.getElementById('chatInput');
  const sendBtn = document.getElementById('sendBtn');
  const micBtn = document.getElementById('micBtn');
  const clearBtn = document.getElementById('clearChat');
  const quickChips = document.querySelectorAll('.quick-chip');

  if (!input) return;

  sendBtn.addEventListener('click', sendMessage);
  input.addEventListener('keydown', e => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  });
  clearBtn.addEventListener('click', clearChat);
  quickChips.forEach(chip => chip.addEventListener('click', () => {
    if (isTyping) return;
    input.value = chip.textContent;
    sendMessage();
  }));

  if (micBtn) initMic(micBtn, input);
  updateEmpty();
});

function getCsrfToken() {
  const cookie = document.cookie.split(';').find(c => c.trim().startsWith('csrftoken='));
  return cookie ? cookie.trim().split('=')[1] : '';
}

async function sendMessage() {
  if (isTyping) return;
  const input = document.getElementById('chatInput');
  const msg = input.value.trim();
  if (!msg) return;
  input.value = '';

  appendMessage('user', msg);
  showTyping();
  updateEmpty();

  try {
    const res = await fetch(CHATBOT_API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-CSRFToken': getCsrfToken() },
      body: JSON.stringify({ message: msg })
    });
    const data = await res.json();
    hideTyping();
    await typeMessage(data.response || 'Sorry, I could not respond.');
  } catch {
    hideTyping();
    await typeMessage('Connection error. Please try again.');
  }
}

// ===== WORD-BY-WORD TYPING EFFECT =====
async function typeMessage(text) {
  isTyping = true;
  const messagesEl = document.getElementById('chatMessages');
  const chatbotImg = window.CHATBOT_IMG || '';
  const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  const botAvatar = chatbotImg
    ? `<img src="${chatbotImg}" alt="Bot">`
    : '<i class="fa-solid fa-robot"></i>';

  // Create the message container
  const msgEl = document.createElement('div');
  msgEl.className = 'chat-msg bot';
  msgEl.innerHTML = `
    <div class="chat-msg-avatar">${botAvatar}</div>
    <div>
      <div class="chat-bubble" id="typingBubble"></div>
      <div class="chat-time" id="typingTime" style="display:none;">${time}</div>
    </div>
  `;
  messagesEl.appendChild(msgEl);
  messagesEl.scrollTop = messagesEl.scrollHeight;

  const bubble = msgEl.querySelector('#typingBubble');

  // Split text into words, preserving line breaks
  const lines = text.split('\n');
  let displayedText = '';
  let isFirst = true;

  for (let lineIndex = 0; lineIndex < lines.length; lineIndex++) {
    const line = lines[lineIndex];
    const words = line.split(' ');

    if (!isFirst) {
      // Add line break
      displayedText += '\n';
      bubble.innerHTML = formatText(displayedText);
      messagesEl.scrollTop = messagesEl.scrollHeight;
      await sleep(120);
    }
    isFirst = false;

    for (let i = 0; i < words.length; i++) {
      const word = words[i];
      if (!word) continue;

      displayedText += (i === 0 ? '' : ' ') + word;
      bubble.innerHTML = formatText(displayedText);
      messagesEl.scrollTop = messagesEl.scrollHeight;

      // Random delay between 80ms and 200ms per word for natural feel
      const delay = 80 + Math.random() * 120;
      await sleep(delay);
    }
  }

  // Show speak button after typing completes
  const safeText = text.replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  const timeEl = msgEl.querySelector('#typingTime');
  timeEl.style.display = '';
  timeEl.innerHTML = `${time} <button class="speak-btn" onclick="speakText(this)" data-text="${safeText}"><i class="fa-solid fa-volume-high"></i> Speak</button>`;

  // Remove temp IDs
  bubble.removeAttribute('id');
  timeEl.removeAttribute('id');

  isTyping = false;
  updateEmpty();
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function appendMessage(role, text) {
  const messagesEl = document.getElementById('chatMessages');
  const userInitial = window.USER_INITIAL || 'U';

  const msgEl = document.createElement('div');
  msgEl.className = `chat-msg ${role}`;
  const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  msgEl.innerHTML = `
    <div class="chat-msg-avatar">${userInitial}</div>
    <div>
      <div class="chat-bubble">${formatText(text)}</div>
      <div class="chat-time">${time}</div>
    </div>
  `;

  messagesEl.appendChild(msgEl);
  messagesEl.scrollTop = messagesEl.scrollHeight;
  updateEmpty();
}

function formatText(text) {
  return text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\n/g, '<br>');
}

let typingEl = null;
function showTyping() {
  const messagesEl = document.getElementById('chatMessages');
  const chatbotImg = window.CHATBOT_IMG || '';
  typingEl = document.createElement('div');
  typingEl.className = 'chat-msg bot';
  const botAvatar = chatbotImg
    ? `<img src="${chatbotImg}" alt="Bot">`
    : '<i class="fa-solid fa-robot"></i>';
  typingEl.innerHTML = `
    <div class="chat-msg-avatar">${botAvatar}</div>
    <div class="chat-bubble">
      <div class="typing-dots"><span></span><span></span><span></span></div>
    </div>`;
  messagesEl.appendChild(typingEl);
  messagesEl.scrollTop = messagesEl.scrollHeight;
}

function hideTyping() {
  if (typingEl) { typingEl.remove(); typingEl = null; }
}

function clearChat() {
  if (isTyping) return;
  const messagesEl = document.getElementById('chatMessages');
  messagesEl.innerHTML = '';
  updateEmpty();
}

function updateEmpty() {
  const messagesEl = document.getElementById('chatMessages');
  let emptyEl = document.getElementById('chatEmpty');
  const hasMessages = messagesEl.querySelector('.chat-msg');
  if (!hasMessages && !emptyEl) {
    emptyEl = document.createElement('div');
    emptyEl.id = 'chatEmpty';
    emptyEl.className = 'chat-empty';
    emptyEl.innerHTML = `<i class="fa-regular fa-comments"></i><p>Ask me about any of our ${window.TOTAL_COURSES || 20} courses.<br>Tap a suggestion above or type your question.</p>`;
    messagesEl.appendChild(emptyEl);
  } else if (hasMessages && emptyEl) {
    emptyEl.remove();
  }
}

function speakText(btn) {
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
    const text = btn.getAttribute('data-text')
      .replace(/<[^>]+>/g, '')
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'");
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.95; utterance.pitch = 1.05;
    window.speechSynthesis.speak(utterance);
  }
}

function initMic(micBtn, input) {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognition) return;
  recognition = new SpeechRecognition();
  recognition.lang = 'en-IN';
  recognition.interimResults = false;

  micBtn.addEventListener('click', () => {
    if (isTyping) return;
    if (speaking) {
      recognition.stop();
      micBtn.style.color = '';
      speaking = false;
    } else {
      recognition.start();
      micBtn.style.color = 'var(--orange)';
      speaking = true;
    }
  });

  recognition.onresult = (e) => {
    input.value = e.results[0][0].transcript;
    micBtn.style.color = '';
    speaking = false;
  };
  recognition.onend = () => { micBtn.style.color = ''; speaking = false; };
}
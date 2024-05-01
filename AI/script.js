const chatContainer = document.getElementById('chat-container');
const userInput = document.getElementById('user-input');
const typingSound = document.getElementById('typing-sound');

async function getBotReply(question) {
  try {
    const response = await fetch('responses.json');
    const data = await response.json();
    const replies = data.responses;

    for (const reply of replies) {
      if (question.toLowerCase().includes(reply.question)) {
        if (reply.options) {
          return reply.options;
        } else {
          return reply.answer;
        }
      }
    }

    return "I'm sorry, I don't have an answer for that question.";
  } catch (error) {
    console.error('Error fetching bot replies:', error);
    return "I'm sorry, there was an error processing your request.";
  }
}

async function addBotMessage(message) {
  const typingSpeed = 50; // Speed in milliseconds per character
  const chatBox = document.createElement('div');
  chatBox.classList.add('chat-box', 'bot');
  chatContainer.appendChild(chatBox);

  for (let i = 0; i < message.length; i++) {
    await new Promise(resolve => setTimeout(resolve, typingSpeed));
    chatBox.innerHTML += message.charAt(i);
    chatContainer.scrollTop = chatContainer.scrollHeight; // Auto-scroll to bottom
    typingSound.play(); // Play typing sound
  }

  // Stop typing sound after the message is fully displayed
  typingSound.pause();
  typingSound.currentTime = 0;
}

function addUserMessage(message) {
  const chatBox = document.createElement('div');
  chatBox.classList.add('chat-box', 'user');
  chatBox.innerHTML = `<p class="user-message">${message}</p>`;
  chatContainer.appendChild(chatBox);
  chatContainer.scrollTop = chatContainer.scrollHeight; // Auto-scroll to bottom
}


async function askQuestion() {
  const question = userInput.value.trim();
  if (question !== '') {
    addUserMessage(question);
    userInput.disabled = true; // Disable input while bot is typing
    const reply = await getBotReply(question);
    if (Array.isArray(reply)) {
      addBotOptions(reply);
    } else {
      await addBotMessage(reply);
    }
    userInput.value = '';
    userInput.disabled = false; // Re-enable input
  }
}

function selectOption(index) {
  const selectedOption = document.querySelectorAll('.chat-box.bot ul li button')[index].textContent;
  addUserMessage(selectedOption);
  // Implement action based on the selected option if needed
}
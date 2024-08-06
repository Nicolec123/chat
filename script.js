// Array para armazenar mensagens do chat
let messagesHistory = [];
// Envio do formulário de login
document.getElementById("loginForm").addEventListener("submit", async (event) => {
  event.preventDefault();
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;
  console.log("Tentando fazer login com o usuário:", username);
  try {
    const response = await fetch("https://hmlg.portalbeneficiocerto.com.br/chat_certo/sessions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    console.log("Login response:", data);
    localStorage.setItem("access_token", data.access_token);
    document.getElementById("loginContainer").style.display = "none";
    document.getElementById("chatContainer").style.display = "block";
    // Atualiza o histórico com as mensagens armazenadas
    updateHistory();
  } catch (error) {
    console.error("Failed to login:", error.message);
    alert("Falha ao fazer login, tente novamente!");
  }
});
// Envio do formulário de chat
document.getElementById("chatForm").addEventListener("submit", async (event) => {
  event.preventDefault();
  const message = document.getElementById("message").value;
  const token = localStorage.getItem("access_token");
  console.log("Enviando mensagem:", message);
  // Mostrar o GIF de carregamento
  document.getElementById("loadingGif").style.display = "block";
  try {
    const response = await fetch(
      "https://hmlg.portalbeneficiocerto.com.br/chat_certo/ai/chat_certo",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ message }),
      }
    );
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    console.log("Chat response:", data);
    const messagesDiv = document.getElementById("messages");
    // Adicionar a mensagem do usuário
    const userMessage = {
      type: 'user',
      content: message
    };
    // Adicionar a mensagem do bot
    const botMessageContent = data.result ? data.result : "Infelizmente, sou incapaz de responder a essa pergunta. Se precisar de mais ajuda, estarei à sua disposição! :feliz:";
    // Converter resposta para tabela
    const botMessageTable = convertResponseToTable(botMessageContent);
    const botMessage = {
      type: 'bot',
      content: botMessageTable
    };
    // Adicionar as mensagens ao histórico
    messagesHistory.push(userMessage);
    messagesHistory.push(botMessage);
    // Atualizar a visualização de mensagens
    updateMessagesDiv();
    // Limpar o campo de entrada de mensagem
    document.getElementById("message").value = "";
  } catch (error) {
    console.error("Failed to send message:", error.message);
    alert("Falha ao enviar mensagem, tente novamente!");
  } finally {
    // Ocultar o GIF de carregamento
    document.getElementById("loadingGif").style.display = "none";
  }
});
// Função para converter a resposta em uma tabela HTML
function convertResponseToTable(response) {
  // Supondo que a resposta seja uma string CSV
  const rows = response.split("\n");
  let tableHTML = "<table>";
  rows.forEach(row => {
    tableHTML += "<tr>";
    const columns = row.split(";");
    columns.forEach(column => {
      tableHTML += `<td>${column}</td>`;
    });
    tableHTML += "</tr>";
  });
  tableHTML += "</table>";
  return tableHTML;
}
// Função para atualizar o div de mensagens com base no histórico
function updateMessagesDiv() {
  const messagesDiv = document.getElementById("messages");
  messagesDiv.innerHTML = "";
  messagesHistory.forEach((message) => {
    const messageDiv = document.createElement("div");
    messageDiv.className = `message ${message.type}`;
    messageDiv.innerHTML = `${message.type === 'user' ? 'Pergunta: ' : 'Resposta: '}${message.content}`;
    const deleteIcon = document.createElement("span");
    deleteIcon.className = "delete-icon";
    deleteIcon.textContent = "x";
    deleteIcon.onclick = () => {
      // Remover a mensagem da visualização atual
      messagesDiv.removeChild(messageDiv);
      deleteIcon.style.position = "absolute";
      deleteIcon.style.right = "2px";
      deleteIcon.style.top = "2px";
      // Atualiza o histórico (não remove a mensagem do histórico)
      updateHistory();
    };
    messageDiv.appendChild(deleteIcon);
    messagesDiv.appendChild(messageDiv);
  });
}
// Função para atualizar o histórico
function updateHistory() {
  const historyContainer = document.getElementById("historyContainer");
  historyContainer.innerHTML = "";
  messagesHistory.forEach(message => {
    const messageDiv = document.createElement("div");
    messageDiv.className = `message ${message.type}`;
    messageDiv.innerHTML = `${message.type === 'user' ? 'Pergunta: ' : 'Resposta: '}${message.content}`;
    historyContainer.appendChild(messageDiv);
  });
}
// Clique no botão de histórico
document.getElementById("historyButton").addEventListener("click", () => {
  const messagesDiv = document.getElementById("messages");
  const historyContainer = document.getElementById("historyContainer");
  const historyButton = document.getElementById("historyButton");
  if (messagesDiv.style.display === "none" || messagesDiv.style.display === "") {
    messagesDiv.style.display = "block";
    historyContainer.style.display = "none";
    historyButton.classList.remove("active");
  } else {
    messagesDiv.style.display = "none";
    historyContainer.style.display = "block";
    historyButton.classList.add("active");
    // Atualiza o histórico com as mensagens atuais
    updateHistory();
  }
});
// Clique no botão de logout
document.getElementById("logoutButton").addEventListener("click", () => {
  // Remove o token de acesso do localStorage
  localStorage.removeItem("access_token");
  // Limpa o histórico de mensagens
  messagesHistory = [];
  const historyContainer = document.getElementById("historyContainer");
  historyContainer.innerHTML = "";
  // Limpa os campos de login
  document.getElementById("username").value = "";
  document.getElementById("password").value = "";
  // Exibe o container de login e oculta o container de chat
  document.getElementById("loginContainer").style.display = "block";
  document.getElementById("chatContainer").style.display = "none";
});
// Exibir o carrossel com as imagens de exemplo
document.getElementById("plaquinhaGif").addEventListener("click", () => {
  document.getElementById("carousel").style.display = "flex";
});
// Fechar o carrossel
document.getElementById("closeButton").addEventListener("click", () => {
  document.getElementById("carousel").style.display = "none";
});
// Navegar pelas imagens do carrossel
let currentIndex = 0;
const images = [
  document.getElementById("apresentaGif"),
  document.getElementById("exemplosGif")
];
document.getElementById("prevButton").addEventListener("click", () => {
  images[currentIndex].style.display = "none";
  currentIndex = (currentIndex - 1 + images.length) % images.length;
  images[currentIndex].style.display = "block";
});
document.getElementById("nextButton").addEventListener("click", () => {
  images[currentIndex].style.display = "none";
  currentIndex = (currentIndex + 1) % images.length;
  images[currentIndex].style.display = "block";
});

// Array para armazenar mensagens do chat
let messagesHistory = []

// Envio do formulário de login
document.getElementById("loginForm").addEventListener("submit", async (event) => {
  event.preventDefault();
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;
  console.log("Tentando fazer login com o usuário:", username);
  
  try {
    const response = await fetch(
      "https://hmlg.portalbeneficiocerto.com.br/chat_certo/sessions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      }
    );

    if (!response.ok) {
      if (response.status === 500) {
        throw new Error("Chat indisponível no momento, por favor tente mais tarde!");
      } else {
        throw new Error("Falha ao enviar mensagem, verifique se o usuário e senha estão certos e tente novamente!");
      }
    }

    const data = await response.json();
    console.log("Login response:", data);
    localStorage.setItem("access_token", data.access_token);

    // Ocultar a tela de login e a imagem de fundo, e exibir o chat
    document.getElementById("loginContainer").style.display = "none";
    const homeContainer = document.getElementById("home-container");
    homeContainer.style.display = "block";

    // Ocultar a imagem de fundo
    document.querySelector(".imagem-de-fundo").classList.add("hidden");
    
    // Exibir o carrossel automaticamente ao entrar no chat
    document.getElementById("carousel").style.display = "flex"; 
    
    // Atualiza o histórico com as mensagens armazenadas
    updateMessagesDiv();
  } catch (error) {
    console.error("Failed to login:", error.message);
    alert(error.message);
  }
});
 

// Envio do formulário de chat
document
  .getElementById("chatForm")
  .addEventListener("submit", async (event) => {
    event.preventDefault()
    const message = document.getElementById("message").value
    const token = localStorage.getItem("access_token")
    console.log("Enviando mensagem:", message)
    
    // Mostrar o GIF de carregamento
    document.getElementById("loadingGif").style.display = "block"
    
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
      )
      
      if (!response.ok) {
        if (response.status === 500) {
          throw new Error("Chat indisponível no momento, por favor tente mais tarde!")
        } else {
          throw new Error("Falha ao enviar mensagem, verifique o conteúdo digitado e tente novamente!")
        }
      }
      
      const data = await response.json()
      console.log("Chat response:", data)
      const messagesDiv = document.getElementById("messages")
      
      // Adicionar a mensagem do usuário
      const userMessage = {
        type: "user",
        content: message,
      }
      
      // Adicionar a mensagem do bot
      const botMessageContent = data.result
        ? data.result
        : "Infelizmente, sou incapaz de responder a esta pergunta. Caso precise de mais assistência, estarei à sua disposição! :)"
        
      // Converter resposta para tabela
      const botMessageTable = convertResponseToTable(botMessageContent)
      const botMessage = {
        type: "bot",
        content: botMessageTable,
      }
      
      // Adicionar as mensagens ao histórico
      messagesHistory.push(userMessage)
      messagesHistory.push(botMessage)
      
      // Atualizar a visualização de mensagens
      updateMessagesDiv()
      
      // Limpar o campo de entrada de mensagem
      document.getElementById("message").value = ""
      
    } catch (error) {
      console.error("Failed to send message:", error.message)
      alert(error.message)
      
    } finally {
      // Ocultar o GIF de carregamento
      document.getElementById("loadingGif").style.display = "none"
    }
  })

// Função para converter a resposta em uma tabela HTML
function convertResponseToTable(response) {
  // Supondo que a resposta seja uma string CSV
  const rows = response.split("\n")
  let tableHTML = "<table>"
  rows.forEach((row) => {
    tableHTML += "<tr>"
    const columns = row.split(";")
    columns.forEach((column) => {
      tableHTML += `<td>${column}</td>`
    })
    tableHTML += "</tr>"
  })
  tableHTML += "</table>"
  return tableHTML
}

// Função para atualizar o div de mensagens com base no histórico
function updateMessagesDiv() {
  const messagesDiv = document.getElementById("messages")
  messagesDiv.innerHTML = ""
  messagesHistory.forEach((message, index) => {
    const messageDiv = document.createElement("div")
    messageDiv.className = `message ${message.type}`
    messageDiv.innerHTML = `${message.type === "user" ? "Pergunta: " : "Resposta: "}${message.content}`
    const deleteIcon = document.createElement("span")
    deleteIcon.className = "delete-icon"
    deleteIcon.textContent = "x"
    deleteIcon.onclick = () => {
      // Remove a mensagem do histórico
      messagesHistory.splice(index, 1)
      // Atualiza o div de mensagens
      updateMessagesDiv()
    }
    messageDiv.appendChild(deleteIcon)
    messagesDiv.appendChild(messageDiv)
  })
}
// Função para deletar todas as mensagens
function deleteAllMessages() {
  // um alerta de confirmação
  const userConfirmed = confirm("Você tem certeza de que deseja apagar todas as mensagens? Esta ação não pode ser desfeita.")
  if (userConfirmed) {
    const messagesDiv = document.getElementById("messages")
    messagesDiv.innerHTML = ""
    messagesHistory = []
  }
}

// botão de deletar todas as mensagens
document.getElementById("deleteAllButton").addEventListener("click", () => {
  deleteAllMessages()
})


// Botão de logout
document.getElementById("logoutButton").addEventListener("click", () => {
  // Alerta de confirmação para o logout
  const userConfirmed = confirm("Você tem certeza de que deseja sair? Todas as suas mensagens serão apagadas.")
  
  if (userConfirmed) {
    // Remove o token de acesso do localStorage
    localStorage.removeItem("access_token")
  
    // Remove o histórico de mensagens do localStorage
    localStorage.removeItem("messagesHistory")
  
    // Limpa o histórico de mensagens
    messagesHistory = []
    const messagesContainer = document.getElementById("messages")
    messagesContainer.innerHTML = ""
  
    // Limpa os campos de login
    document.getElementById("username").value = ""
    document.getElementById("password").value = ""
  
    // Limpa o campo de entrada de mensagem atual
    document.getElementById("message").value = ""
  
    // Exibe o container de login e oculta o container de chat
    document.getElementById("loginContainer").style.display = "block"
    document.getElementById("home-container").style.display = "none"
  }
})

// Exibir o carrossel com as imagens de exemplo
document.getElementById("plaquinhaGif").addEventListener("click", () => {
  document.getElementById("carousel").style.display = "flex" /* isso é responsável por ele aparecer*/ 
})

// Fechar o carrossel
document.getElementById("closeButton").addEventListener("click", () => {
  document.getElementById("carousel").style.display = "none"
})

// Navegar pelas imagens do carrossel
let currentIndex = 0
const images = [
  document.getElementById("apresentaGif"),
  document.getElementById("exemplosGif"),
]
document.getElementById("prevButton").addEventListener("click", () => {
  images[currentIndex].style.display = "none"
  currentIndex = (currentIndex - 1 + images.length) % images.length
  images[currentIndex].style.display = "block"
})
document.getElementById("nextButton").addEventListener("click", () => {
  images[currentIndex].style.display = "none"
  currentIndex = (currentIndex + 1) % images.length
  images[currentIndex].style.display = "block"
})

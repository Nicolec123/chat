// Array para armazenar mensagens do chat
let messagesHistory = []

// Envio do formulário de login
document
  .getElementById("loginForm")
  .addEventListener("submit", async (event) => {
    event.preventDefault()
    const username = document.getElementById("username").value
    const password = document.getElementById("password").value
    console.log("Tentando fazer login com o usuário:", username)
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
      )
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const data = await response.json()
      console.log("Login response:", data)
      localStorage.setItem("access_token", data.access_token)
      document.getElementById("loginContainer").style.display = "none"
      document.getElementById("home-container").style.display = "block"
      
      // Esse é o carrossel que aparece automaticamente ao fazer o login e entrar na tela de chat
      document.getElementById("carousel").style.display = "flex"  /* isso é responsável por ele aparecer*/ 
      
      // Atualiza o histórico com as mensagens armazenadas
      updateMessagesDiv()
    } catch (error) {
      console.error("Failed to login:", error.message)
      alert("Falha ao fazer login, tente novamente!")
    }
  })

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
        throw new Error(`HTTP error! status: ${response.status}`)
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
        : "Infelizmente, sou incapaz de responder a esta pergunta. Caso precise de mais assistência, estarei à sua disposição!:)"
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
      alert("Falha ao enviar mensagem, tente novamente!")
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

//  botão de logout
document.getElementById("logoutButton").addEventListener("click", () => {
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

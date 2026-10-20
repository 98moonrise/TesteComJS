//AUTO-PREENCHIMENTO
window.addEventListener("load", function() {
    const emailCadastrado = localStorage.getItem("emailSalvo");
    const senhaCadastrada = localStorage.getItem("senhaSalva");

    if (emailCadastrado && senhaCadastrada) {
        document.getElementById("log_user").value = emailCadastrado;
        document.getElementById("log_pswrd").value = senhaCadastrada;
    }
    
    carregarNotasSalvas();
});
window.addEventListener("load", function(){
    const usuarioSalvo = localStorage.getItem("emailSalvo");
    const senhaSalva = localStorage.getItem("senhaSalva");

    const cena = document.querySelector(".cena");
    const painelPrincipal = document.getElementById("display");

    if  (usuarioSalvo && senhaSalva){
        console.log("Crendenciais encontradas! Pulando tela de registro.");
        
        if (cena) cena.classList.add("escondido");
        
        if (painelPrincipal) painelPrincipal.classList.remove("escondido");
    }   else {
            console.log("Nenhuma credencial encontrada. Mostrando tela de registro.");

        if (cena) cena.classList.remove("escondido");
        if (painelPrincipal) painelPrincipal.classList.add("escondido");
    }
});

//cadastro
document.getElementById("btn_cadastro").addEventListener("click", function(event){
    event.preventDefault();
    const emailUser = document.getElementById("create_user").value;
    const pswrdUser = document.getElementById("create_pswrd").value;
    if (emailUser=="" || pswrdUser==""){
        alert("Preencha todos os campos!");
        return;
    }
    //salvando no localstorage
    localStorage.setItem("emailSalvo", emailUser);
    localStorage.setItem("senhaSalva", pswrdUser);
    alert("Cadastro realizado com sucesso!");

    //troca de tela: vira o circulo para a face do login
    girar();
});

//login
document.getElementById("btn_login").addEventListener("click", function(event){
    event.preventDefault();
    const loguser = document.getElementById("log_user").value;
    const logpswrd = document.getElementById("log_pswrd").value;
    const emailReal = localStorage.getItem("emailSalvo");
    const senhaReal = localStorage.getItem("senhaSalva");
    if (loguser == emailReal && logpswrd == senhaReal) {
        document.querySelector(".cena").classList.add("escondido");
        document.getElementById("display").classList.remove("escondido");
    } else {
        alert("Email ou senha incorretos!");
    }
});

//sair/reset
document.getElementById("btn_sair").addEventListener("click", function(event){
    event.preventDefault();
    document.getElementById("display").classList.add("escondido");
    document.querySelector(".cena").classList.remove("escondido");
    document.getElementById("circulo").classList.add("girado"); // ja volta na cara do login
    //limpa os campos de login
    document.getElementById("log_user").value = "";
    document.getElementById("log_pswrd").value = "";
});

// --- FUNÇÃO PARA CRIAR E DESENHAR A NOTA NA TELA ---
function criarNotaNaTela(texto, posLeft = "20px", posTop = "20px") {
    const novaNota = document.createElement("div");
    novaNota.classList.add("stickyNote");
    novaNota.style.left = posLeft;
    novaNota.style.top = posTop;

    const paragrafo = document.createElement("p");
    paragrafo.textContent = texto;

    const botaoApagar = document.createElement("button");
    botaoApagar.textContent = "X";
    botaoApagar.addEventListener("click", function(e){
        e.stopPropagation();
        novaNota.remove();
        salvarTodasAsNotas(); // Atualiza o localStorage ao apagar
    });

    novaNota.appendChild(paragrafo); 
    novaNota.appendChild(botaoApagar);
    document.getElementById("containerNotas").appendChild(novaNota);

    // Lógica para arrastar a nota
    let isdragging = false;
    let offsetX, offsetY;

    novaNota.addEventListener("mousedown", function(e){
        if (e.target.tagName === "BUTTON") return;
        isdragging = true;
        offsetX = e.clientX - novaNota.offsetLeft;
        offsetY = e.clientY - novaNota.offsetTop;
        novaNota.style.zIndex = 1000;
    });

    document.addEventListener("mousemove", function(e){
        if(!isdragging) return;
        novaNota.style.left = (e.clientX - offsetX) + "px";
        novaNota.style.top = (e.clientY - offsetY) + "px";
    });

    document.addEventListener("mouseup", function(e){
        if (isdragging){
            isdragging = false;
            novaNota.style.zIndex = 1;
            salvarTodasAsNotas(); // Salva a nova posição ao soltar a nota
        }
    });
}

// --- FUNÇÃO PARA SALVAR TODAS AS NOTAS NO LOCALSTORAGE ---
function salvarTodasAsNotas() {
    const elementosNotas = document.querySelectorAll(".stickyNote");
    const listaParaSalvar = [];

    elementosNotas.forEach(function(notaEl) {
        const texto = notaEl.querySelector("p").textContent;
        const left = notaEl.style.left;
        const top = notaEl.style.top;
        listaParaSalvar.push({ texto: texto, left: left, top: top });
    });

    localStorage.setItem("minhasNotas", JSON.stringify(listaParaSalvar));
}

// --- FUNÇÃO PARA CARREGAR AS NOTAS SALVAS ---
function carregarNotasSalvas() {
    const notasSalvas = JSON.parse(localStorage.getItem("minhasNotas")) || [];
    document.getElementById("containerNotas").innerHTML = ""; // Limpa para não duplicar

    notasSalvas.forEach(function(notaData) {
        criarNotaNaTela(notaData.texto, notaData.left, notaData.top);
    });
}

//stickyNotes (Botão Criar)
document.getElementById("btnCriarNota").addEventListener("click", function(){
    const inputNota = document.getElementById("textoNota");
    const conteudoTexto = inputNota.value.trim();
    
    if (conteudoTexto === ""){
        alert("Escreva alguma coisa na nota antes de criar!");
        return;
    }

    // Cria na tela
    criarNotaNaTela(conteudoTexto, "20px", "20px");
    
    // Salva no LocalStorage
    salvarTodasAsNotas();

    inputNota.value = "";
});

//abrir/fechar pasta de notas
document.getElementById("btnTogglePasta").addEventListener("click", function(){
    const container = document.getElementById("containerNotas");
    container.classList.toggle("escondido");
});
function mudarTema(corHex) {
    document.documentElement.style.setProperty('--cor-principal', corHex);
    localStorage.setItem('corTemaSalva', corHex);
}
window.addEventListener("load", function(){
    const corSalva = localStorage.getItem('corTemaSalva');

    if  (corSalva) {
        document.documentElement.style.setProperty('--cor-principal', corSalva);
    }
});
document.addEventListener("DOMContentLoaded", function() {
    const botaoTemas = document.getElementById("abrirTemas");
    const painelTemas = document.getElementById("painelTemas");

    // Uma verificação de segurança para o console te avisar se faltou algo
    if (!botaoTemas || !painelTemas) {
        console.error("ERRO: O botão ou o painel não foram encontrados no DOM!");
        return;
    }

    botaoTemas.addEventListener("click", function() {
        painelTemas.classList.toggle("escondido");
    });
});
function girar(){
    document.getElementById("circulo").classList.toggle("girado");
}
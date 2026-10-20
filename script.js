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

    //troca de tela
    document.getElementById("registro").classList.add("escondido");
    document.getElementById("login").classList.remove("escondido");
});

//login
document.getElementById("btn_login").addEventListener("click", function(event){
    event.preventDefault();
    const loguser = document.getElementById("log_user").value;
    const logpswrd = document.getElementById("log_pswrd").value;
    const emailReal = localStorage.getItem("emailSalvo");
    const senhaReal = localStorage.getItem("senhaSalva");
    if (loguser == emailReal && logpswrd == senhaReal) {
        document.getElementById("login").classList.add("escondido");
        document.getElementById("display").classList.remove("escondido");
    } else {
        alert("Email ou senha incorretos!");
    }
});

//sair/reset
document.getElementById("btn_sair").addEventListener("click", function(event){
    event.preventDefault();
    document.getElementById("display").classList.add("escondido");
    document.getElementById("login").classList.remove("escondido");
    //limpa os campos de login
    document.getElementById("log_user").value = "";
    document.getElementById("log_pswrd").value = "";
});

//calculadora dy
document.getElementById("calculadora").addEventListener("click", function(){
    let preco = parseFloat(document.getElementById("preco").value);
    let dividendo = parseFloat(document.getElementById("dividendo").value);
    if (isNaN(preco)|| isNaN(dividendo)||preco<=0){
        document.getElementById("resultado-dy").innerHTML = 
         "<span style='color:#ef4444;'>Por favor insira somente valores numericos validos!</span>";
         return;      
    }
    let DY = (dividendo/preco) * 100;
    document.getElementById("resultado-dy").innerHTML = 
     `Dividend Yield: <strong style='color:#a855f7;'>${DY.toFixed(2)}%</strong>`;
});

//calculadora p/vp
document.getElementById("calculadora2").addEventListener("click", function(){
    let precotexto = document.getElementById("preco-pvp").value.replace(",",".");
    let vptexto = document.getElementById("vp").value.replace(",",".");
    let preco = parseFloat(precotexto);
    let vp = parseFloat(vptexto);
    if (isNaN(preco)|| isNaN(vp)||vp<=0){
        document.getElementById("resultado-pvp").innerHTML =
        "<span style='color:#ef4444;'>Por favor, insira valores numericos validos!</span>";
        return;
    }
    let pvp = preco / vp;
    let mensagemExtra = "";
    if(pvp < 1){
        mensagemExtra = "<span style='font-size:0.85em; color:#22c55e;'>(Abaixo do VP)</span>";
    } else if (pvp > 1){
        mensagemExtra = "<span style='font-size:0.85em; color:#eab308;'>(Acima do VP)</span>";
    } else {
        mensagemExtra = "<span style='font-size:0.85em; color:#eab308;'>(Ta otimo)</span>";
    }
    document.getElementById("resultado-pvp").innerHTML = `P/VP: <strong style='color: #a855f7;'>${pvp.toFixed(2)}</strong>${mensagemExtra}`;
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
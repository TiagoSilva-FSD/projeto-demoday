// Mecanismo de Pesquisa com Google

let entrada = document.querySelector('.entrada_pesquisa');
let botao = document.querySelector('.botao_pesquisa');
botao.onclick = function () {
    if (entrada.value === ''){
        alert("Campo vazio!");
        return false;
    }
    let url = 'https://www.google.com.br/search?q=' + entrada.value;
    window.open(url);
}

/***************************************************************************************/

// Verifica a autenticação e atualiza DOM

let userName, userClass;

async function auth() {
    const opt = {
        method: 'GET',
        mode: 'cors',
        cache: 'default',
        headers: {'Content-Type': 'application/json', 'Authorization': sessionStorage.getItem("token"),
                  'id': sessionStorage.getItem("id")}
    }
    
    await fetch("http://127.0.0.1:5000/auth", opt)
    .then(resp => {resp.json()
        .then(data => {
            if (resp.status === 200 && data["status"] == "ativo") {
                userName = data["name"];
                userClass = data["class"];
                sessionStorage.setItem("front", data["frontend"]);
                sessionStorage.setItem("back", data["backend"]);
                document.querySelector(".foto_perfil").src = data["picture"];
                document.querySelector(".nome_usuario").innerHTML = data["name"];
                document.querySelector(".email_usuario").innerHTML = data["email"];
                document.querySelector(".chat_inbox").innerHTML = data["inbox"];
                const elementoFront = document.querySelector(".barraFront");
                elementoFront.innerHTML = data["frontend"] + "%";
                elementoFront.style.width = data["frontend"] + "%";
                const elementoBack = document.querySelector(".barraBack");
                elementoBack.innerHTML = data["backend"] + "%";
                elementoBack.style.width = data["backend"] + "%";
                if (data["frontend"] == 100 && data["backend"] == 100 && data["class"] == "expert") {
                    document.querySelector(".nome_usuario").innerHTML = data["name"] += "(EXPERT)";
                    document.querySelector(".nome_usuario").style.color = "green";
                }
            } else {
                alert("Você não tem autorização! Contacte o Admin.");
                deauth();
                window.location.href = "C:/Users/Shonen/Downloads/source/Projeto_Tera/frontend/index.html";
            }
        })
    })
}

/**************************************************************************************/

// Bloqueia os botões após utiliza-los

function bt_prat1() {
    if (sessionStorage.getItem("front") == 40) {
        document.getElementById("bt_prat1").setAttribute("disabled", true);
    } else if (sessionStorage.getItem("front") == 70) {
        document.getElementById("bt_prat1").setAttribute("disabled", true);
    } else if (sessionStorage.getItem("front") == 100) {
        document.getElementById("bt_prat1").setAttribute("disabled", true);
    }
}

function bt_prat2() {
    if (sessionStorage.getItem("front") == 70) {
        document.getElementById("bt_prat2").setAttribute("disabled", true);
    } else if (sessionStorage.getItem("front") == 100) {
        document.getElementById("bt_prat2").setAttribute("disabled", true);
    }
}

function bt_prat3() {
    if (sessionStorage.getItem("front") == 100) {
        document.getElementById("bt_prat3").setAttribute("disabled", true);
    }
}

function bt_prat4() {
    if (sessionStorage.getItem("back") == 55) {
        document.getElementById("bt_prat4").setAttribute("disabled", true);
    } else if (sessionStorage.getItem("back") == 100) {
        document.getElementById("bt_prat4").setAttribute("disabled", true);
    }
}

function bt_prat5() {
    if (sessionStorage.getItem("back") == 100) {
        document.getElementById("bt_prat5").setAttribute("disabled", true);
    }
}

/**************************************************************************************/

// Atualiza as barras de progresso

function progressoFront() {
    let iD = sessionStorage.getItem("id");
    let contFront = Number(sessionStorage.getItem("front")) + 30;
    let url = "http://127.0.0.1:5000/update/" + iD;

    body = {
        "name": '',
        "email": '',
        "frontend": contFront,
        "backend": ''
    }

    const http = new XMLHttpRequest();
    http.open("PUT", url, true);
    http.setRequestHeader("Content-type", "application/json");
    http.send(JSON.stringify(body));
    http.onload = function() {
        if (this.status === 200) {
            auth();
            window.location.reload();
        } else {
            alert("Erro tente novamente!");
        }        
    }
}


function progressoBack() {
    let iD = sessionStorage.getItem("id");
    let contBack = Number(sessionStorage.getItem("back")) + 45;
    let url = "http://127.0.0.1:5000/update/" + iD;

    body = {
        "name": '',
        "email": '',
        "frontend": '',
        "backend": contBack
    }

    const http = new XMLHttpRequest();
    http.open("PUT", url, true);
    http.setRequestHeader("Content-type", "application/json");
    http.send(JSON.stringify(body));
    http.onload = function() {
        if (this.status === 200) {
            auth();
            window.location.reload();
        } else {
            alert("Erro tente novamente!");
        }        
    }
}

//**************************************************************************************/

// GET info

function mostrarInfo() {
    let url = "http://127.0.0.1:5000/";

    const http = new XMLHttpRequest();
    http.open("GET", url, true);
    http.send(); 
    http.onload = function() {
        const objJs = JSON.parse(this.responseText);
        let texto = "";
        for (let chave in objJs){
            texto += "<br>" + chave + ": " + objJs[chave];
        }
        document.getElementById("metodo_get").innerHTML = texto;
    }       
}


// POST cadastrar

function cadastrarUsuario() {
    event.preventDefault();
    let url = "http://127.0.0.1:5000/creat";
    let nome = document.getElementById("nome").value;
    let email = document.getElementById("email").value;
    let senha = document.getElementById("pswd").value;
    let image = document.getElementById("foto").value;
    let path = image.replace("C:\\fakepath\\", "perfil\\");

    body = {
        "name": nome,
        "email": email,
        "password": senha,
        "picture": path,
        "address": endereco
    }

    const http = new XMLHttpRequest();
    http.open("POST", url, true);
    http.setRequestHeader("Content-type", "application/json");
    http.send(JSON.stringify(body));
    http.onload = function() {
        if (this.status === 201) {
            alert("Cadastrado com sucesso!");
            window.location.href = "C:/Users/Shonen/Downloads/source/Projeto_Tera/frontend/index.html";
        } else if (this.status === 205) {
            alert("Email já está em uso!");
        } else {
            alert("Verifique os dados digitados!");
        }
    }
}


// POST login

function realizarLogin() {
    event.preventDefault();
    let url = "http://127.0.0.1:5000/login";
    let email = document.getElementById("email_login").value;
    let senha = document.getElementById("pswd_login").value;

    body = {        
        "email": email,
        "password": senha
    }

    const http = new XMLHttpRequest();
    http.open("POST", url, true);
    http.setRequestHeader("Content-type", "application/json");
    http.send(JSON.stringify(body));
    http.onload = function(){
        let resp = JSON.parse(this.responseText)
        if (resp["id"] == 1 && this.status === 200) {
            sessionStorage.setItem("id_admin", resp["id"]);
            sessionStorage.setItem("token_admin", resp["token"]);
            alert("Login com sucesso!");
            window.location.href = "C:/Users/Shonen/Downloads/source/Projeto_Tera/frontend/admin.html";
        }        
        else if (resp["id"] > 1 && this.status === 200){
            sessionStorage.setItem("id", resp["id"]);
            sessionStorage.setItem("token", resp["token"]);
            sessionStorage.setItem("front", resp["frontend"]);
            sessionStorage.setItem("back", resp["backend"]);
            alert("Login com sucesso!");
            window.location.href = "C:/Users/Shonen/Downloads/source/Projeto_Tera/frontend/plataforma.html";
        }
        else {
            alert("Usuário ou senha inválidos");                       
        }
    }
}


// PUT

function alterarDados() {
    event.preventDefault();
    let iD = sessionStorage.getItem("id");
    let url = "http://127.0.0.1:5000/update/" + iD;
    let novo_nome = document.getElementById("novo_nome").value;
    let novo_email = document.getElementById("novo_email").value;
    let senha_atual = document.getElementById("pswd_atual").value;
    let nova_senha = document.getElementById("pswd_novo").value;
    let image = document.getElementById("nova_foto").value;
    let path = image.replace("C:\\fakepath\\", "perfil\\");

    body = {
        "name": novo_nome,
        "email": novo_email,
        "picture": path,
        "pswd_atual": senha_atual,
        "pswd_novo": nova_senha,
        "frontend": '',
        "backend": ''
    }

    const http = new XMLHttpRequest();
    http.open("PUT", url, true);
    http.setRequestHeader("Content-type", "application/json");
    http.send(JSON.stringify(body));
    http.onload = function() {
        if (this.status === 200) {
            alert("Dados alterados e salvos!");
            auth();
            window.location.reload();
        } else {
            alert("Verifique os dados!");
        }        
    }
}


// DELETE

function realizarCancelamento() {
    event.preventDefault();
    let iD = sessionStorage.getItem("id");
    let senha = document.getElementById("pswd_cancel").value;
    let url = "http://127.0.0.1:5000/user/" + iD;

    body = {
        "password": senha
    }

    const http = new XMLHttpRequest();
    http.open("DELETE", url, true);
    http.setRequestHeader("Content-type", "application/json");
    http.send(JSON.stringify(body));
    http.onload = function() {
        if (this.status === 204) {
            alert("A conta foi Cancelada!");
            deauth();
            window.location.href = "C:/Users/Shonen/Downloads/source/Projeto_Tera/frontend/index.html";
        } else {
            alert("Senha incorreta!");
        }
    }
}

/*******************************************************************************************************************************/
// Living Chat
// POST envia uma mensagem
function chatEnvia() {
    event.preventDefault();
    let url = "http://127.0.0.1:5000/chat";
    let msn = document.querySelector(".chat_aluno").value;
    let date = new Date();
    if (msn === '') {
        alert("Digite algo!");
        return false;
    }

    body = {
        "destinatario": 1,
        "remetente": userName,
        "mensagem": msn,
        "date": date.toDateString()
    }

    const http = new XMLHttpRequest();
    http.open("POST", url, true);
    http.setRequestHeader("Content-type", "application/json");
    http.send(JSON.stringify(body));
    http.onload = function() {
        if (this.status === 200) {
            window.location.reload();
        } else {
            alert("Algo errado!");
        }
    }
}


// GET carrega todas as mensagens
function chatReceber() {
    let url = "http://127.0.0.1:5000/chat";
    
    const http = new XMLHttpRequest();
    http.open("GET", url, true);
    http.setRequestHeader("Content-type", "application/json");
    http.setRequestHeader("id", sessionStorage.getItem("id"));
    http.send();
    http.onload = function() {
        if (this.status === 200) {
            let objJs = JSON.parse(this.responseText);
            texto = '';
            for (let msn of objJs){
                texto += "(" + msn["date"] + ")<br>" + msn["mensagem"] + "<br>" + "<hr>";
            }
            document.querySelector(".chat_resp").innerHTML = texto;
        } else {
            alert("Erro!");
        }
    }
}


// HEAD apaga todas as mensagens
function clearChat() {
    let url = "http://127.0.0.1:5000/chat";
    
    const http = new XMLHttpRequest();
    http.open("HEAD", url, true);
    http.setRequestHeader("id", sessionStorage.getItem("id"));
    http.send();
    http.onload = function() {
        if (this.status === 200) {
            window.location.reload();
        } else {
            alert("Erro tente novamente!");
        }
    }
}
/******************************************************************************************************************************/

// Chat All Forum
// POST posta um comentário
function chatAllEnvia() {
    event.preventDefault();
    let url = "http://127.0.0.1:5000/chat";
    let msn = document.getElementById("commentAll").value;
    let date = new Date();
    if (msn === '') {
        alert("Digite algo!");
        return false;
    }

    body = {
        "destinatario": 0,
        "remetente": userName,
        "class": userClass,
        "mensagem": msn,
        "date": date.toDateString()
    }

    const http = new XMLHttpRequest();
    http.open("POST", url, true);
    http.setRequestHeader("Content-type", "application/json");
    http.send(JSON.stringify(body));
    http.onload = function() {
        if (this.status === 200) {
            window.location.reload();
        } else {
            alert("Algo errado!");
        }
    }
}


// Chat All Forum
// GET carrega todos os comentarios
function chatAllReceber() {
    let url = "http://127.0.0.1:5000/chat";
    
    const http = new XMLHttpRequest();
    http.open("GET", url, true);
    http.setRequestHeader("Content-type", "application/json");
    http.setRequestHeader("id", 0);
    http.send();
    http.onload = function() {
        if (this.status === 200) {
            let objJs = JSON.parse(this.responseText);
            texto = '';
            for (let msn of objJs){
                if (msn["class"] == "expert") {
                    texto += "(" + msn["date"] + ")<br>" + "<span class='corAll'>" + msn["remetente"] + "(EXPERT)" + "</span>" + 
                    ":<br>" + msn["mensagem"] + "<br>" + "<hr>";                    
                } else {
                    texto += "(" + msn["date"] + ")<br>" + msn["remetente"] + ":<br>" + msn["mensagem"] + "<br>" + "<hr>";                    
                }                
            }
            document.getElementById("forum").innerHTML = texto;
            document.querySelector(".corAll").style.color = "blue";
        } else {
            alert("Erro!");
        }
    }
}


/********************************************************************************************************** */
// DEAUTH

function deauth() {
    let url = "http://127.0.0.1:5000/auth";

    const http = new XMLHttpRequest();
    http.open("HEAD", url, true);
    http.setRequestHeader("id", sessionStorage.getItem("id"));
    http.send(); 
    http.onload = function() {
        if (this.status === 200) {
            sessionStorage.clear();
        } else {
            alert("Ocorreu um erro!");
        }
    }
}


// LOGOUT

function fazerLogout() {
    alert("Você fez logout");
    deauth();
    window.location.href = "C:/Users/Shonen/Downloads/source/Projeto_Tera/frontend/index.html";
}


// BACK

function retornar() {
    window.history.back();
}

/*****************************************************************************************/

// API CEP

const endereco = [];

async function dados() {
    const options = {
        method: 'GET',
        mode: 'cors',
        cache: 'default'
    }

    let cep = document.querySelector("#cep");
    cep.addEventListener("focusout", (e) => {
    e.preventDefault();
    fetch(`https://viacep.com.br/ws/${cep.value}/json/`, options)
        .then(response => {response.json()
            .then(data => {
                endereco[0] = data;
                for (let campo in data) {
                    if (document.querySelector("#" + campo)) {
                        document.querySelector("#" + campo).value = data[campo];
                    }
                }
            })
        })
        .catch(e => {
            alert("ERRO: " + e);
        })
    });
}

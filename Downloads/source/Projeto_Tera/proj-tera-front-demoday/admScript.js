// Verifica a autenticação

async function auth() {
    const opt = {
        method: 'GET',
        mode: 'cors',
        cache: 'default',
        headers: {'Content-Type': 'application/json', 'Authorization': sessionStorage.getItem("token_admin"),
                  'id': sessionStorage.getItem("id_admin")}
    }
    
    await fetch("http://127.0.0.1:5000/auth", opt)
    .then(resp => {resp.json()
        .then( data => {
            if (resp.status === 200 && data["id"] == 1) {
                document.getElementById("chat").innerHTML = data["inbox"];
            } else {
                alert("Você não tem autorização!");
                sessionStorage.clear();
                window.location.href = "C:/Users/Shonen/Downloads/source/Projeto_Tera/frontend/index.html";
            }
        })
    })
}


// LOGOUT

function logout() {
    alert("Você fez logout");
    sessionStorage.clear();
    window.location.href = "C:/Users/Shonen/Downloads/source/Projeto_Tera/frontend/index.html";
}


// Cria um backup da coleção atual do backend

function backup() {
    let url = "http://127.0.0.1:5000/admin/backup";

    const http = new XMLHttpRequest();
    http.open("HEAD", url, true);
    http.send(); 
    http.onload = function() {
        if (this.status == 200) {
            alert("Backup feito com sucesso! =)");
        } else {
            alert("Ocorreu um erro!");
        }
    }  
}


// Cria uma nova coleção no banco de dados

function collection() {
    event.preventDefault();
    let url = "http://127.0.0.1:5000/admin/collection";
    let nome_col = document.getElementById("collection1").value;
    let senha = document.getElementById("collection2").value;

    body = {
        "name": nome_col,
        "password": senha
    }

    const http = new XMLHttpRequest();
    http.open("POST", url, true);
    http.setRequestHeader("Content-type", "application/json");
    http.send(JSON.stringify(body));
    http.onload = function() {
        if (this.status === 201) {
            alert("Coleção criada com sucesso! =)");
        } else if (this.status === 205) {
            alert("Digite outro nome para a coleção!");
        } else {
            alert("Ocorreu um erro!");
        }
    }  
}


// Deleta todos os usuários de uma coleção do banco de dados

function deleteCol() {
    event.preventDefault();
    let url = "http://127.0.0.1:5000/admin/delete";
    let nome_col = document.getElementById("delete").value;

    body = {
        "name": nome_col,
    }

    const http = new XMLHttpRequest();
    http.open("POST", url, true);
    http.setRequestHeader("Content-type", "application/json");
    http.send(JSON.stringify(body));
    http.onload = function() {
        if (this.status === 204) {
            alert("Todos os usuarios foram deletados");
        } else if (this.status === 404) {
            alert("A coleção não existe!");
        } else {
            alert("Ocorreu um erro!");
        }
    }  
}


// Apaga uma coleção do banco de dados

function drop() {
    event.preventDefault();
    let url = "http://127.0.0.1:5000/admin/drop";
    let nome_col = document.getElementById("drop").value;

    body = {
        "name": nome_col,
    }

    const http = new XMLHttpRequest();
    http.open("POST", url, true);
    http.setRequestHeader("Content-type", "application/json");
    http.send(JSON.stringify(body));
    http.onload = function() {
        if (this.status === 204) {
            alert("A coleção foi apagada!");
        } else if (this.status === 404) {
            alert("A coleção não existe!");
        } else {
            alert("Ocorreu um erro!");
        }
    }  
}


// Lista um especifico usuário
let idAluno;

function listar() {
    event.preventDefault();
    let url = "http://127.0.0.1:5000/admin/user";
    let email = document.getElementById("email_aluno").value;
    if (email === '') {
        alert("Campo vazio!");
        return false;
    }

    body = {        
        "email": email,
    }

    const http = new XMLHttpRequest();
    http.open("POST", url, true);
    http.setRequestHeader("Content-type", "application/json");
    http.send(JSON.stringify(body));
    http.onload = function() {
        if (this.status === 200) {
            const user = JSON.parse(this.responseText);
            if (user["frontend"] == 100 && user["backend"] == 100 && user["class"] == "aluno") {
                document.getElementById("bt_admin4").removeAttribute("disabled");
            }
            document.getElementById("user_status").innerHTML = "Status: <span id='cor_status'>" + 
            user["status"] + "</span>    " + "Class: " + user["class"] + "    id: " + user["_id"];
            document.getElementById("user_foto").src = user["picture"];
            document.getElementById("user_name").innerHTML = user["name"];
            document.getElementById("user_email").innerHTML = user["email"];
            texto = '';
            for (let addr in user["address"][0]) {
                texto += addr + ": " + user["address"][0][addr] + "<br>";
            }
            document.getElementById("user_address").innerHTML = texto;
            document.getElementById("nomeAluno").innerHTML = user["name"];
            const elementoFront = document.getElementById("user_front");
            elementoFront.innerHTML = user["frontend"] + "%";
            elementoFront.style.width = user["frontend"] + "%";
            const elementoBack = document.getElementById("user_back");
            elementoBack.innerHTML = user["backend"] + "%";
            elementoBack.style.width = user["backend"] + "%";
            idAluno = user["_id"];
            document.getElementById("bt_admin3").removeAttribute("disabled");
            if (user["status"] == "ativo") {
                document.getElementById("cor_status").style = "color: blue";
                document.getElementById("bt_admin1").setAttribute("disabled", true);
                document.getElementById("bt_admin2").removeAttribute("disabled");
            } else {
                document.getElementById("cor_status").style = "color: red";
                document.getElementById("bt_admin1").removeAttribute("disabled");
                document.getElementById("bt_admin2").setAttribute("disabled", true);
            }
        } else if (this.status === 204) {
            alert("Usuário não encontrado!");
        }
    }       
}


// Lista o email de todos os usuários
function listarAll() {
    let url = "http://127.0.0.1:5000/admin/user";

    const http = new XMLHttpRequest();
    http.open("GET", url, true);
    http.setRequestHeader("Content-type", "application/json");
    http.send();
    http.onload = function() {
        if (this.status === 200) {
            const objJs = JSON.parse(this.responseText);
            let lista = objJs["emails"].sort();
            let texto = '';
            for (let email of lista) {
                texto += "<br>" + email;                   
            }
            document.getElementById("alunos").innerHTML = texto;
        } else {
            alert("Erro!");
        }
    }
}

/******************************************************************************************************* */
// Living Chat
// POST envia uma mensagem
function chatEnvia() {
    event.preventDefault();
    let url = "http://127.0.0.1:5000/chat";
    let msn = document.getElementById("comment").value;
    let date = new Date();
    console.log(idAluno)
    if (msn === '' || idAluno === undefined) {
        alert("Verifique os dados!");
        return false;
    }

    body = {
        "destinatario": Number(idAluno),
        "remetente": "Administrador",
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
    http.setRequestHeader("id", 1);
    http.send();
    http.onload = function() {
        if (this.status === 200) {
            let objJs = JSON.parse(this.responseText);
            texto = '';
            for (let msn of objJs){
                texto += "(" + msn["date"] + ")<br>" + msn["remetente"] + ":<br>" + msn["mensagem"] + "<br>" + "<hr>";
            }
            document.querySelector(".chat").innerHTML = texto;
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
    http.setRequestHeader("id", 1);
    http.send();
    http.onload = function() {
        if (this.status === 200) {
            window.location.reload();
        } else {
            alert("Erro tente novamente!");
        }
    }
}

/*******************************************************************************************************/

// Chat All Forum
// HEAD apaga todas mensagens forum
function clearAllChat() {
    let url = "http://127.0.0.1:5000/chat";
    
    const http = new XMLHttpRequest();
    http.open("HEAD", url, true);
    http.setRequestHeader("id", 0);
    http.send();
    http.onload = function() {
        if (this.status === 200) {
            window.location.reload();
        } else {
            alert("Erro tente novamente!");
        }
    }
}

/*********************************************************************************************************/

// Reativa a conta inativa do atual usuário

function reativarUser() {
    let url = "http://127.0.0.1:5000/admin/update/" + idAluno;

    body = {
        "status": "ativo",
        "name": ''
    }

    const http = new XMLHttpRequest();
    http.open("PUT", url, true);
    http.setRequestHeader("Content-type", "application/json");
    http.send(JSON.stringify(body));
    http.onload = function() {
        if (this.status === 200) {
            alert("A conta foi ativada!");
            listar();
        }
    }
}


// Desativa a conta ativa do atual usuário

function desativarUser() {
    let url = "http://127.0.0.1:5000/admin/update/" + idAluno;

    body = {
        "status": "inativo",
        "name": ''
    }

    const http = new XMLHttpRequest();
    http.open("PUT", url, true);
    http.setRequestHeader("Content-type", "application/json");
    http.send(JSON.stringify(body));
    http.onload = function() {
        if (this.status === 200) {
            alert("A conta foi inativada!");
            listar();
        }
    }
}


// Apaga o atual usuário da coleção

function deletarUser() {
    let url = "http://127.0.0.1:5000/admin/user/" + idAluno;

    const http = new XMLHttpRequest();
    http.open("DELETE", url, true);
    http.setRequestHeader("Content-type", "application/json");
    http.send();
    http.onload = function() {
        if (this.status === 204) {
            alert("A conta foi apagada do banco de dados!");
            window.location.reload();
        }
    }
}


// Promove um usuário a expert

function expertUser() {
    let url = "http://127.0.0.1:5000/admin/update/" + idAluno;

    body = {
        "status": '',
        "class": "expert"
    }

    const http = new XMLHttpRequest();
    http.open("PUT", url, true);
    http.setRequestHeader("Content-type", "application/json");
    http.send(JSON.stringify(body));
    http.onload = function() {
        if (this.status === 200) {
            alert("Sucesso!");
            window.location.reload();
        }
    }
}
from database import col

# Cria um usuário aluno
def alunos(id, name, email, password, path, address):
    return {
        "_id": id,
        "status": "ativo",
        "name": name,
        "email": email,
        "password": password,
        "picture": path,
        "frontend": 10,
        "backend": 10,
        "inbox": '',
        "address": address
    }

# Cria um usuário admin
def admin(senha):
    return {
        "_id": 1,
        "status": "ativo",
        "name": "Admin",
        "email": "admin@af.com.br",
        "inbox": '',
        "password": senha
    }

# Cria uma lista para armazenar mensagens
def criarInbox():
    iterar = col.find()
    contDoc = 1
    for doc in iterar:
        contDoc += 1
    lista = [[] for x in range(contDoc)]
    return lista

# Cria uma lista possibilitando multi usuários logar
def criarLista():
    iterar = col.find()
    contDoc = 1
    for doc in iterar:
        contDoc += 1
    lista = ['' for x in range(contDoc)]
    return lista
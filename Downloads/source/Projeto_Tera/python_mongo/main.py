from flask import Flask, request, jsonify
from flask_cors import CORS
from database import col
from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import create_access_token, JWTManager
from schema import alunos, admin, criarLista, criarInbox
import json
import datetime
import os


app = Flask(__name__)
CORS(app)

secret = datetime.datetime.now()
app.config["JWT_SECRET_KEY"] = os.environ.get("JWT_SECRET")
jwt = JWTManager(app)


#############################################################################################################

# ADMIN BACKUP
@app.route("/admin/backup", methods=["HEAD"])
def admin_backup():
    try:
        fileName = str(secret.strftime("%c")).replace(":", "-") + ".json"
        local = "C:\\Users\\Shonen\\Downloads\\source\\Projeto_Tera\\python_mongo\\backup\\"
        comp = os.path.join(local, fileName)
        f = open(comp, "w")
        user = col.find()
        for doc in user:
            if doc["_id"] > 1:
                f.write(json.dumps(doc) + "\n")
        f.close()
        return "", 200
    except:
        return "", 503


# ADMIN CREAT COLLECTION
@app.route("/admin/collection", methods=["POST"])
def admin_collection():
    try:
        import pymongo
        data = request.json
        mongo_client = pymongo.MongoClient("mongodb://localhost:27017/")
        database = mongo_client["cadastro"]
        collist = database.list_collection_names()
        if data["name"] in collist:
            return "", 205
        else:
            collection = database[data["name"]]
            senha = generate_password_hash(str(data["password"]))
            collection.insert_one(admin(senha))
            return "", 201
    except:
        return "", 501


# ADMIN DELETE COLLECTION
@app.route("/admin/delete", methods=["POST"])
def admin_delete_col():
    try:
        import pymongo
        data = request.json
        mongo_client = pymongo.MongoClient("mongodb://localhost:27017/")
        database = mongo_client["cadastro"]
        collist = database.list_collection_names()
        if data["name"] in collist:
            collection = database[data["name"]]
            collection.delete_many({})
            return "", 204
        else:
            return "", 404
    except:
        return "", 501


# ADMIN DROP COLLECTION
@app.route("/admin/drop", methods=["POST"])
def admin_drop():
    try:
        import pymongo
        data = request.json
        mongo_client = pymongo.MongoClient("mongodb://localhost:27017/")
        database = mongo_client["cadastro"]
        collist = database.list_collection_names()
        if data["name"] in collist:
            collection = database[data["name"]]
            collection.drop()
            return "", 204
        else:
            return "", 404
    except:
        return "", 501


# ADMIN USER LISTAR E ALL
@app.route("/admin/user", methods=["GET", "POST"])
def admin_fetch():
    if request.method == "POST":
        data = request.json
        user = col.find_one({"email":data["email"]})
        if user != None:
            return jsonify(user), 200
        else:
            return "", 204
    else:
        emails = []
        users = col.find()
        for doc in users:
            emails.append(doc["email"])
        emails.pop(0)
        return jsonify({"emails": emails}), 200


# ADMIN USER PUT
@app.route("/admin/update/<int:id>", methods=["PUT"])
def admin_update(id):
    data = request.json
    update = {"$set": {"status": data["status"]}}
    lista[id]["status"] = data["status"]
    col.find_one_and_update({"_id": id}, update)
    return "", 200


# ADMIN USER DELETE
@app.route("/admin/user/<int:id>", methods=["DELETE"])
def admin_delete(id):
    col.find_one_and_delete({"_id": id})
    return "", 204


#########################################################################################################################

# GET
@app.route("/", methods=["GET"])
def index():
    return {
        "Title": "Projeto Tera - Plataforma de Ensino",
        "Module": "Bootstrap, Python, Flask e MongoDB(NoSQL)",
        "Author": "Tiago Silva",
        "Version": "0.8.0"
    }


# POST Cadastar
@app.route("/creat", methods=["POST"])
def create_doc():
    try:
        data = request.json
        coll = col.find()
        id = 1
        for doc in coll:
            if doc["_id"] >= id:
                id = doc["_id"] + 1
        email = col.find_one({"email":data["email"]})
        if email == None:
            data["_id"] = id
            data["password"] = generate_password_hash(str(data["password"]))
            col.insert_one(alunos(data["_id"], data["name"], data["email"], data["password"], data["picture"], data["address"]))
            return "", 201
        else:
            return "", 409

    except:
        return "", 400


# POST Login
@app.route("/login", methods=["POST"])
def find_user():
    data = request.json
    user = col.find()
    for doc in user:
        if doc["_id"] == 1 and doc["email"] == data["email"] and check_password_hash(str(doc["password"]), str(data["password"])):
            admin = {"id": doc["_id"], "token": create_access_token(identity=doc["email"])}
            lista[doc["_id"]] = admin
            return jsonify(admin), 200
        elif doc["status"] == "ativo" and doc["email"] == data["email"] and check_password_hash(str(doc["password"]), str(data["password"])):
            usuario = { "id": doc["_id"],
                        "status": doc["status"],
                        "name": doc["name"],
                        "email": doc["email"],
                        "picture": doc["picture"],
                        "frontend": doc["frontend"],
                        "backend": doc["backend"],
                        "token": create_access_token(identity=doc["email"])
                        }
            lista[doc["_id"]] = usuario
            inbox[doc["_id"]] = doc["inbox"]
            return jsonify(usuario), 200
    else:
        return jsonify({"id": None}), 401
            

# PUT
@app.route("/update/<int:id>", methods=["PUT"])
def update_doc(id):
    data = request.json
    doc = col.find_one({"_id": id})
    if data["frontend"] != '':
        update = {"$set": {"frontend": data["frontend"]}}
        lista[id]["frontend"] = data["frontend"]
    elif data["backend"] != '':
        update = {"$set": {"backend": data["backend"]}}
        lista[id]["backend"] = data["backend"]
    elif data["name"] != '' and data["email"] != '' and data["picture"] != '':
        update = {"$set": {"name": data["name"], "email": data["email"], "picture": data["picture"]}}
        lista[id]["name"] = data["name"]
        lista[id]["email"] = data["email"]
        lista[id]["picture"] = data["picture"]
    elif data["pswd_atual"] != '' and data["pswd_novo"] != '':
        if check_password_hash(str(doc["password"]), str(data["pswd_atual"])):
            update = {"$set": {"password": generate_password_hash(str(data["pswd_novo"]))}}
        else:
            return "", 401
    else:
        return "", 401

    col.find_one_and_update({"_id": id}, update)
    return "", 200


# DELETE
@app.route("/user/<int:id>", methods=["DELETE"])
def user(id):
    data = request.json
    doc = col.find_one({"_id": id})
    if check_password_hash(str(doc["password"]), str(data["password"])):
        update = {"$set": {"status": "inativo"}}
        col.find_one_and_update({"_id": id}, update)
        return "", 204
    else:
        return "", 401


# Chat
inbox = criarInbox()

@app.route("/chat", methods=["POST", "GET", "HEAD"])
def living_chat():
    if request.method == "POST":
        data = request.json
        id = int(data["destinatario"])
        remetente = lista[int(data["remetente"])].get("name")
        data["remetente"] = remetente
        pos = inbox[int(data["destinatario"])]
        pos.append(data)
        update = {"$set": {"inbox": inbox[id]}}
        col.find_one_and_update({"_id": id}, update)
        return "", 200
    elif request.method == "GET":
        data = request.headers
        msn = inbox[int(data["id"])]
        return jsonify(msn), 200
    else:
        data = request.headers
        msn = inbox[int(data["id"])]
        msn.clear()
        update = {"$set": {"inbox": []}}
        col.find_one_and_update({"_id": int(data["id"])}, update)
        return "", 200


# AUTH
lista = criarLista()

@app.route("/auth", methods=["GET", "HEAD"])
def auth():
    data = request.headers
    if request.method == "GET":
        if data["id"] == 'null' or data["Authorization"] == 'null' or lista[int(data["id"])] == '':
            return jsonify({"id": None}), 403

        elif int(data["id"]) == 1 and lista[int(data["id"])]["token"] == data["Authorization"]:
            return jsonify({"id": lista[int(data["id"])]["id"],
                            "inbox": len(inbox[int(data["id"])])}), 200

        elif int(data["id"]) >= 2 and lista[int(data["id"])]["token"] == data["Authorization"]:
            return jsonify({"id": lista[int(data["id"])]["id"],
                            "status": lista[int(data["id"])]["status"],
                            "name": lista[int(data["id"])]["name"],
                            "email": lista[int(data["id"])]["email"],
                            "picture": lista[int(data["id"])]["picture"],
                            "frontend": lista[int(data["id"])]["frontend"],
                            "backend": lista[int(data["id"])]["backend"],
                            "inbox": len(inbox[int(data["id"])])
                            }), 200

        else:
            return jsonify({"id": None}), 403
                            
    else:
        lista[int(data["id"])] = ''
        return "", 200


if __name__ == "__main__":
    app.run(debug=True)
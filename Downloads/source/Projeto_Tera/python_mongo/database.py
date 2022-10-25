import pymongo
from pymongo import MongoClient

# Conecta com Mongo database local
client = pymongo.MongoClient("mongodb://localhost:27017")

# Banco de dados atual
db = client["cadastro"]

# Coleção atua do banco
col = db["users"]

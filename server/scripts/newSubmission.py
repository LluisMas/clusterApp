import sys
import subprocess
from pymongo import MongoClient
from bson.objectid import ObjectId

if __name__== "__main__":
    if len(sys.argv) < 2:
        print('no arguments passed')
        sys.exit()

    mongoHost = 'localhost'
    mongoPort = 27017
    assignment_id = sys.argv[1]

    mongo = MongoClient(mongoHost, mongoPort)
    db = mongo.tfg
    collection = db.submissions
    assignment = collection.find_one({'_id': ObjectId(assignment_id)})

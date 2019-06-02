import sys
import subprocess
import config
import collections
import operator
from pymongo import MongoClient
from bson.objectid import ObjectId

def Average(lst):
    return reduce(lambda a, b: int(a) + int(b), lst) / len(lst)

if __name__== "__main__":
    mongo = MongoClient(config.DATABASE['host'], config.DATABASE['port'])
    db = mongo.tfg
    result = db.assignments.find({"_id" : ObjectId("5cf3a82d5eaabe23f230f7a3") })

    assignment_id = "5cf3a82d5eaabe23f230f7a3"
    user = "5ccafcd5316dd6539529ff08"

    for r in result:
        print r['compilecommand'] == ''

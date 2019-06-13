import sys
import subprocess
import config
import collections
import operator
from pymongo import MongoClient
from bson.objectid import ObjectId

def Average(lst):
    return reduce(lambda a, b: int(a) + int(b), lst) / len(lst)

def evaluateResult(result, expected):
    return

if __name__== "__main__":
    with open("result.txt") as f:
        output = f.readlines()

    mongo = MongoClient(config.DATABASE['host'], config.DATABASE['port'])
    db = mongo.tfg
    assignment = db.assignments.find_one({'_id': ObjectId("5cf43ceb62c225285a53539d")})
    expected = assignment['runcommand'][0]['expected'].split('\n')

    result = [line[10:].strip() for line in output if line != '\n' and line.startswith('$resultado')]
    expectedClean = [str(line.strip()) for line in expected if line != '\n']
    print result
    print expectedClean
    print sorted(result) == sorted(expectedClean)

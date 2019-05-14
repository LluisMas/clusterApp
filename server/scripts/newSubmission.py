import sys, os
import subprocess
import config
from pymongo import MongoClient
from bson.objectid import ObjectId

if __name__== "__main__":
    if len(sys.argv) < 2:
        print('no arguments passed')
        sys.exit()

    submission_id = sys.argv[1]

    mongo = MongoClient(config.DATABASE['host'], config.DATABASE['port'])
    db = mongo.tfg
    submission = db.submissions.find_one({'_id': ObjectId(submission_id)})
    assignment = db.assignments.find_one({'_id': submission['assignment']})

    f = open(submission_id, 'w+')
    f.write(str(submission['file']))
    f.close()

    path = submission_id + '/' + str(assignment['_id'])
    connection = config.CLUSTER['user'] + '@' + config.CLUSTER['host']

    out = subprocess.check_output(['ssh', '-o' , 'ConnectTimeout=3', connection,' qsub lmr14/Ejercicio1/simple.sh'])
    out = out.split()
    jobId = out[2]

    submission['status'] = 2
    submission['jobId'] = jobId
    assignment = db.submissions.find_one_and_update(
        {'_id': ObjectId(submission_id)},
        {'$set': submission})

    # out = subprocess.check_output(['scp',submission_id, connection + ':' + path])
    os.remove(submission_id)


    print str(submission['_id'])

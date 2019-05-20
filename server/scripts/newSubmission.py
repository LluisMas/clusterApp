import sys, os
import subprocess
import config
from pymongo import MongoClient
from bson.objectid import ObjectId

def create_submission_file():
    return ''

if __name__== "__main__":
    if len(sys.argv) < 2:
        print('no arguments passed')
        sys.exit()

    submission_id = sys.argv[1]

    mongo = MongoClient(config.DATABASE['host'], config.DATABASE['port'])
    db = mongo.tfg
    submission = db.submissions.find_one({'_id': ObjectId(submission_id)})
    assignment = db.assignments.find_one({'_id': submission['assignment']})
    subject_id = str(assignment['subject'])
    assignment_id = str(assignment['_id'])

    f = open(submission_id, 'w+')
    f.write(str(submission['file']))
    f.close()

    path = subject_id + '/' + assignment_id + '/' + submission_id
    connection = config.CLUSTER['user'] + '@' + config.CLUSTER['host']

    submission_file = create_submission_file()

    out = subprocess.check_output(['ssh', '-o' , 'ConnectTimeout=3', connection,'mkdir', path]) # Create submission folder
    out = subprocess.check_output(['scp', submission_id, connection + ':' + path]) # Send files
    os.remove(submission_id) # We don't need the file locally anymore

    # out = subprocess.check_output(['ssh', '-o' , 'ConnectTimeout=3', connection,'qsub lmr14/Ejercicio1/simple.sh'])
    out = out.split()

    if (len(out) > 2):
        jobId = out[2]

        submission['status'] = 2
        submission['jobId'] = jobId
        assignment = db.submissions.find_one_and_update(
            {'_id': ObjectId(submission_id)},
            {'$set': submission})


    print str(submission['_id'])

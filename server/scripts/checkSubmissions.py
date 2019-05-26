import sys, os
import subprocess
import config
from pymongo import MongoClient
from bson.objectid import ObjectId

def clean_output(output):
    return ('\n').join([line.strip() for line in output if line != '\n'])

def handle_finished(submission):
    submission_id = str(submission['_id'])
    run_commands = assignment['runcommand']
    cpus = assignment['cpuamount']
    times_file = submission_id + '_times.txt'

    with open(times_file) as f:
        submission['executionTime'] = [line.split()[2] for line in f.readlines()]

    results = []
    outputs = []
    for i in range(len(run_commands)):
        expected = run_commands[i]['expected']

        for j in range(len(cpus)):
            result_file = submission_id + '_' + str(i) + '_' + str(j) + '_out.txt'
            with open(result_file) as f:
                lines = f.readlines()

            output = clean_output(lines)
            results.append(expected == output)
            submission['status'] = 3 if expected == output and submission['results'] != 4 else 4
            outputs.append(output)
            os.remove(result_file)

    submission['results'] = results
    submission['outputs'] = outputs
    db.submissions.find_one_and_update(
        {'_id': ObjectId(submission_id)},
        {'$set': submission})

    os.remove(times_file)


if __name__== "__main__":
    mongo = MongoClient(config.DATABASE['host'], config.DATABASE['port'])
    db = mongo.tfg
    result = db.submissions.find({'status': 2})
    connection = config.CLUSTER['user'] + '@' + config.CLUSTER['host']

    out = subprocess.check_output(['ssh', '-o' , 'ConnectTimeout=3', connection, 'qstat'])
    out = out.split()
    currentlyRunning = {}
    subjects = {}
    toFinish = []

    if len(out) > 0:
        out = out[11:]
        results = len(out) / 8
        print "-----------"
        for x in range(results):
            currentlyRunning[int(out[x * 8])] = True

    path = "{"
    for submission in result:
        submission_id = str(submission['_id'])
        assignment_id = str(submission['assignment'])

        if assignment_id not in subjects:
            assignment = db.assignments.find_one({'_id': ObjectId(assignment_id)})
            subjects[assignment_id] = assignment

        subject_id = str(subjects[assignment_id]['subject'])
        path += subject_id + '/' + assignment_id + '/' + submission_id + '/' + submission_id + '*,'

        toFinish.append(submission)

    path = path[:-1]
    path += "}{out.txt,times.txt}"
    out = subprocess.check_output(['scp', connection + ':' + path, '.'])

    for submission in toFinish:
        handle_finished(submission)

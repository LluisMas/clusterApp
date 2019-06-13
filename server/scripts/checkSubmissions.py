import sys, os
import subprocess
import config
import operator, collections
import json
from pymongo import MongoClient
from bson.objectid import ObjectId

def clean_output(output):
    return [line[10:].strip() for line in output if line != '\n' and line.startswith('$resultado')]

def clean_expected(expected):
    return [str(line.strip()) for line in expected.split() if line != '\n']

def Average(lst):
    return reduce(lambda a, b: int(a) + int(b), lst) / len(lst)

def updateOldRanking(submission):
    result = db.submissions.find({'status' : 2}, {"executionTime" : 1, "author" : 1})

    assignment_id = submission['assignment']
    user = submission['author']

    ranking = {}
    for submission in result:
        avg = Average(submission['executionTime'])
        author_id = str(submission['author'])

        if author_id not in ranking or ranking[author_id] > avg:
            ranking[author_id] = avg


    rankings = sorted(ranking.items(), key=operator.itemgetter(1))
    rankingToInsert = {x[0] : ind + 1  for ind, x in enumerate(rankings)}

    toinsert = {}
    toinsert['ranking'] = rankingToInsert
    toinsert['user'] = user
    toinsert['assignment'] = assignment_id

    db.oldrankings.delete_many({ '$and' :[{'user': user}, {'assignment': assignment_id}]})
    db.oldrankings.insert_one(toinsert)


def handle_finished(submission):
    submission_id = str(submission['_id'])
    run_commands = assignment['runcommand']
    cpus = assignment['cpuamount']
    times_file = submission_id + '_times.txt'

    try:
        with open(times_file) as f:
            submission['executionTime'] = [line.split()[2] for line in f.readlines()]

        os.remove(times_file)
    except IOError as e:
        submission['status'] = 5
        db.submissions.find_one_and_update(
            {'_id': ObjectId(submission_id)},
            {'$set': submission})

        sys.exit()


    results = []
    outputs = []
    correct = True
    for i in range(len(run_commands)):
        expected = clean_expected(run_commands[i]['expected'])
        expected = sorted(expected)

        for j in range(len(cpus)):
            result_file = submission_id + '_' + str(i) + '_' + str(j) + '_out.txt'

            try:
                with open(result_file) as f:
                    lines = f.readlines()

                output = sorted(clean_output(lines))
                outputs.append(output)
                results.append(expected == sorted(output))
                if correct:
                    correct = expected == output

                outputs.append(output)
                os.remove(result_file)
            except IOError as e:
                submission['status'] = 5
                outputs.append("")
                results.append(false)
                print e

    print 'Outputs:', outputs
    submission['results'] = results
    submission['outputs'] = outputs
    submission['status'] = 3 if correct else 4

    updateOldRanking(submission)
    db.submissions.find_one_and_update(
        {'_id': ObjectId(submission_id)},
        {'$set': submission})


if __name__== "__main__":
    mongo = MongoClient(config.DATABASE['host'], config.DATABASE['port'])
    db = mongo.tfg
    result = db.submissions.find({'status': 2})
    connection = config.CLUSTER['user'] + '@' + config.CLUSTER['host']

    if result.count() == 0:
        print "No jobs to check"
        sys.exit()

    out = subprocess.check_output(['ssh', '-o' , 'ConnectTimeout=3', connection, 'qstat'])
    out = out.split()
    currentlyRunning = {}
    subjects = {}
    toFinish = []

    if len(out) > 0:
        out = out[11:]
        results = len(out) / 8
        for x in range(results):
            currentlyRunning[int(out[x * 8])] = True

    path = "{" if result.count() > 1 else ""
    for submission in result:
        submission_id = str(submission['_id'])
        assignment_id = str(submission['assignment'])

        if int(submission['jobId']) in currentlyRunning:
            continue

        if assignment_id not in subjects:
            assignment = db.assignments.find_one({'_id': ObjectId(assignment_id)})
            subjects[assignment_id] = assignment

        subject_id = str(subjects[assignment_id]['subject'])
        path += subject_id + '/' + assignment_id + '/' + submission_id + '/' + submission_id + '*,'

        toFinish.append(submission)

    if len(toFinish) <= 0:
        sys.exit()

    path = path[:-1]
    path += "}{out.txt,times.txt}" if result.count() > 1 else "{out.txt,times.txt}"

    try:
        out = subprocess.check_output(['scp', connection + ':' + path, '.'])
    except subprocess.CalledProcessError as e:
        print e

    for submission in toFinish:
        handle_finished(submission)

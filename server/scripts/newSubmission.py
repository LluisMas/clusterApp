import sys, os
import subprocess
import config
from pymongo import MongoClient
from bson.objectid import ObjectId

def create_submission_file(subject_id, assignment, submission):
    submission_id = str(submission['_id'])
    assignment_id = str(assignment['_id'])
    submission_path = ('/').join([subject_id, assignment_id, submission_id])
    file_name = 'sub_' + submission_id + '.sh'

    f = open(file_name, 'w+')

    f.write("#!/bin/bash")
    f.write("\n#$ -cwd")
    f.write("\n#$ -S /bin/bash")
    f.write("\n#$ -j y")

    run_commands = assignment['runcommand']
    cpu = assignment['cpuamount']
    penv = assignment['parallelenvironment']
    tastkamount = len(cpu) * len (run_commands)

    # f.write("\n#$ -t 1-" + str(tastkamount))
    if penv == "mpich":
        f.write("\n#$ -pe %s %d" % (str(penv), max(cpu)) )

    f.write("\n## Comandos: " + str(run_commands))
    f.write("\n## CPU: " + str(cpu))

    if penv == "mpich":
        f.write("\n\nMPICH_MACHINES=$TMPDIR/mpich_machines")
        f.write("\ncat $PE_HOSTFILE | awk '{print $1\":\"$2}' > $MPICH_MACHINES\n")

    for i in range(len(run_commands)):
        for j in range(len(cpu)):
            f.write("\nts=$(date +%s%N)")
            if penv == "mpich":
                f.write("\nmpiexec -f $MPICH_MACHINES -n %d %s > %s_%d_%d_out.txt" % (cpu[j], run_commands[i]['command'], submission_id, i, j) )
            else:
                f.write("\n%s > %s_%d_%d_out.txt" % (run_commands[i]['command'], submission_id, i, j) )

            f.write("\ntt=$((($(date +%s%N) - $ts)/1000000))")
            f.write("\necho %d %d $tt >> %s_times.txt\n" % (i, j, submission_id))

    if penv == "mpich":
        f.write("\n\nrm -rf $MPICH_MACHINES")

    f.close()
    return file_name

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

    original_name = str(submission['originalName'])
    ext = original_name.split('.')
    ext.pop(0)
    ext = ('.').join(ext)

    file_name = submission_id + '.' + ext
    f = open(file_name, 'w+')
    f.write(str(submission['file']))
    f.close()

    path = subject_id + '/' + assignment_id + '/' + submission_id
    connection = config.CLUSTER['user'] + '@' + config.CLUSTER['host']

    submission_file = create_submission_file(subject_id, assignment, submission)

    out = subprocess.check_output(['ssh', '-o' , 'ConnectTimeout=3', connection,'mkdir', path]) # Create submission folder
    out = subprocess.check_output(['scp', file_name, submission_file, connection + ':' + path]) # Send files

    os.remove(file_name) # We don't need the file locally anymore
    os.remove(submission_file) # We don't need the file locally anymore

    out = subprocess.check_output(['ssh', '-o' , 'ConnectTimeout=3', connection, 'cd', path, '&& ' + 'qsub ' + submission_file])
    out = out.split()

    if (len(out) > 2):
        jobId = out[2]

        submission['status'] = 2 # Running
        submission['jobId'] = jobId
        assignment = db.submissions.find_one_and_update(
            {'_id': ObjectId(submission_id)},
            {'$set': submission})


    print str(submission['_id'])

import sys
import subprocess
import config

def initSubject():
    out = subprocess.check_output(['ssh', '-o' , 'ConnectTimeout=3', config.CLUSTER['user'] + '@' + config.CLUSTER['host'], 'mkdir', sys.argv[2]])

def initAssignment():
    if len(sys.argv) < 5:
        print('not enough arguments')
        sys.exit()

    subject = sys.argv[2]
    assignment = sys.argv[3]
    path = subject + '/' + assignment
    ext = sys.argv[4]

    file = 'uploads/' + assignment + '.' + ext
    clusterFile =  path + '/data/' + assignment + '.' + ext

    out = subprocess.check_output(['ssh', '-o' , 'ConnectTimeout=3', config.CLUSTER['user'] + '@' + config.CLUSTER['host'], 'mkdir', path, '&&' , 'mkdir', path + '/data'])
    out = subprocess.check_output(['scp', file, config.CLUSTER['user'] + '@' + config.CLUSTER['host'] + ':' + path + '/data'])

    if ext == 'zip':
        out = subprocess.check_output(['ssh', '-o' , 'ConnectTimeout=3', config.CLUSTER['user'] + '@' + config.CLUSTER['host'], 'unzip', '-o', '-qq',  clusterFile, '-d', path + '/data'])
    elif ext == 'tar':
        out = subprocess.check_output(['ssh', '-o' , 'ConnectTimeout=3', config.CLUSTER['user'] + '@' + config.CLUSTER['host'], 'tar', 'xvf', clusterFile, '-C', path + '/data'])
    elif ext == 'tar.gz' or ext == 'tar.z' or ext == 'tgz':
        out = subprocess.check_output(['ssh', '-o' , 'ConnectTimeout=3', config.CLUSTER['user'] + '@' + config.CLUSTER['host'], 'tar', 'xzvf', clusterFile, '-C', path + '/data'])

if __name__== "__main__":

    # To set the connection up:
    # - change user and server values to whatever
    # - Run the following commands to generate and add a keypair in order to securely connect:
    # - ssh-keygen
    # - ssh-copy-id user@server

    if len(sys.argv) < 3:
        print('not enough arguments')
        sys.exit()

    if sys.argv[1] == 'Subject':
        initSubject()
    elif sys.argv[1] == 'Assignment':
        initAssignment()

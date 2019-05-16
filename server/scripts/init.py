import sys
import subprocess
import config

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
        out = subprocess.check_output(['ssh', '-o' , 'ConnectTimeout=3', config.CLUSTER['user'] + '@' + config.CLUSTER['host'], 'mkdir', sys.argv[2]])
    elif sys.argv[1] == 'Assignment':
        out = subprocess.check_output(['ssh', '-o' , 'ConnectTimeout=3', config.CLUSTER['user'] + '@' + config.CLUSTER['host'], 'mkdir', sys.argv[2]])

import sys
import subprocess
import config

if __name__== "__main__":
    if len(sys.argv) < 3:
        print('not enough arguments')
        sys.exit()

    if sys.argv[1] == 'Subject':
        out = subprocess.check_output(['ssh', '-o' , 'ConnectTimeout=3', config.CLUSTER['user'] + '@' + config.CLUSTER['host'], 'rm -rf', sys.argv[2]])
    elif sys.argv[1] == 'Assignment':
        out = subprocess.check_output(['ssh', '-o' , 'ConnectTimeout=3', config.CLUSTER['user'] + '@' + config.CLUSTER['host'], 'rm -rf', sys.argv[2]])

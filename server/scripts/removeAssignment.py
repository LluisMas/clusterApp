import sys
import subprocess

if __name__== "__main__":
    if len(sys.argv) < 2:
        print('no arguments passed')
        sys.exit()

    out = subprocess.check_output(['ssh', '-o' , 'ConnectTimeout=3', config.CLUSTER['user'], + '@' + config.CLUSTER['host'], 'rm', '-rf', sys.argv[1]])

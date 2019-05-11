import sys
import subprocess

if __name__== "__main__":
    if len(sys.argv) < 2:
        print('no arguments passed')
        sys.exit()

    user = 'user'
    server = 'server'
    out = subprocess.check_output(['ssh', '-o' , 'ConnectTimeout=3', user + '@' + server, 'rm', '-rf', sys.argv[1]])

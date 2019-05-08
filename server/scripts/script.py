import sys
import subprocess

if __name__== "__main__":

    user = 'lmr14'
    server = '172.16.0.156'
    # out = subprocess.check_output(['scp','script.py', user + '@' + server + ':.'])
    # out = subprocess.check_output(['ssh', user + '@' + server, 'ls'])
    out = subprocess.check_output(['ls'])
    print out, sys.argv[1]

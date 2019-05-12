import sys
import subprocess

if __name__== "__main__":

    # To set the connection up:
    # - change user and server values to whatever
    # - Run the following commands to generate and add a keypair in order to securely connect:
    # - ssh-keygen
    # - ssh-copy-id user@server

    if len(sys.argv) < 2:
        print('no arguments passed')
        sys.exit()

    user = 'user'
    server = 'server'
    out = subprocess.check_output(['ssh', '-o' , 'ConnectTimeout=3', user + '@' + server, 'mkdir', sys.argv[1]])

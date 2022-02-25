# wonderbites.com

## Server Details
**HOST** : `18.222.25.196`
**PORT** : `22`
**USER** : `ubuntu`

**Note** : For Login you must have the `.pem`/`ssh` key file.


## Deploy Steps
Below deployment steps is only for `AWS` EC2 instance `18.222.25.196`.

1. Login to server via any ssh client.
2. Change directory (cd) to `/home/ubuntu/sites/wonderbites.com`.
3. Run git command to pull the latest changes/code (`git pull`).
4. In case you find any npm depencies missing then install them via `yarn install`.
5. Now generate build files using command `yarn build`.
6. You are all done!

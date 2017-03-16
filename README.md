# aws-vault-reference-application
A sample Vault aware client application for the Vault defined by https://github.com/mike-goodwin/aws-vault-reference-infrastructure.

## prerequisites

1. Vault (quel surprise)
2. MySQL: The reference architecture uses a [MySQL secret backend](https://www.vaultproject.io/docs/secrets/mysql)
3. The ["world" sample MySQL database](https://dev.mysql.com/doc/world-setup/en/world-setup-installation.html)
3. node: This example application is a simple node application

## Setup (for local development)

The example application requires some environment variables:

* `DB_HOST`: The DB server (e.g `localhost`)
* `DB_DATABASE`: The name of the database (e.g. `world`)
* `VAULT_LEASE_ADDR`: The URL where the app can renew credential leases (e.g. `http://127.0.0.1:8200/v1/sys/renew/`) (needs the trailing slash)
* `VAULT_CRED_ADDR`: The URL where the app can fetch credentials (e.g. `http://127.0.0.1:8200/v1/mysql/creds/readonly`)
* `VAULT_LEASE`: How long the app will wait before renewing a lease, in seconds (must be less than the actual lease time (e.g. `10`)
* `VAULT_LEASE_PADDING`: A bit of padding to prevent accidental lease expiries, in seconds (e.g. '2')
* `VAULT_TOKEN`: The root token that Vault generates when it starts (e.g. `85e9e183-4997-f203-0200-1f89461eae16`)

To start and configure Vault in dev mode:

`vault server -dev`
`vault mount mysql`
`vault write mysql/config/connection connection_url="root:<YOUR PWD HERE>@tcp(localhost:3306)/"`
`vault write mysql/config/lease lease=15s lease_max=1m`
`vault write mysql/roles/readonly sql="CREATE USER '{{name}}'@'%' IDENTIFIED BY '{{password}}';GRANT SELECT ON *.* TO '{{name}}'@'%';"`

## About the authors

We are not affiliated to Hashicorp or the Vault project in any way and any recommendations made are our own and not endorsed by Hashicorp. 
We just like Vault, AWS, security and messing about with cool tech :-)

#!/bin/bash

# Load common functions
source 000.functions.sh

# Verify environment variables
verify_domain_name $1

aws route53 create-hosted-zone --name "$1" --caller-reference "Crossroads command line initialization"

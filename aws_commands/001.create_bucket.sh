#!/bin/bash

# Load common functions
source 000.functions.sh

# Verify environment variables
verify_domain_name $1

aws s3 mb "s3://$1"
aws s3 website "s3://$1" --index-document index.html

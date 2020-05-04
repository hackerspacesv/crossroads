verify_domain_name () {
	if [ "$1" = "" ]
	then
		echo "You must specify a domain name..."
 		exit
	fi
}

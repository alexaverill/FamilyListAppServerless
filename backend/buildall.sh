declare -a arr=("createEvent" "createItems" "getEvent" "getEvents" "getList" "getLists" "createUser" "getUsers" "claimItems" "unclaimItem" "deleteItem") 
for item in "${arr[@]}"; do
    echo "$item"
    lambdaPath="./src/${item}"
    echo "$lambdaPath"
    pushd $lambdaPath
    npm run build
    popd
done
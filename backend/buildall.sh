declare -a arr=("createEvent" "createList" "getEvent" "getEvents" "getList" "getLists")
for item in "${arr[@]}"; do
    echo "$item"
    lambdaPath="./src/${item}"
    echo "$lambdaPath"
    pushd $lambdaPath
    npm run build
    popd
done
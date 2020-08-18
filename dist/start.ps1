if(-not (Test-Path node_modules)) {
    echo "Packages not founded\nInstalling Packages..";
    npm install
}else{
    echo "Packages founded"
}
echo "Starting server"
start http://localhost:1234/
npm run start
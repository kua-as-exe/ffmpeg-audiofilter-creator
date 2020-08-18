if(-not (Test-Path node_modules)) {
    echo "Packages not founded"
    echo "Installing Packages.."
    npm install
}else{
    echo "Packages founded"
}
echo "Starting server"
npm run start
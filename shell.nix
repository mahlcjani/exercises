with import <nixpkgs> {};

mkShellNoCC {
    packages = [
        nodejs
    ];
    shellHook = ''
        echo Updating packages...
        npm install
    '';
}


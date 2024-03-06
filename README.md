<div><strong>Node.js v20.10.0</strong></div>
<div><strong>npm v10.2.3</strong></div>

<div><strong>Deploy to github pages:</strong></div>
1. In ".git/config" : 
    [remote "origin"]
        url = https://github.com/tzetzo/Three-TS.git
2. uses ".github/workflows/production.yml" from the repo;
3. github.com - Settings - Pages - shows the URL (https://tzetzo.github.io/Three-TS/)
4. github.com - Actions - shows the workflows/pipelines;

<div><strong>Deploy to gitlab pages:</strong></div>
1. In ".git/config" : 
    [remote "origin"]
        url = https://gitlab.com/tzetzo/Three-TS.git
2. uses ".gitlab-ci.yml" from the repo;
3. gitlab.com - Deploy - Pages - shows the URL (https://three-ts-tzetzo-ff07d67a58155a9d1ee8e61ba5632abbef1e32c94487450.gitlab.io/)
4. gitlab.com - Build - Pipelines - shows the pipelines;
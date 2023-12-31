// place at : deploy/ghpages.js
// you can see more info at https://israynotarray.com/git/20230530/3386912069/
import path from 'path';
import ghpages from 'gh-pages';

const options = {
    branch: 'gh-pages',
    repo: 'https://github.com/hsuchihting/tgcffc.git' // project github repo
};

const callback = err => {

    if (err) console.error(err);
    else console.log('publish success');
};

/**
 * This task pushes to the `master` branch of the configured `repo`.
 */
ghpages.publish(path.resolve(process.cwd(), './dist'), options, callback);
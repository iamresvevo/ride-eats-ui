import {readdirSync,readFileSync,existsSync} from 'node:fs';
import {spawnSync} from 'node:child_process';
import {resolve,dirname} from 'node:path';
for(const file of readdirSync('src').filter(f=>f.endsWith('.js'))){
 const path=resolve('src',file),result=spawnSync(process.execPath,['--check',path],{encoding:'utf8'});
 if(result.status)throw new Error(result.stderr);
 for(const match of readFileSync(path,'utf8').matchAll(/(?:from|import)\s*['"](\.[^'"]+)['"]/g))if(!existsSync(resolve(dirname(path),match[1])))throw new Error('Missing import '+match[1]);
}
console.log('All modules parse; relative imports resolve.');

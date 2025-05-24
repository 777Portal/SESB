import { execSync } from 'child_process';
import { closest, distance } from 'fastest-levenshtein';

export function dateDifferenceSeconds(dt2, dt1) 
{
  var diff = ( dt2.getTime() - dt1.getTime() ) / 1000; // sec
  return Math.abs(Math.round(diff));
}

export function formatTimeSince(timestamp){
  let date = new Date(timestamp);
  let minutesAgo = dateDifferenceSeconds(date, new Date()) / 60;
  let difference = -1;

  if ( minutesAgo >= 60 * 24 ){
    difference = ( (minutesAgo / 60 / 24).toFixed(2) ) + " days"
  } else if (minutesAgo >= 60) {
    difference = ( (minutesAgo / 60 ).toFixed(2) ) + " hours"
  } else {
    difference = ( minutesAgo.toFixed(2) ) + " minutes"
  }
  
  return difference;
}

export function isSimilar(a, b, threshold = 5) {
  return distance(a.toLowerCase(), b.toLowerCase()) <= threshold;
}

export function topNClosest(str, arr, n = 3) {
  return arr
    .map(item => ({ item, dist: distance(str, item.text) }))
    .sort((a, b) => a.dist - b.dist)
    .slice(0, n);
}

export function arrayStringFormat (array)
{
  // console.log(array, array.toString(), array.toString().replace(",", "] ["))
  let arr = array.toString();
  if (arr.toString() == '' ) return "";
  arr = arr.replace(",", "] [")
  arr = arr + "] "
  arr = " [" + arr;
  
  return arr;
}

const revision = execSync('git rev-parse --short HEAD').toString().trim();
export function getRevision() 
{
  return revision;
}

export function getCurrentRevision()
{
  const revision = execSync('git rev-parse --short HEAD').toString().trim();
  return revision
}

export function getGitLogByHash(hash){
  const gitLog = execSync(`git log -1 --pretty=format:"%s, %ai" ${hash}`).toString().trim();
  return gitLog;
}

export function exec(text){
  const gitLog = execSync(text).toString().trim();
  return gitLog;
}